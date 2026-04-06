import "../admin.css";
import type { ReactNode } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background/90 backdrop-blur-sm border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <a href="/" className="text-xl font-bold">
              AI Content Platform
            </a>
            <span className="text-muted-foreground">Admin Dashboard</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="/admin/articles" className="text-muted-foreground hover:text-foreground">
              Articles
            </a>
            <a href="/admin/ai" className="text-muted-foreground hover:text-foreground">
              AI Tasks
            </a>
            <a href="/admin/wechat" className="text-muted-foreground hover:text-foreground">
              WeChat
            </a>
          </div>
        </nav>
      </header>
      <main className="flex-1 flex-col">
        <div className="overflow-y-auto">
          <div className="p-6">{children}</div>
        </div>
      </main>
    </div>
  );
}