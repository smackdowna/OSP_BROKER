export type TAuction = {
  title: string;
  description: string;
  media: TMedia[];
  categoryIds: string[]; 
  userId: string; 
  timeFrame: string; // or Date, depending on usage
};


export type TMedia = {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  fileType?: string;
};