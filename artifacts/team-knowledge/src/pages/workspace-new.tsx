import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateWorkspace } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListWorkspacesQueryKey } from "@workspace/api-client-react";
import { Building2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function WorkspaceNewPage() {
  const [name, setName] = useState("");
  const [, setLocation] = useLocation();
  const createWorkspace = useCreateWorkspace();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createWorkspace.mutate(
      { data: { name: name.trim() } },
      {
        onSuccess: (workspace) => {
          localStorage.setItem("currentWorkspaceId", String(workspace.id));
          queryClient.invalidateQueries({ queryKey: getListWorkspacesQueryKey() });
          toast({ title: `Workspace "${workspace.name}" criado!` });
          setLocation("/dashboard");
        },
        onError: () => toast({ title: "Erro ao criar workspace", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
            <Building2 className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Crie seu workspace</h1>
          <p className="text-muted-foreground text-sm">
            Um workspace é onde você e seu time gerenciam conhecimento, skills e aprendizados.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workspace-name">Nome do workspace</Label>
            <Input
              id="workspace-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Equipe de Produto, Frontend Team…"
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={!name.trim() || createWorkspace.isPending}>
            {createWorkspace.isPending
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Criando...</>
              : <>Criar workspace <ArrowRight className="w-4 h-4 ml-2" /></>
            }
          </Button>
        </form>
      </div>
    </div>
  );
}
