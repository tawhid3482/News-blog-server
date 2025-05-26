export type TimeRange = "today" | "week" | "month";

export interface PostStat {
  id: string;
  title: string;
  viewsCount: number;
  reactionsCount: number;
  commentsCount: number;
  publishedAt?: Date | null;
}

export interface DailyTrend {
  date: string; // e.g., "2025-05-26"
  count: number;
}

export interface AuthorActivity {
  authorId: string;
  name: string;
  profilePhoto: string;
  totalPosts: number;
  totalViews: number;
}

export interface AdminDashboardStats {
  // 👥 User Summary
  totalUsers: number;
  totalAdmins: number;
  totalAuthors: number;
  totalEditors: number;

  // 📊 General Stats
  totalViews: number;
  todaysViews: number;
  totalReactions: number;
  totalComments: number;

  // 📈 Trending Stats
  mostViewedPosts: {
    today: PostStat[];
    week: PostStat[];
    month: PostStat[];
  };

  mostReactedPosts: PostStat[];
  mostCommentedPosts: PostStat[];

  // 🖋️ Content Overview
  totalPublished: number;
  totalDrafts: number;
  totalRejected: number;

  // ⏱️ Time-based Trends
  dailyVisitors: DailyTrend[]; // last 7 days
  dailyReactions: DailyTrend[]; // last 7 days
  dailyComments: DailyTrend[]; // last 7 days

  // 👤 User Behavior
  mostActiveAuthors: AuthorActivity[];
  newUsersThisMonth: number;
  userSignupTrend: DailyTrend[];

  // ⚙️ System Health
  apiRequestCountToday: number;
  averageLoadTimeMs: number;
}
