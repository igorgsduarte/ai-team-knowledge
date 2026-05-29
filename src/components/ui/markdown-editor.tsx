"use client";

import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type MarkdownEditorProps = {
  onChange: (value: string) => void;
  value: string;
};

export function MarkdownEditor({ onChange, value }: MarkdownEditorProps) {
  return (
    <div className="markdown-editor" data-color-mode="light">
      <MDEditor height={280} onChange={(next) => onChange(next ?? "")} value={value} />
    </div>
  );
}
