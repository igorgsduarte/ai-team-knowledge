type UserAvatarProps = {
  name: string;
  size?: "md" | "lg";
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function UserAvatar({ name, size = "md" }: UserAvatarProps) {
  return (
    <span aria-hidden="true" className={`user-avatar user-avatar--${size}`}>
      {initials(name)}
    </span>
  );
}
