"use client";

import dynamic from "next/dynamic";
import "@uiw/react-markdown-preview/markdown.css";

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), { ssr: false });

type MarkdownViewerProps = {
  value: string;
};

export function MarkdownViewer({ value }: MarkdownViewerProps) {
  return (
    <div className="markdown-viewer" data-color-mode="light">
      <MarkdownPreview source={value || ""} />
    </div>
  );
}
