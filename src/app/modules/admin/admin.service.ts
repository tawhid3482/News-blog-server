import prisma from "../../../shared/prisma";

const getAdminDashboardOverview = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);

  // 1️⃣ Total users by role
  const totalUsers = await prisma.user.count();
  const totalAdmins = await prisma.user.count({ where: { role: "ADMIN" } });
  const totalAuthors = await prisma.user.count({ where: { role: "AUTHOR" } });
  const totalEditors = await prisma.user.count({ where: { role: "EDITOR" } });

  // 2️⃣ Total views (sum of viewsCount from posts)
  const totalViewsAgg = await prisma.post.aggregate({
    _sum: { viewsCount: true },
  });
  const totalViews = totalViewsAgg._sum.viewsCount ?? 0;

  // 3️⃣ Today's Views: Count of PostView where viewedAt >= today
  const todaysViewsAgg = await prisma.postView.aggregate({
    where: { viewedAt: { gte: today } },
    _count: { id: true },
  });
  const todaysViews = todaysViewsAgg._count.id ?? 0;

  // 4️⃣ Total Reactions and Comments count
  const totalReactions = await prisma.reaction.count();
  const totalComments = await prisma.comment.count();

  // 5️⃣ Content status overview
  const totalPublished = await prisma.post.count({ where: { status: "PUBLISHED" } });
  const totalPending = await prisma.post.count({ where: { status: "DRAFT" } });
  const totalRejected = await prisma.post.count({ where: { status: "BLOCKED" } });

  // 6️⃣ Top 5 Most Viewed News (all-time)
  const topViewedNews = await prisma.post.findMany({
    orderBy: { viewsCount: "desc" },
    take: 5,
    select: { id: true, title: true, viewsCount: true, slug: true },
  });

  // 7️⃣ Top 5 Most Reacted News
  const topReactedNewsRaw = await prisma.reaction.groupBy({
    by: ["postId"],
    _count: { postId: true },
    orderBy: { _count: { postId: "desc" } },
    take: 5,
  });

  const topReactedNews = await Promise.all(
    topReactedNewsRaw.map(async (r) => {
      const post = await prisma.post.findUnique({
        where: { id: r.postId },
        select: { title: true, viewsCount: true, slug: true },
      });
      return {
        postId: r.postId,
        reactionsCount: r._count.postId,
        postTitle: post?.title,
        viewsCount: post?.viewsCount,
        slug: post?.slug,
      };
    })
  );

  // 8️⃣ Top 5 Most Commented News
  const topCommentedNewsRaw = await prisma.comment.groupBy({
    by: ["postId"],
    _count: { postId: true },
    orderBy: { _count: { postId: "desc" } },
    take: 5,
  });

  const topCommentedNews = await Promise.all(
    topCommentedNewsRaw.map(async (c) => {
      const post = await prisma.post.findUnique({
        where: { id: c.postId },
        select: { title: true, viewsCount: true, slug: true },
      });
      return {
        postId: c.postId,
        commentsCount: c._count.postId,
        postTitle: post?.title,
        viewsCount: post?.viewsCount,
        slug: post?.slug,
      };
    })
  );

  // 9️⃣ Daily Visitors (last 7 days) - FIXED with anonymous support
  const rawVisitors = await prisma.postView.findMany({
    where: { viewedAt: { gte: oneWeekAgo } },
    select: { userId: true, viewedAt: true },
  });

  const dailyVisitorsMap: Record<string, Set<string>> = {};
  rawVisitors.forEach(({ userId, viewedAt }) => {
    const dayKey = new Date(viewedAt).toISOString().slice(0, 10);
    if (!dailyVisitorsMap[dayKey]) dailyVisitorsMap[dayKey] = new Set();

    // Use userId or fallback to a unique anonymous id per view (approximation)
    const visitorId = userId ?? `anonymous-${Math.random().toString(36).slice(2)}`;
    dailyVisitorsMap[dayKey].add(visitorId);
  });

  const dailyVisitors = Object.entries(dailyVisitorsMap)
    .map(([date, users]) => ({
      date,
      uniqueVisitors: users.size,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // 10️⃣ Daily Reactions trend (last 7 days)
  const rawReactions = await prisma.reaction.findMany({
    where: { createdAt: { gte: oneWeekAgo } },
    select: { createdAt: true },
  });
  const dailyReactionsMap: Record<string, number> = {};
  rawReactions.forEach(({ createdAt }) => {
    const dayKey = new Date(createdAt).toISOString().slice(0, 10);
    dailyReactionsMap[dayKey] = (dailyReactionsMap[dayKey] ?? 0) + 1;
  });
  const dailyReactions = Object.entries(dailyReactionsMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // 11️⃣ Daily Comments trend (last 7 days)
  const rawComments = await prisma.comment.findMany({
    where: { createdAt: { gte: oneWeekAgo } },
    select: { createdAt: true },
  });
  const dailyCommentsMap: Record<string, number> = {};
  rawComments.forEach(({ createdAt }) => {
    const dayKey = new Date(createdAt).toISOString().slice(0, 10);
    dailyCommentsMap[dayKey] = (dailyCommentsMap[dayKey] ?? 0) + 1;
  });
  const dailyComments = Object.entries(dailyCommentsMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // 12️⃣ Most Active Authors (by post count)
  const activeAuthorsRaw = await prisma.post.groupBy({
    by: ["authorAuthorId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 5,
  });

  const activeAuthors = await Promise.all(
    activeAuthorsRaw.map(async (item) => {
      const author = await prisma.author.findUnique({
        where: { id: item.authorAuthorId ?? "" },
        select: { name: true, profilePhoto: true },
      });
      return {
        authorId: item.authorAuthorId,
        postCount: item._count.id,
        authorName: author?.name,
        profilePhoto: author?.profilePhoto,
      };
    })
  );

  // 13️⃣ New users this month
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const newUsersThisMonth = await prisma.user.count({
    where: { createdAt: { gte: firstDayOfMonth } },
  });

  // 14️⃣ User signup trend (last 7 days)
  const rawUserSignups = await prisma.user.findMany({
    where: { createdAt: { gte: oneWeekAgo } },
    select: { createdAt: true },
  });

  const userSignupMap: Record<string, number> = {};
  rawUserSignups.forEach(({ createdAt }) => {
    const dayKey = new Date(createdAt).toISOString().slice(0, 10);
    userSignupMap[dayKey] = (userSignupMap[dayKey] ?? 0) + 1;
  });
  const userSignupTrend = Object.entries(userSignupMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    userStats: {
      totalUsers,
      totalAdmins,
      totalAuthors,
      totalEditors,
      newUsersThisMonth,
      userSignupTrend,
      activeAuthors,
    },
    contentStats: {
      totalPublished,
      totalPending,
      totalRejected,
      totalViews,
      todaysViews,
      totalReactions,
      totalComments,
      topViewedNews,
      topReactedNews,
      topCommentedNews,
    },
    trends: {
      dailyVisitors,
      dailyReactions,
      dailyComments,
    },
  };
};

export const AdminDashboardService = {
  getAdminDashboardOverview,
};
