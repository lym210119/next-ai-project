import { db } from "@/lib/db";
import { articles, aiTasks, wechatArticles } from "@/drizzle/schema";
import { and, count, eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    // Article stats
    const [articleStats] = await db
      .select({
        total: count(articles.id),
        published: count(articles.id).filter(eq(articles.status, "published")),
        draft: count(articles.id).filter(eq(articles.status, "draft")),
        aiGenerated: count(articles.id).filter(eq(articles.source, "ai")),
      })
      .from(articles);

    // AI task stats
    const [aiTaskStats] = await db
      .select({
        total: count(aiTasks.id),
        completed: count(aiTasks.id).filter(eq(aiTasks.status, "completed")),
        failed: count(aiTasks.id).filter(eq(aiTasks.status, "failed")),
        processing: count(aiTasks.id).filter(eq(aiTasks.status, "processing")),
      })
      .from(aiTasks);

    // WeChat stats
    const [wechatStats] = await db
      .select({
        total: count(wechatArticles.id),
        synced: count(wechatArticles.id).filter(eq(wechatArticles.syncStatus, "synced")),
        pending: count(wechatArticles.id).filter(eq(wechatArticles.syncStatus, "pending")),
        failed: count(wechatArticles.id).filter(eq(wechatArticles.syncStatus, "failed")),
      })
      .from(wechatArticles);

    // Recent articles
    const recentArticles = await db
      .select({
        id: articles.id,
        title: articles.title,
        status: articles.status,
        source: articles.source,
        createdAt: articles.createdAt,
      })
      .from(articles)
      .orderBy(articles.createdAt.desc())
      .limit(5);

    return new Response(
      JSON.stringify({
        articles: {
          total: articleStats.total,
          published: articleStats.published,
          draft: articleStats.draft,
          aiGenerated: articleStats.aiGenerated,
        },
        aiTasks: {
          total: aiTaskStats.total,
          completed: aiTaskStats.completed,
          failed: aiTaskStats.failed,
          processing: aiTaskStats.processing,
        },
        wechat: {
          total: wechatStats.total,
          synced: wechatStats.synced,
          pending: wechatStats.pending,
          failed: wechatStats.failed,
        },
        recentArticles: recentArticles.map((article) => ({
          id: article.id,
          title: article.title,
          status: article.status,
          source: article.source,
          createdAt: article.createdAt.toISOString(),
        })),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Dashboard API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}