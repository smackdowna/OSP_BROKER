export type TKudoCoin = {
  price: number;
  description: string;
  userKudoCoin?: TUserKudoCoin[]; // Optional if you're not always including them
};

export type TUserKudoCoin = {
  userId: string;
  kudoCoinId: string;
  quantity: number;
};
