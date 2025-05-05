export type TMembershipPlan = {
    name: string;
    description: string;
    price: number;
    duration: number;
    userMembership?: TUserMembership[]; 
  };
  
  export type TUserMembership = {
    userId: string;
    membershipPlanId: string;
    startDate: string; 
    endDate: string; 
    status: string;
    User: TUser;
    MembershipPlan: TMembershipPlan; 
    paymentRecord?: TPaymentRecord[]; 
  };
  
  export type TPaymentRecord = {
    userMembershipId: string;
    amount: number;
    paymentMethod: string;
    status: string;
    transactionId: string;
    UserMembership: TUserMembership; 
  };
  
  export type TUser = {
    id: string;
    fullName: string;
    email: string;
    password: string;
    role: "USER" | "REPRESENTATIVE" | "BUSINESS_ADMIN" | "MODERATOR" | "ADMIN";
    phone: string;
  };
  