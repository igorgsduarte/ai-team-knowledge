import { useState } from "react";
import { useParams, useLocation } from "wouter";
import {
  useGetKnowledge,
  useDeleteKnowledge,
  useListKnowledgeComments,
  useCreateKnowledgeComment,
  useDeleteComment,
  getListKnowledgeCommentsQueryKey,
  getListKnowledgeQueryKey,
} from "@workspace/api-client-react";
import { useGetMe } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, Link2, Trash2, MessageSquare, Send, ExternalLink, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

function CommentItem({ comment, myId, onDelete }: { comment: any; myId?: number; onDelete: () => void }) {
  const deleteComment = useDeleteComment();
  const handleDelete = () => {
    deleteComment.mutate({ commentId: comment.id }, { onSuccess: onDelete });
  };
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
          <button onClick={handleDelete} className="mt-1 text-xs text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
            excluir
          </button>
        )}
      </div>
    </div>
  );
}

export default function KnowledgeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const entryId = Number(id);
  const [, setLocation] = useLocation();
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entry, isLoading } = useGetKnowledge(entryId);
  const { data: me } = useGetMe();
  const { data: comments = [], refetch: refetchComments } = useListKnowledgeComments(entryId, {
    query: { queryKey: getListKnowledgeCommentsQueryKey(entryId) },
  });
  const createComment = useCreateKnowledgeComment();
  const deleteKnowledge = useDeleteKnowledge();

  const handleComment = () => {
    if (!comment.trim()) return;
    createComment.mutate(
      { entryId, data: { content: comment } },
      {
        onSuccess: () => {
          setComment("");
          refetchComments();
          queryClient.invalidateQueries({ queryKey: getListKnowledgeCommentsQueryKey(entryId) });
        },
      }
    );
  };

  const handleDelete = () => {
    deleteKnowledge.mutate({ entryId }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListKnowledgeQueryKey() });
        toast({ title: "Entrada removida" });
        setLocation("/knowledge");
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

  if (!entry) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setLocation("/knowledge")} className="gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Banco de Conhecimento
        </Button>
        <p className="text-muted-foreground">Entrada não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setLocation("/knowledge")} className="gap-2 text-muted-foreground -ml-2">
          <ArrowLeft className="w-4 h-4" /> Banco de Conhecimento
        </Button>
        {me?.id === entry.authorId && (
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="w-4 h-4 mr-1.5" /> Excluir
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${entry.type === "article" ? "bg-primary/15 text-primary" : "bg-cyan-500/15 text-cyan-400"}`}>
            {entry.type === "article" ? <FileText className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
            {entry.type === "article" ? "Artigo" : "Link Curado"}
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight leading-tight">{entry.title}</h1>

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

        {entry.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {entry.tags.map((t: string) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        {entry.type === "article" && entry.content && (
          <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
            {entry.content}
          </div>
        )}
        {entry.type === "link" && (
          <div className="space-y-4">
            {entry.description && (
              <p className="text-muted-foreground leading-relaxed">{entry.description}</p>
            )}
            {entry.url && (
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/15 transition-colors text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir link
              </a>
            )}
          </div>
        )}
      </div>

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
              placeholder="Adicione um comentário..."
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
                queryClient.invalidateQueries({ queryKey: getListKnowledgeCommentsQueryKey(entryId) });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
