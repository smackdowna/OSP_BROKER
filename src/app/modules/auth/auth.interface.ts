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
      headLine: string;
      location: string;
      about?: string;
      profileImageUrl?: string;
      skills: string[];
      socialLinks?: Record<string, any>;
      education: {
        school: string;
        degree: string;
        fieldOfStudy: string;
        startYear: number;
        endYear: number;
        grade: string;
      }[];
      experience: {
        company: string;
        title: string;
        location: string;
        startDate: string;
        endDate: string;
        description: string;
      }[];
    };
    representative?: {
      id: string;
      department: string;
      message: string;
      businessId: string;
    };
    businessAdmin?: {
      id: string;
    };
    moderator?: {
      id: string;
    };
    admin?: {
      id: string;
    };
  };
  