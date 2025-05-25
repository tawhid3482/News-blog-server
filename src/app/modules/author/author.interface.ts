// interfaces/authorDashboard.ts

export interface SummaryItem {
  label: string;
  value: number | string;
  icon: string; // icon name or you can use ReactNode if using React icons
}

export interface RecentPost {
  title: string;
  date: string; // ISO string or formatted date
  status: "Published" | "Draft" | string;
}

export interface MonthlyAnalytics {
  month: string;
  views: number;
}

export interface AuthorDashboardOverview {
  summary: SummaryItem[];
  recentPosts: RecentPost[];
  lastComment: {
    content: string;
    userName: string;
  };
  lastReaction: {
    reactionType: string; // e.g. "Like", "Love"
    postTitle: string;
  };
  monthlyAnalytics: MonthlyAnalytics[];
}
