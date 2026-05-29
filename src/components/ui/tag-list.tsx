type TagListProps = {
  tags: string[];
};

export function TagList({ tags }: TagListProps) {
  if (!tags.length) {
    return null;
  }

  return (
    <div className="tag-list">
      {tags.map((tag) => (
        <span className="tag-pill" key={tag}>
          {tag}
        </span>
      ))}
    </div>
  );
}
