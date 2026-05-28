import { useState } from "react";
import { useParams, useLocation } from "wouter";
import {
  useGetSkill,
  useListSkillComments,
  useCreateSkillComment,
  useDeleteComment,
  getListSkillCommentsQueryKey,
} from "@workspace/api-client-react";
import { useGetMe, useAddMySkill, useRemoveMySkill, useListMySkills, getListMySkillsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Tag, Users, MessageSquare, Send, CheckCircle2, Plus, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
  expert: "Expert",
};

const LEVEL_COLORS: Record<string, string> = {
  beginner: "bg-blue-500/15 text-blue-400",
  intermediate: "bg-amber-500/15 text-amber-400",
  advanced: "bg-green-500/15 text-green-400",
  expert: "bg-primary/15 text-primary",
};

function CommentItem({ comment, myId, onDelete }: { comment: any; myId?: number; onDelete: () => void }) {
  const deleteComment = useDeleteComment();
  return (
    <div className="flex gap-3 group">
      <Avatar className="w-7 h-7 shrink-0">
        <AvatarImage src={comment.author?.avatarUrl ?? undefined} />
        <AvatarFallback className="text-xs">{comment.author?.name?.[0] ?? "?"}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="bg-muted rounded-lg px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold">{comment.author?.name ?? "Usuário"}</span>
            <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
          </div>
          <p className="text-sm mt-1 leading-relaxed">{comment.content}</p>
        </div>
        {myId === comment.authorId && (
          <button
            onClick={() => deleteComment.mutate({ commentId: comment.id }, { onSuccess: onDelete })}
            className="mt-1 text-xs text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
          >
            excluir
          </button>
        )}
      </div>
    </div>
  );
}

export default function SkillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const skillId = Number(id);
  const [, setLocation] = useLocation();
  const [comment, setComment] = useState("");
  const [addLevel, setAddLevel] = useState("beginner");
  const [addOpen, setAddOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: skill, isLoading } = useGetSkill(skillId);
  const { data: me } = useGetMe();
  const { data: mySkills = [] } = useListMySkills({ query: { queryKey: getListMySkillsQueryKey() } });
  const { data: comments = [], refetch: refetchComments } = useListSkillComments(skillId, {
    query: { queryKey: getListSkillCommentsQueryKey(skillId) },
  });

  const createComment = useCreateSkillComment();
  const addMySkill = useAddMySkill();
  const removeMySkill = useRemoveMySkill();

  const mySkillEntry = mySkills.find((s: any) => s.skillId === skillId);

  const handleComment = () => {
    if (!comment.trim()) return;
    createComment.mutate(
      { skillId, data: { content: comment } },
      {
        onSuccess: () => {
          setComment("");
          refetchComments();
          queryClient.invalidateQueries({ queryKey: getListSkillCommentsQueryKey(skillId) });
        },
      }
    );
  };

  const handleAdd = () => {
    addMySkill.mutate(
      { data: { skillId, level: addLevel as any } },
      {
        onSuccess: () => {
          setAddOpen(false);
          queryClient.invalidateQueries({ queryKey: getListMySkillsQueryKey() });
          toast({ title: `${skill?.name} adicionada ao seu perfil!` });
        },
        onError: () => toast({ title: "Erro ao adicionar skill", variant: "destructive" }),
      }
    );
  };

  const handleRemove = () => {
    removeMySkill.mutate({ skillId }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMySkillsQueryKey() });
        toast({ title: "Skill removida do seu perfil" });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setLocation("/skills")} className="gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Banco de Skills
        </Button>
        <p className="text-muted-foreground">Skill não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Button variant="ghost" onClick={() => setLocation("/skills")} className="gap-2 text-muted-foreground -ml-2">
        <ArrowLeft className="w-4 h-4" /> Banco de Skills
      </Button>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight">{skill.name}</h1>
            {skill.description && (
              <p className="text-muted-foreground leading-relaxed">{skill.description}</p>
            )}
          </div>
          <div className="shrink-0">
            {mySkillEntry ? (
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${LEVEL_COLORS[mySkillEntry.level] ?? ""}`}>
                  <CheckCircle2 className="w-3 h-3" />
                  {LEVEL_LABELS[mySkillEntry.level] ?? mySkillEntry.level}
                </span>
                <Button variant="ghost" size="sm" onClick={handleRemove} className="text-xs text-muted-foreground hover:text-destructive h-7 px-2">
                  remover
                </Button>
              </div>
            ) : (
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Adicionar ao perfil
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader><DialogTitle>Adicionar {skill.name} ao seu perfil</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>Seu nível</Label>
                      <Select value={addLevel} onValueChange={setAddLevel}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Iniciante</SelectItem>
                          <SelectItem value="intermediate">Intermediário</SelectItem>
                          <SelectItem value="advanced">Avançado</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAdd} disabled={addMySkill.isPending} className="w-full">
                      {addMySkill.isPending ? "Adicionando..." : "Confirmar"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{skill.usersCount} {skill.usersCount === 1 ? "pessoa" : "pessoas"}</span>
          <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" />{(skill as any).commentsCount ?? 0} {(skill as any).commentsCount === 1 ? "comentário" : "comentários"}</span>
        </div>

        {skill.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skill.tags.map((t: string) => (
              <Badge key={t} variant="secondary" className="text-xs gap-1">
                <Tag className="w-2.5 h-2.5" />{t}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {skill.users && skill.users.length > 0 && (
        <div className="border-t pt-6 space-y-3">
          <h2 className="font-semibold text-sm">Quem tem essa skill</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {skill.users.map((us: any) => (
              <div key={us.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={us.user?.avatarUrl ?? undefined} />
                  <AvatarFallback>{us.user?.name?.[0] ?? "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{us.user?.name ?? "Usuário"}</p>
                  {us.user?.area && <p className="text-xs text-muted-foreground truncate">{us.user.area}</p>}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEVEL_COLORS[us.level] ?? ""}`}>
                  {LEVEL_LABELS[us.level] ?? us.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm">{comments.length} {comments.length === 1 ? "comentário" : "comentários"}</h2>
        </div>

        <div className="flex gap-3">
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarImage src={me?.avatarUrl ?? undefined} />
            <AvatarFallback>{me?.name?.[0] ?? "?"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Compartilhe sua experiência com essa skill..."
              rows={2}
              className="text-sm resize-none"
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleComment(); }}
            />
            <Button size="sm" onClick={handleComment} disabled={!comment.trim() || createComment.isPending} className="self-end">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {comments.map((c: any) => (
            <CommentItem
              key={c.id}
              comment={c}
              myId={me?.id}
              onDelete={() => {
                refetchComments();
                queryClient.invalidateQueries({ queryKey: getListSkillCommentsQueryKey(skillId) });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
