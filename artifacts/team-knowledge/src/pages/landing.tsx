import { useState } from "react";
import { Link } from "wouter";
import { Copy, Check, Users, BookOpen, Layers } from "lucide-react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
      title="Copiar"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">

        {/* Hero */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            The Workspace for<br />Multi-Disciplinary Teams
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Engineers, designers, data scientists e PMs num único lugar para documentar o que sabem e o que estão aprendendo.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/sign-in"
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              Entrar
            </Link>
            <Link href="/sign-up" className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors">
              Criar conta <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="mt-16 rounded-2xl border border-border bg-card p-8">
          <div className="flex items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              Acesso Demo
            </span>
            <p className="text-sm text-muted-foreground">
              Use estas credenciais para explorar o sistema sem precisar criar uma conta.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Conta demo", email: "demo@teamknowledge.dev", role: "Demo User" },
              { label: "Alice (Frontend)", email: "alice@teamknowledge.dev", role: "Frontend Engineer" },
              { label: "Bob (Data)", email: "bob@teamknowledge.dev", role: "Data Scientist" },
            ].map((u) => (
              <div key={u.email} className="rounded-xl border border-border bg-background p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{u.label}</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{u.role}</p>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between rounded-md bg-muted px-3 py-1.5">
                    <span className="text-xs font-mono text-foreground truncate">{u.email}</span>
                    <CopyButton text={u.email} />
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-muted px-3 py-1.5">
                    <span className="text-xs font-mono text-foreground">TeamKnowledge@2024</span>
                    <CopyButton text="TeamKnowledge@2024" />
                  </div>
                </div>
                <Link
                  href="/sign-in"
                  className="block w-full text-center rounded-md border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                >
                  Entrar com esta conta
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: Layers, title: "Board pessoal", desc: "Registre o que está aprendendo, fazendo ou concluiu — com status e tags." },
            { icon: BookOpen, title: "Banco de Conhecimento", desc: "Artigos escritos pelo time e links curados com comentários." },
            { icon: Users, title: "Mapa de Skills", desc: "Visualize quem sabe o quê e em qual nível em todo o time." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
