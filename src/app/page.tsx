import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 bg-background">
      <section className="w-full max-w-4xl space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            AI Content Platform
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            AI-powered content creation and management platform
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link href="/admin" className="btn-primary">
              Admin Dashboard
            </Link>
            <Link href="/articles" className="btn-secondary">
              Browse Articles
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Content Creation</CardTitle>
              <CardDescription>
                Create and manage articles with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Write, edit, and publish content using our intuitive editor
                </p>
                <p className="text-sm text-muted-foreground">
                  Leverage AI to generate high-quality articles from prompts
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/articles/create" className="link link-primary">
                Get Started →
              </Link>
            </CardFooter>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle>AI Generation</CardTitle>
              <CardDescription>
                Generate content using advanced AI models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Powered by GPT-4o for intelligent content creation
                </p>
                <p className="text-sm text-muted-foreground">
                  Customizable prompts and parameters for tailored results
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/admin/ai" className="link link-primary">
                Explore AI →
              </Link>
            </CardFooter>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle>WeChat Integration</CardTitle>
              <CardDescription>
                Sync content to WeChat Official Accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  One-click synchronization to WeChat
                </p>
                <p className="text-sm text-muted-foreground">
                  Track sync status and manage published content
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/admin/wechat" className="link link-primary">
                Learn More →
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      <aside className="w-full max-w-4xl mt-12 text-center text-sm text-muted-foreground">
        <p>
          Built with Next.js 16, Tailwind CSS v4, Drizzle ORM, and shadcn/ui
        </p>
      </aside>
    </main>
  );
}