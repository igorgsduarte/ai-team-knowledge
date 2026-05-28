import { useState } from "react";
import { useLocation } from "wouter";
import { useListKnowledge, useCreateKnowledge, getListKnowledgeQueryKey } from "@workspace/api-client-react";
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
import { MessageSquare, Plus, FileText, Link2, Search, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

function CreateKnowledgeDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"article" | "link">("article");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const createKnowledge = useCreateKnowledge();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!title.trim()) return;
    createKnowledge.mutate(
      {
        data: {
          type,
          title,
          content: type === "article" ? content : undefined,
          url: type === "link" ? url : undefined,
          description,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
          setTitle(""); setContent(""); setUrl(""); setDescription(""); setTags("");
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
        <Button><Plus className="w-4 h-4 mr-2" />Nova Entrada</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Adicionar ao Banco de Conhecimento</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Tipo</Label>
            <Select value={type} onValueChange={(v) => setType(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Artigo</SelectItem>
                <SelectItem value="link">Link Curado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Título</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título do artigo ou link" />
          </div>
          {type === "article" ? (
            <div>
              <Label>Conteúdo</Label>
              <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Escreva o resumo ou artigo completo..." rows={6} />
            </div>
          ) : (
            <>
              <div>
                <Label>URL</Label>
                <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Por que vale a pena ler?" rows={3} />
              </div>
            </>
          )}
          <div>
            <Label>Tags (separadas por vírgula)</Label>
            <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="ex: react, performance, design" />
          </div>
          <Button onClick={handleSubmit} disabled={createKnowledge.isPending} className="w-full">
            {createKnowledge.isPending ? "Criando..." : "Criar Entrada"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function KnowledgeCard({ entry }: { entry: any }) {
  const [, setLocation] = useLocation();

  return (
    <Card
      className="hover:border-border/80 hover:bg-muted/30 transition-all cursor-pointer group"
      onClick={() => setLocation(`/knowledge/${entry.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Avatar className="w-7 h-7">
              <AvatarImage src={entry.author?.avatarUrl ?? undefined} />
              <AvatarFallback className="text-xs">{entry.author?.name?.[0] ?? "?"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium">{entry.author?.name ?? "Usuário"}</p>
              <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${entry.type === "article" ? "bg-primary/15 text-primary" : "bg-cyan-500/15 text-cyan-400"}`}>
            {entry.type === "article" ? <FileText className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
            {entry.type === "article" ? "Artigo" : "Link"}
          </span>
        </div>
        <CardTitle className="text-sm font-semibold mt-2 leading-snug group-hover:text-primary transition-colors">{entry.title}</CardTitle>
        {entry.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {entry.tags.slice(0, 3).map((t: string) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
            {entry.tags.length > 3 && <Badge variant="secondary" className="text-xs">+{entry.tags.length - 3}</Badge>}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {entry.type === "article" && entry.content && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{entry.content}</p>
        )}
        {entry.type === "link" && entry.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{entry.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="w-3.5 h-3.5" />
            {entry.commentsCount ?? 0} {(entry.commentsCount ?? 0) === 1 ? "comentário" : "comentários"}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function KnowledgePage() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const { data: me } = useGetMe();
  const queryClient = useQueryClient();

  const params: any = {};
  if (typeFilter !== "all") params.type = typeFilter;
  if (search) params.search = search;

  const { data: entries, isLoading, refetch } = useListKnowledge(
    params,
    { query: { queryKey: getListKnowledgeQueryKey(params) } }
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Banco de Conhecimento</h2>
          <p className="text-muted-foreground text-sm">Artigos escritos e links curados pelo time.</p>
        </div>
        <CreateKnowledgeDialog onCreated={() => { queryClient.invalidateQueries({ queryKey: getListKnowledgeQueryKey() }); refetch(); }} />
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="article">Artigos</SelectItem>
            <SelectItem value="link">Links</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p className="text-muted-foreground text-sm">Carregando...</p>}
      {!isLoading && entries?.length === 0 && (
        <Card className="py-12 text-center">
          <CardContent>
            <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nenhuma entrada ainda. Compartilhe o primeiro conhecimento!</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {entries?.map(entry => (
          <KnowledgeCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
