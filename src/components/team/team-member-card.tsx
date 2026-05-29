import { Briefcase } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { UserSkillLevel } from "@/lib/types/domain";
import type { UserProfile } from "@/lib/repositories/users-repository";

type TeamMemberCardProps = {
  levelLabels: Record<UserSkillLevel, string>;
  member: UserProfile;
  skills: Array<{ level: UserSkillLevel; name: string }>;
};

export function TeamMemberCard({ levelLabels, member, skills }: TeamMemberCardProps) {
  const name = member.name || member.email || "Member";

  return (
    <article className="app-card team-member-card">
      <div className="team-member-header">
        <UserAvatar name={name} size="lg" />
        <div>
          <h2 className="font-semibold">{name}</h2>
          <p className="team-member-area">
            <Briefcase aria-hidden size={14} />
            {member.area || "—"}
          </p>
        </div>
      </div>
      <ul className="team-member-skills">
        {skills.map((skill) => (
          <li key={`${member.id}-${skill.name}`}>
            <span>{skill.name}</span>
            <StatusBadge kind="skill" label={levelLabels[skill.level]} value={skill.level} />
          </li>
        ))}
        {skills.length === 0 ? <li className="muted text-sm">—</li> : null}
      </ul>
    </article>
  );
}
