export type TLoginAuth = {
    email: string;
    password: string;
  };

  export type TUser = {
    id: string;
    fullName: string;
    email: string;
    password: string;
    role: "USER" | "REPRESENTATIVE" | "BUSINESS_ADMIN" | "MODERATOR" | "ADMIN";
    phone: string;
    userProfile?: {
      bio?: string;
      avatarUrl?: string;
      location?: string;
    };
    representative?: {
      businessId: string;
      role: string;
      department: string;
      message?: string;
    };
    businessAdmin?: {
      businessId: string;
      permissions: string[]; 
    };
    moderator?: {
      permissions: string[];
    };
    admin?: {
      superAdmin: boolean;
    };
  };
  