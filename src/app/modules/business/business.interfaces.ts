export type TBusiness = {
  authorizedUser?: boolean;
  businessName: string;
  slogan: string;
  mission: string;
  industry: string;
  isIsp?: boolean;
  products: string[];
  services: string[];
  companyType: string;
  foundedYear: string;
  history: string;
  hqLocation?: Record<string, any>; // Or a specific type if you have one
  servingAreas: string[];
  keyPeople: string[];
  ownership: string[];
  lastYearRevenue: string;
  employeeCount?: number;
  acquisitions: string[];
  strategicPartners: string[];
  saleDeckUrl?: string;
  websiteLinks: string[];
  accountOwnerUsername: string;
  representatives?: TRepresentative[];
  businessAdminId: string;
  businessCategoryId?: string;
};

export type TRepresentative = {
  department: string;
  message: string;
  businessId: string;
  userId: string;
};

