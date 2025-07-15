export type TPost = {
  title: string;
  description: string;
  media: TMedia[];
};


export type TMedia = {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  fileType?: string;
  postId: string;
};
