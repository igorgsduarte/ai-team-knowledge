import type { BoardStatus, KnowledgeType, UserSkillLevel } from "@/lib/types/domain";

type StatusBadgeProps =
  | { kind: "board"; label: string; value: BoardStatus }
  | { kind: "knowledge"; label: string; value: KnowledgeType }
  | { kind: "skill"; label: string; value: UserSkillLevel };

function badgeClass(props: StatusBadgeProps): string {
  if (props.kind === "board") {
    return `status-badge status-badge--${props.value}`;
  }
  if (props.kind === "knowledge") {
    return `status-badge status-badge--${props.value}`;
  }
  return `status-badge status-badge--skill-${props.value}`;
}

export function StatusBadge(props: StatusBadgeProps) {
  return <span className={badgeClass(props)}>{props.label}</span>;
}
