import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
  const [stats, setStats] = useState<{
    articles: { total: number; published: number; draft: number; aiGenerated: number };
    aiTasks: { total: number; completed: number; failed: number; processing: number };
    wechat: { total: number; synced: number; pending: number; failed: number };
    recentArticles: Array<{
      id: string;
      title: string;
      status: string;
      source: string;
      createdAt: string;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard");
      if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-destructive">Error Loading Dashboard</h1>
        <p className="mt-4 text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-muted-foreground">
          No Data Available
        </h1>
        <p className="mt-4 text-muted-foreground">
          Please create some articles or AI tasks to see statistics here.
        </p>
        <div className="mt-8 flex space-x-4">
          <Link href="/admin/articles" className="btn-primary">
            Manage Articles
          </Link>
          <Link href="/admin/ai" className="btn-secondary">
            AI Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Articles</CardTitle>
                  <CardDescription>
                    Overview of your content library
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>Total Articles</div>
                      <div className="text-right font-mono">{stats.articles.total}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>Published</div>
                      <div className="text-right font-mono text-green-600">{stats.articles.published}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>Drafts</div>
                      <div className="text-right font-mono text-yellow-600">{stats.articles.draft}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>AI Generated</div>
                      <div className="text-right font-mono text-blue-600">{stats.articles.aiGenerated}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/admin/articles" className="link link-primary">
                    View All Articles →
                  </Link>
                </CardFooter>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>AI Tasks</CardTitle>
                  <CardDescription>
                    Status of AI content generation jobs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>Total Tasks</div>
                      <div className="text-right font-mono">{stats.aiTasks.total}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>Completed</div>
                      <div className="text-right font-mono text-green-600">{stats.aiTasks.completed}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>Processing</div>
                      <div className="text-right font-mono text-blue-600">{stats.aiTasks.processing}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>Failed</div>
                      <div className="text-right font-mono text-red-600">{stats.aiTasks.failed}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/admin/ai" className="link link-primary">
                    View All Tasks →
                  </Link>
                </CardFooter>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>WeChat Integration</CardTitle>
                  <CardDescription>
                    Synchronization status with WeChat Official Accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>Total Records</div>
                      <div className="text-right font-mono">{stats.wechat.total}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>Synced</div>
                      <div className="text-right font-mono text-green-600">{stats.wechat.synced}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>Pending</div>
                      <div className="text-right font-mono text-yellow-600">{stats.wechat.pending}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>Failed</div>
                      <div className="text-right font-mono text-red-600">{stats.wechat.failed}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/admin/wechat" className="link link-primary">
                    Manage WeChat →
                  </Link>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Recent Articles</h2>
              {stats.recentArticles.length === 0 ? (
                <p className="text-muted-foreground">No articles yet</p>
              ) : (
                <div className="space-y-4">
                  {stats.recentArticles.map((article) => (
                    <div key={article.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{article.title}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`px-2 py-0.5 rounded text-xs ${article.status === "published" ? "bg-green-100 text-green-800" : article.status === "draft" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}>
                            {article.status}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs ${article.source === "ai" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                            {article.source}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}