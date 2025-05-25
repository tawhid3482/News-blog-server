import prisma from "../../../shared/prisma";

const getAuthorDashboardOverview = async (authorId: string) => {
  // Check if author exists
  const authorExists = await prisma.user.findUnique({
    where: { id: authorId },
  });
  console.log(authorExists);
  if (!authorExists) {
    throw new Error("Author not found");
  }

  // Summary counts
  const totalPosts = await prisma.post.count({
    where: { authorAuthorId: authorId },
  });

  const totalViewsResult = await prisma.post.aggregate({
    where: { authorAuthorId: authorId },
    _sum: { viewsCount: true },
  });
  const totalViews = totalViewsResult._sum.viewsCount ?? 0;

  const totalReactions = await prisma.reaction.count({
    where: { post: { authorAuthorId: authorId } },
  });

  const totalComments = await prisma.comment.count({
    where: { post: { authorAuthorId: authorId } },
  });

  // Recent posts
  const recentPostsRaw = await prisma.post.findMany({
    where: { authorAuthorId: authorId },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      title: true,
      status: true,
      publishedAt: true,
    },
  });
  const recentPosts = recentPostsRaw.map((post) => ({
    title: post.title,
    date: post.publishedAt
      ? post.publishedAt.toISOString().split("T")[0]
      : "N/A",
    status: post.status,
  }));

  // Last comment
  const lastCommentRaw = await prisma.comment.findFirst({
    where: { post: { authorAuthorId: authorId } },
    orderBy: { createdAt: "desc" },
  });
  const lastComment = lastCommentRaw
    ? { content: lastCommentRaw.content, userName: lastCommentRaw.userId }
    : { content: "No comments yet", userName: "" };

  // Last reaction
  const lastReactionRaw = await prisma.reaction.findFirst({
    where: { post: { authorAuthorId: authorId } },
    orderBy: { createdAt: "desc" },
    select: {
      type: true,
      post: { select: { title: true } },
    },
  });
  const lastReaction = lastReactionRaw
    ? {
        reactionType: lastReactionRaw.type,
        postTitle: lastReactionRaw.post.title,
      }
    : { reactionType: "", postTitle: "" };

  // Monthly analytics
  const currentYear = new Date().getFullYear();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const postsForYear = await prisma.post.findMany({
    where: {
      authorAuthorId: authorId,
      publishedAt: {
        gte: new Date(currentYear, 0, 1),
        lte: new Date(currentYear, 11, 31),
      },
    },
    select: {
      viewsCount: true,
      publishedAt: true,
    },
  });

  const monthlyAnalytics = months.map((month, idx) => {
    const views = postsForYear
      .filter((p) => p.publishedAt?.getMonth() === idx)
      .reduce((sum, p) => sum + p.viewsCount, 0);
    return { month, views };
  });

  // Prepare summary
  const summary = [
    { label: "Total Posts", value: totalPosts, icon: "FileText" },
    { label: "Total Views", value: totalViews, icon: "Eye" },
    { label: "Total Reactions", value: totalReactions, icon: "ThumbsUp" },
    { label: "Total Comments", value: totalComments, icon: "MessageCircle" },
  ];

  return {
    summary,
    recentPosts,
    lastComment,
    lastReaction,
    monthlyAnalytics,
  };
};

export const AuthorDashboardService = {
  getAuthorDashboardOverview,
};
