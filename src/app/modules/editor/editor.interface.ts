type DailyCount = { date: string; count: number };
type EditorDashboardOverview = {
  postStats: {
    total: number;
    published: number;
    draft: number;
    blocked: number;
  };
  opinionStats: {
    total: number;
    published: number;
    unpublished: number;
  };
  reviewStats: {
    total: number;
    approved: number;
    notApproved: number;
    recent: {
      id: string;
      content: string;
      rating: number;
      isApproved: boolean;
      createdAt: string; // or Date
      isAnonymous: boolean;
    }[];
  };
 dailyStats: {
  posts: DailyCount[];
  opinions: DailyCount[];
  reviews: DailyCount[];
};
};
