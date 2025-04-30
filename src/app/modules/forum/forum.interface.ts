export type TCategory = {
    name: string;
  };
  
  export type TForum = {
    title: string;
    description: string;
    author: string;
    comments?: number;
    views?: number;
    categoryId: string;
    topics?: TTopic[];
  };
  
  export type TTopic = {
    title: string;
    content: string;
    author: string;
    forumId: string;
    comments?: TComment[];
  };
  
  export type TComment = {
    content: string;
    topicId: string;
    author: string;
  };
  