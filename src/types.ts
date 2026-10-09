export interface QuickInfoRow {
  key: string;
  val: string;
}

export interface ImportantLinkRow {
  label: string;
  url: string;
  status: 'active' | 'expired' | 'soon';
}

export type PostCategory = 'Jobs' | 'Notices' | 'Scholarships' | 'Sarkari Yojna';

export type PostStatus = 'published' | 'draft';

export interface Post {
  id: string;
  title: string;
  category: PostCategory;
  tags?: string[];
  summary: string;
  body: string;
  quickInfo?: QuickInfoRow[];
  importantLinks?: ImportantLinkRow[];
  views: number;
  createdAt: string; // ISO string
  updatedAt?: string;
  isPinned?: boolean;
  isDraft?: boolean;
  status?: PostStatus;
  lastDate?: string; // YYYY-MM-DD for countdown
  qualification?: string; // e.g. 10+2, Graduate
  salaryInfo?: string;
  totalVacancies?: string;
}

export type MarketCategory = 'books' | 'gadgets' | 'rooms' | 'services';

export interface MarketplaceItem {
  id: string;
  title: string;
  category: MarketCategory;
  price: number;
  location: string;
  whatsapp: string;
  desc: string;
  status: 'pending' | 'approved' | 'rejected' | 'sold';
  createdAt: string;
  sellerName?: string;
  condition?: string;
}

export interface NoticeSettings {
  marqueeText: string;
  marqueeEnabled?: boolean;
  emergencyAlert?: string;
  mainWaUrl: string;
  ch1: string;
  ch2: string;
  ch3: string;
  ch4: string;
  aboutText?: string;
  supportEmail?: string;
  supportPhone?: string;
  monetagEnabled?: boolean;
  monetagZoneCode?: string;
  monetagInPagePush?: boolean;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  user: string;
  details?: string;
}
