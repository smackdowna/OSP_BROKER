import { TMedia } from "../../post/post.interface";

export type TBusinessRateCard = {
  businessId: string;
  name: string;
  logo: TMedia[] | undefined;
  currency: string;
};

export type TBusinessRateCardCategory = {
  name: string;
  orderIndex: number;
};

export type TBusinessRateCardItem = {
  serviceType: string;
  platform: string;
  activity: string;
  description: string;
  unit: string;
  currency: string;
  rate: number;
  isCustom: boolean;
  orderIndex: number;

  businessRateCardId: string;
  businessRateCardCategoryId: string;
};
