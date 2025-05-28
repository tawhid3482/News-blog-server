import prisma from "../../../shared/prisma";
import { format } from "date-fns";

// 👇 Helper function: group items by created date
function groupByDate(data: { createdAt: Date }[]): { date: string; count: number }[] {
  const map: Record<string, number> = {};
  data.forEach((item) => {
    const date = format(item.createdAt, "yyyy-MM-dd");
    map[date] = (map[date] || 0) + 1;
  });
  return Object.entries(map).map(([date, count]) => ({ date, count }));
}

export const getEditorDashboardOverview = async (userId: string): Promise<EditorDashboardOverview> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      Editor: true,
    },
  });

  if (!user || user.role !== "EDITOR") {
    throw new Error("User is not an editor or not found");
  }

  // -------- Post Stats --------
  const totalPosts = await prisma.post.count();
  const publishedPosts = await prisma.post.count({ where: { status: "PUBLISHED" } });
  const draftPosts = await prisma.post.count({ where: { status: "DRAFT" } });
  const blockedPosts = await prisma.post.count({ where: { status: "BLOCKED" } });

  // -------- Opinion Stats --------
  const totalOpinions = await prisma.opinion.count();
  const publishedOpinions = await prisma.opinion.count({ where: { isPublished: true } });
  const unpublishedOpinions = await prisma.opinion.count({ where: { isPublished: false } });

  // -------- Review Stats --------
  const totalReviews = await prisma.websiteReview.count();
  const approvedReviews = await prisma.websiteReview.count({ where: { isApproved: true } });
  const notApprovedReviews = await prisma.websiteReview.count({ where: { isApproved: false } });

  // -------- Recent 3 Reviews --------
  const recentReviews = await prisma.websiteReview.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  // -------- Daily Stats (Raw SQL ছাড়া) --------
  const [allPosts, allOpinions, allReviews] = await Promise.all([
    prisma.post.findMany({ select: { createdAt: true } }),
    prisma.opinion.findMany({ select: { createdAt: true } }),
    prisma.websiteReview.findMany({ select: { createdAt: true } }),
  ]);

  const dailyPosts = groupByDate(allPosts);
  const dailyOpinions = groupByDate(allOpinions);
  const dailyReviews = groupByDate(allReviews);

  return {
    postStats: {
      total: totalPosts,
      published: publishedPosts,
      draft: draftPosts,
      blocked: blockedPosts,
    },
    opinionStats: {
      total: totalOpinions,
      published: publishedOpinions,
      unpublished: unpublishedOpinions,
    },
    reviewStats: {
      total: totalReviews,
      approved: approvedReviews,
      notApproved: notApprovedReviews,
      recent: recentReviews.map((r) => ({
        id: r.id,
        content: r.content,
        rating: r.rating,
        isApproved: r.isApproved,
        createdAt: r.createdAt.toISOString(),
        isAnonymous: r.isAnonymous,
      })),
    },
    dailyStats: {
      posts: dailyPosts,
      opinions: dailyOpinions,
      reviews: dailyReviews,
    },
  };
};

export const EditorDashboardService = {
  getEditorDashboardOverview,
};
