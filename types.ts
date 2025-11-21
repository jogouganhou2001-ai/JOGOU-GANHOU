export enum ViewState {
  HOME = 'HOME',
  RULES = 'RULES',
  HISTORY = 'HISTORY',
  REWARDS = 'REWARDS',
  PROFILE = 'PROFILE'
}

export interface Winner {
  id: string;
  name: string;
  date: string;
  prize: number;
  avatar: string;
  testimonial?: string;
}

export interface DrawStats {
  currentPrize: number;
  participants: number;
  timeRemaining: string;
  ticketPrice: number;
  nextTier: number;
  totalTicketsSold: number; // Global counter for sequential numbers
}

export interface BreakdownItem {
  label: string;
  value: number;
  color: string;
  description: string;
}

export interface LuckyNumber {
  id: string;
  number: string; // "001", "002"
  purchaseDate: string;
  drawDate: string;
  status: 'PENDING' | 'LOST' | 'WON';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  referralCode: string;
  referralCount: number;
  loyaltyProgress: number;
  loyaltyTarget: number;
  freeTickets: number;
  notificationsEnabled: boolean;
  luckBoost?: string;
  tickets: LuckyNumber[];
}

export interface Report {
  id: string;
  month: string;
  year: number;
  totalCollected: number;
  totalPaid: number;
}
