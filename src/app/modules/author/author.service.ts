import prisma from "../../../shared/prisma";

const getAuthorDashboardOverview = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found");
  }
  if (user.role !== "AUTHOR") {
    throw new Error("User is not an author");
  }

  const author = await prisma.author.findFirst({
    where: { email: user.email },
  });

  if (!author) {
    throw new Error("Author profile not found with this email");
  }

  const totalPosts = await prisma.post.count({
    where: { authorAuthorId: author.id },
  });

  const totalViewsResult = await prisma.post.aggregate({
    where: { authorAuthorId: author.id },
    _sum: { viewsCount: true },
  });

  const totalViews = totalViewsResult._sum.viewsCount ?? 0;

  const totalReactions = await prisma.reaction.count({
    where: { post: { authorAuthorId: author.id } },
  });

  const totalComments = await prisma.comment.count({
    where: { post: { authorAuthorId: author.id } },
  });

  // ✅ Total reading time calculation
  const readingTimeSum = await prisma.post.aggregate({
    where: { authorAuthorId: author.id },
    _sum: {
      readingTime: true,
    },
  });

  const totalReadingTimeInSeconds = readingTimeSum._sum.readingTime ?? 0;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formattedTime = formatTime(totalReadingTimeInSeconds);

  // ✅ Recent Posts
  const recentPostsRaw = await prisma.post.findMany({
    where: { authorAuthorId: author.id },
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

  // ✅ Last comment with user info
  const lastCommentRaw = await prisma.comment.findFirst({
    where: { post: { authorAuthorId: author.id } },
    orderBy: { createdAt: "desc" },
    select: {
      content: true,
      user: {
        select: {
          name: true,
          profilePhoto: true,
        },
      },
    },
  });

  const lastComment = lastCommentRaw
    ? {
        content: lastCommentRaw.content,
        userName: lastCommentRaw.user?.name ?? "Unknown User",
        userImage: lastCommentRaw.user?.profilePhoto ?? null,
      }
    : {
        content: "No comments yet",
        userName: "",
        userImage: null,
      };

  // ✅ Last reaction with user info
  const lastReactionRaw = await prisma.reaction.findFirst({
    where: { post: { authorAuthorId: author.id } },
    orderBy: { createdAt: "desc" },
    select: {
      type: true,
      post: {
        select: {
          title: true,
        },
      },
      user: {
        select: {
          name: true,
          profilePhoto: true,
        },
      },
    },
  });

  const lastReaction = lastReactionRaw
    ? {
        reactionType: lastReactionRaw.type,
        postTitle: lastReactionRaw.post.title,
        userName: lastReactionRaw.user?.name ?? "Unknown User",
        userImage: lastReactionRaw.user?.profilePhoto ?? null,
      }
    : {
        reactionType: "",
        postTitle: "",
        userName: "",
        userImage: null,
      };

  const currentYear = new Date().getFullYear();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const postsForYear = await prisma.post.findMany({
    where: {
      authorAuthorId: author.id,
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

  const summary = [
    { label: "Total Posts", value: totalPosts, icon: "FileText" },
    { label: "Total Views", value: totalViews, icon: "Eye" },
    { label: "Total Reactions", value: totalReactions, icon: "ThumbsUp" },
    { label: "Total Comments", value: totalComments, icon: "MessageCircle" },
    { label: "Total Read Time", value: formattedTime, icon: "Clock" },
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
