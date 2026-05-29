import { RelativeTime } from "@/components/ui/relative-time";
import { UserAvatar } from "@/components/ui/user-avatar";

type EntityCardAuthorProps = {
  authorName: string;
  createdAt: string;
};

export function EntityCardAuthor({ authorName, createdAt }: EntityCardAuthorProps) {
  return (
    <div className="board-card-author">
      <UserAvatar name={authorName} />
      <div>
        <p className="font-semibold">{authorName}</p>
        <RelativeTime date={createdAt} />
      </div>
    </div>
  );
}
