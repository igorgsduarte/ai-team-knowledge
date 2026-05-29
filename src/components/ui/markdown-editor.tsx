"use client";

import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type MarkdownEditorProps = {
  height?: number;
  onChange: (value: string) => void;
  value: string;
};

export function MarkdownEditor({ height = 360, onChange, value }: MarkdownEditorProps) {
  return (
    <div className="markdown-editor" data-color-mode="light">
      <MDEditor
        height={height}
        onChange={(next) => onChange(next ?? "")}
        preview="edit"
        value={value}
        visibleDragbar={false}
      />
    </div>
  );
}
