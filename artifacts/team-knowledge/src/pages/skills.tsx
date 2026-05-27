import { useState } from "react";
import {
  useListSkills,
  useCreateSkill,
  useListMySkills,
  useAddMySkill,
  useRemoveMySkill,
  getListSkillsQueryKey,
  getListMySkillsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Tag, Users, CheckCircle2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

function CreateSkillDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const createSkill = useCreateSkill();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!name.trim()) return;
    createSkill.mutate(
      { data: { name, description, tags: tags.split(",").map(t => t.trim()).filter(Boolean) } },
      {
        onSuccess: () => {
          setOpen(false);
          setName(""); setDescription(""); setTags("");
          onCreated();
          toast({ title: "Skill criada com sucesso!" });
        },
        onError: () => toast({ title: "Erro ao criar skill", variant: "destructive" }),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="w-4 h-4 mr-2" />Nova Skill</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Adicionar Skill ao Banco</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="ex: TypeScript, Figma, Python..." />
          </div>
          <div>
            <Label>Descrição (opcional)</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Breve descrição da skill..." rows={3} />
          </div>
          <div>
            <Label>Tags (separadas por vírgula)</Label>
            <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="ex: frontend, linguagem, ferramenta" />
          </div>
          <Button onClick={handleSubmit} disabled={createSkill.isPending} className="w-full">
            {createSkill.isPending ? "Criando..." : "Criar Skill"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddToMySkillsDialog({ skill, onAdded }: { skill: any; onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState<string>("beginner");
  const addMySkill = useAddMySkill();
  const { toast } = useToast();

  const handleAdd = () => {
    addMySkill.mutate(
      { data: { skillId: skill.id, level: level as "beginner" | "intermediate" | "advanced" | "expert" } },
      {
        onSuccess: () => {
          setOpen(false);
          onAdded();
          toast({ title: `${skill.name} adicionada ao seu perfil!` });
        },
        onError: () => toast({ title: "Erro ao adicionar skill", variant: "destructive" }),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><Plus className="w-3 h-3 mr-1" />Adicionar</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Adicionar {skill.name} ao seu perfil</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Seu nível</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Iniciante</SelectItem>
                <SelectItem value="intermediate">Intermediário</SelectItem>
                <SelectItem value="advanced">Avançado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAdd} disabled={addMySkill.isPending} className="w-full">
            {addMySkill.isPending ? "Adicionando..." : "Confirmar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function SkillsPage() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: skills, isLoading, refetch } = useListSkills(search ? { search } : undefined, {
    query: { queryKey: getListSkillsQueryKey(search ? { search } : undefined) },
  });
  const { data: mySkills } = useListMySkills({ query: { queryKey: getListMySkillsQueryKey() } });
  const removeMySkill = useRemoveMySkill();
  const { toast } = useToast();

  const mySkillIds = new Set(mySkills?.map(s => s.skillId) ?? []);

  const handleRemove = (skillId: number) => {
    removeMySkill.mutate({ skillId }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMySkillsQueryKey() });
        toast({ title: "Skill removida do seu perfil" });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Banco de Skills</h2>
          <p className="text-muted-foreground">Explore e gerencie as habilidades do time.</p>
        </div>
        <CreateSkillDialog onCreated={() => { queryClient.invalidateQueries({ queryKey: getListSkillsQueryKey() }); refetch(); }} />
      </div>

      {mySkills && mySkills.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Minhas Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {mySkills.map(us => (
                <div key={us.id} className="flex items-center gap-1.5 border rounded-full px-3 py-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-sm font-medium">{us.skill?.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${LEVEL_COLORS[us.level] ?? ""}`}>{LEVEL_LABELS[us.level] ?? us.level}</span>
                  <button onClick={() => handleRemove(us.skillId)} className="text-muted-foreground hover:text-destructive text-xs ml-1">×</button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar skills..." className="pl-9" />
      </div>

      {isLoading && <p className="text-muted-foreground">Carregando...</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills?.map(skill => (
          <Card key={skill.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{skill.name}</CardTitle>
                {mySkillIds.has(skill.id) ? (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle2 className="w-3 h-3 mr-1" />Sua skill</Badge>
                ) : (
                  <AddToMySkillsDialog skill={skill} onAdded={() => queryClient.invalidateQueries({ queryKey: getListMySkillsQueryKey() })} />
                )}
              </div>
              {skill.description && <p className="text-sm text-muted-foreground">{skill.description}</p>}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {skill.tags?.map((t: string) => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      <Tag className="w-2.5 h-2.5 mr-1" />{t}
                    </Badge>
                  ))}
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground ml-2 whitespace-nowrap">
                  <Users className="w-3.5 h-3.5" />{skill.usersCount}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isLoading && skills?.length === 0 && (
        <Card className="py-12 text-center">
          <CardContent>
            <Tag className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nenhuma skill encontrada. Adicione a primeira!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
