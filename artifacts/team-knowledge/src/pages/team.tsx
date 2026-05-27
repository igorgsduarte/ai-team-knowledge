import { useGetSkillMap, useListUsers } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MapPin } from "lucide-react";

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

export default function TeamPage() {
  const { data: skillMap, isLoading } = useGetSkillMap();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mapa de Skills do Time</h2>
        <p className="text-muted-foreground">Veja quem sabe o quê no seu time.</p>
      </div>

      {isLoading && <p className="text-muted-foreground">Carregando...</p>}

      {!isLoading && skillMap?.length === 0 && (
        <Card className="py-12 text-center">
          <CardContent>
            <Users className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nenhum membro ainda. Convide seu time!</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skillMap?.map(member => (
          <Card key={member.userId} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={member.avatarUrl ?? undefined} />
                  <AvatarFallback>{member.userName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.userName}</p>
                  {member.area && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{member.area}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {member.skills.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nenhuma skill cadastrada.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map(s => (
                    <div key={s.skillId} className="flex items-center gap-1">
                      <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded-l-full">{s.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-r-full ${LEVEL_COLORS[s.level] ?? "bg-muted text-muted-foreground"}`}>
                        {LEVEL_LABELS[s.level] ?? s.level}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
