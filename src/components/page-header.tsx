import { ReactNode } from "react";

type PageHeaderProps = {
  actions?: ReactNode;
  subtitle?: string;
  title: string;
};

export function PageHeader({ actions, subtitle, title }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p className="page-header-subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </header>
  );
}
