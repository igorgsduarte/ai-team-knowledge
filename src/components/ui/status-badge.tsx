import type { KnowledgeType, UserSkillLevel, WorkspaceMemberStatus } from "@/lib/types/domain";

type StatusBadgeProps =
  | { kind: "knowledge"; label: string; value: KnowledgeType }
  | { kind: "member"; label: string; value: WorkspaceMemberStatus }
  | { kind: "skill"; label: string; value: UserSkillLevel };

function badgeClass(props: StatusBadgeProps): string {
  if (props.kind === "knowledge") {
    return `status-badge status-badge--${props.value}`;
  }
  if (props.kind === "member") {
    return `status-badge status-badge--member-${props.value}`;
  }
  return `status-badge status-badge--skill-${props.value}`;
}

export function StatusBadge(props: StatusBadgeProps) {
  return <span className={badgeClass(props)}>{props.label}</span>;
}
