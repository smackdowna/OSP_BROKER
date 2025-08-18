export interface TBadge {
  name: string;
  description: string;
  price: number
}

export interface TUserBadge {
  userId: string;
  badgeId: string;
  totalCost: number; // Total cost of the badge
}
