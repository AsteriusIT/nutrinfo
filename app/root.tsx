import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import { ChatAssistant } from "./components/chat-assistant";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { themeScript } from "./components/theme-toggle";
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    // data-theme est posé par themeScript avant l'hydratation
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#10131c" media="(prefers-color-scheme: dark)" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <SiteHeader />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <ChatAssistant />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Erreur";
  let details = "Une erreur inattendue s'est produite.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Page introuvable" : "Erreur";
    details = error.status === 404 ? "Cette page n'existe pas (encore)." : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-24 md:px-6">
      <h1 className="display text-4xl md:text-6xl">{message}</h1>
      <p className="mt-4">{details}</p>
      {stack && (
        <pre className="mt-6 overflow-x-auto border-2 border-ink p-4 text-sm">
          <code>{stack}</code>
        </pre>
      )}
    </div>
  );
}
