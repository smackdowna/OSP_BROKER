export type TPin = {
  image: TMedia | undefined ;
  color: string;
  bought?: boolean;
};


export type TMedia = {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  fileType?: string;
};
