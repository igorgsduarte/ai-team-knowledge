import { useState } from "react";
import { useGetMe, useUpdateMe, useListMySkills, getListMySkillsQueryKey, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit2, Save, X, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/react";

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
};

const LEVEL_COLORS: Record<string, string> = {
  beginner: "bg-blue-100 text-blue-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-green-100 text-green-700",
};

export default function ProfilePage() {
  const { data: me, isLoading } = useGetMe();
  const { data: mySkills } = useListMySkills({ query: { queryKey: getListMySkillsQueryKey() } });
  const updateMe = useUpdateMe();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useUser();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [area, setArea] = useState("");

  const startEdit = () => {
    setName(me?.name ?? "");
    setBio(me?.bio ?? "");
    setArea(me?.area ?? "");
    setEditing(true);
  };

  const handleSave = () => {
    updateMe.mutate(
      { data: { name, bio, area } },
      {
        onSuccess: () => {
          setEditing(false);
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          toast({ title: "Perfil atualizado com sucesso!" });
        },
        onError: () => toast({ title: "Erro ao salvar perfil", variant: "destructive" }),
      }
    );
  };

  if (isLoading) return <p className="text-muted-foreground">Carregando...</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Meu Perfil</h2>
        <p className="text-muted-foreground">Suas informações e skills cadastradas.</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user?.imageUrl ?? me?.avatarUrl ?? undefined} />
                <AvatarFallback className="text-xl">{me?.name?.[0] ?? "?"}</AvatarFallback>
              </Avatar>
              {!editing ? (
                <div>
                  <CardTitle className="text-xl">{me?.name}</CardTitle>
                  {me?.area && <p className="text-sm text-muted-foreground mt-0.5">{me.area}</p>}
                  {me?.email && <p className="text-xs text-muted-foreground mt-0.5">{me.email}</p>}
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">Nome</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} className="h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs">Área / Cargo</Label>
                    <Input value={area} onChange={e => setArea(e.target.value)} placeholder="ex: Frontend Engineer" className="h-8 text-sm" />
                  </div>
                </div>
              )}
            </div>
            {!editing ? (
              <Button variant="outline" size="sm" onClick={startEdit}>
                <Edit2 className="w-3.5 h-3.5 mr-1.5" />Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} disabled={updateMe.isPending}>
                  <Save className="w-3.5 h-3.5 mr-1.5" />{updateMe.isPending ? "Salvando..." : "Salvar"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {!editing ? (
            me?.bio ? (
              <p className="text-sm text-muted-foreground">{me.bio}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Nenhuma bio cadastrada.</p>
            )
          ) : (
            <div>
              <Label className="text-xs">Bio</Label>
              <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Conte um pouco sobre você..." rows={3} className="text-sm" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            Minhas Skills ({mySkills?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mySkills?.length === 0 ? (
            <p className="text-sm text-muted-foreground">Você ainda não adicionou skills. Vá ao Banco de Skills para começar!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {mySkills?.map(us => (
                <div key={us.id} className="flex items-center gap-1.5 border rounded-full px-3 py-1">
                  <span className="text-sm font-medium">{us.skill?.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${LEVEL_COLORS[us.level] ?? ""}`}>
                    {LEVEL_LABELS[us.level] ?? us.level}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
