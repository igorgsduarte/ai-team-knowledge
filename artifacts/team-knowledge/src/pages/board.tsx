import { useState } from "react";
import { useListBoards, useCreateBoard, useGetBoard, useUpdateBoard, useDeleteBoard, useListBoardComments, useCreateBoardComment, getListBoardsQueryKey, getGetBoardQueryKey, getListBoardCommentsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetMe } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Plus, Trash2, BookOpen, Hammer, CheckCircle2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const STATUS_LABELS: Record<string, { label: string; icon: any; color: string }> = {
  learning: { label: "Aprendendo", icon: BookOpen, color: "bg-blue-100 text-blue-700" },
  doing: { label: "Fazendo", icon: Hammer, color: "bg-amber-100 text-amber-700" },
  done: { label: "Concluído", icon: CheckCircle2, color: "bg-green-100 text-green-700" },
};

function CreateBoardDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"learning" | "doing" | "done">("learning");
  const [tags, setTags] = useState("");
  const createBoard = useCreateBoard();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!title.trim()) return;
    createBoard.mutate(
      { data: { title, content, status, tags: tags.split(",").map(t => t.trim()).filter(Boolean) } },
      {
        onSuccess: () => {
          setOpen(false);
          setTitle(""); setContent(""); setTags("");
          onCreated();
          toast({ title: "Entrada criada com sucesso!" });
        },
        onError: () => toast({ title: "Erro ao criar entrada", variant: "destructive" }),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-create-board"><Plus className="w-4 h-4 mr-2" />Nova Entrada</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Nova Entrada no Board</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Título</Label>
            <Input data-testid="input-board-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="O que você está aprendendo ou fazendo?" />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea data-testid="input-board-content" value={content} onChange={e => setContent(e.target.value)} placeholder="Detalhes, links, notas..." rows={4} />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger data-testid="select-board-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="learning">Aprendendo</SelectItem>
                <SelectItem value="doing">Fazendo</SelectItem>
                <SelectItem value="done">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tags (separadas por vírgula)</Label>
            <Input data-testid="input-board-tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="ex: react, typescript, api" />
          </div>
          <Button data-testid="button-submit-board" onClick={handleSubmit} disabled={createBoard.isPending} className="w-full">
            {createBoard.isPending ? "Criando..." : "Criar Entrada"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BoardCard({ entry, myId, onDelete }: { entry: any; myId?: number; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState("");
  const { data: comments } = useListBoardComments(entry.id, { query: { enabled: expanded, queryKey: getListBoardCommentsQueryKey(entry.id) } });
  const createComment = useCreateBoardComment();
  const deleteBoard = useDeleteBoard();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const statusInfo = STATUS_LABELS[entry.status] ?? STATUS_LABELS.learning;
  const Icon = statusInfo.icon;

  const handleComment = () => {
    if (!comment.trim()) return;
    createComment.mutate(
      { boardId: entry.id, data: { content: comment } },
      {
        onSuccess: () => {
          setComment("");
          queryClient.invalidateQueries({ queryKey: getListBoardCommentsQueryKey(entry.id) });
        },
      }
    );
  };

  const handleDelete = () => {
    deleteBoard.mutate({ boardId: entry.id }, {
      onSuccess: () => { onDelete(); toast({ title: "Entrada removida" }); },
    });
  };

  return (
    <Card data-testid={`card-board-${entry.id}`} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={entry.author?.avatarUrl ?? undefined} />
              <AvatarFallback>{entry.author?.name?.[0] ?? "?"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{entry.author?.name ?? "Usuário"}</p>
              <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
              <Icon className="w-3 h-3" />{statusInfo.label}
            </span>
            {myId === entry.authorId && (
              <Button variant="ghost" size="sm" onClick={handleDelete} data-testid={`button-delete-board-${entry.id}`}>
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
        <CardTitle className="text-base mt-2">{entry.title}</CardTitle>
        {entry.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {entry.tags.map((t: string) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
          </div>
        )}
      </CardHeader>
      {entry.content && (
        <CardContent className="pt-0 pb-3">
          <p className="text-sm text-muted-foreground">{entry.content}</p>
        </CardContent>
      )}
      <CardContent className="pt-0">
        <button
          data-testid={`button-toggle-comments-${entry.id}`}
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          {entry.commentsCount} {entry.commentsCount === 1 ? "comentário" : "comentários"}
        </button>

        {expanded && (
          <div className="mt-3 space-y-3">
            {comments?.map(c => (
              <div key={c.id} className="flex gap-2" data-testid={`comment-${c.id}`}>
                <Avatar className="w-6 h-6">
                  <AvatarImage src={c.author?.avatarUrl ?? undefined} />
                  <AvatarFallback className="text-xs">{c.author?.name?.[0] ?? "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-muted rounded-md px-3 py-2">
                  <p className="text-xs font-medium">{c.author?.name}</p>
                  <p className="text-xs">{c.content}</p>
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <Textarea
                data-testid={`input-comment-board-${entry.id}`}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Adicione um comentário..."
                rows={2}
                className="text-sm"
              />
              <Button size="sm" onClick={handleComment} disabled={createComment.isPending} data-testid={`button-submit-comment-${entry.id}`}>
                Enviar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function BoardPage() {
  const { data: boards, isLoading, refetch } = useListBoards();
  const { data: me } = useGetMe();
  const queryClient = useQueryClient();

  const handleDelete = () => {
    queryClient.invalidateQueries({ queryKey: getListBoardsQueryKey() });
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Board do Time</h2>
          <p className="text-muted-foreground">O que cada pessoa está aprendendo e fazendo.</p>
        </div>
        <CreateBoardDialog onCreated={() => { queryClient.invalidateQueries({ queryKey: getListBoardsQueryKey() }); refetch(); }} />
      </div>

      {isLoading && <p className="text-muted-foreground">Carregando...</p>}
      {!isLoading && boards?.length === 0 && (
        <Card className="py-12 text-center">
          <CardContent>
            <Clock className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nenhuma entrada ainda. Crie a primeira!</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {boards?.map(entry => (
          <BoardCard key={entry.id} entry={entry} myId={me?.id} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
