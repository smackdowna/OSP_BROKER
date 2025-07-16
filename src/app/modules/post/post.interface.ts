
export type TPost = {
  title: string;
  description: string;
  businessId: string;
  media: TMedia[] | undefined;
};


export type TMedia = {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  fileType?: string;
};
