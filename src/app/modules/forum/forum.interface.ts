export type TCategory = {
    name: string;
    description: string;
    icon?: string;
    membership_access : string[];
  };
  
  export type TForum = {
    title: string;
    description: string;
    author: string;
    comments?: number;
    userId: string;
    categoryId: string;
    topics?: TTopic[];
  };
  
  export type TTopic = {
    title: string;
    content: string;
    views?: number;
    author: string;
    forumId: string;
    comments?: TComment[];
  };
  
  export type TComment = {
    comment: string;
    topicId?: string ;
    postId?: string;
    commenterId?: string;
    author: string;
  };
  