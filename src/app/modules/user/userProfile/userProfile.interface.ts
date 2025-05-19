export type TEducation = {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  grade: string;
  userProfileId: string;
};

export type TExperience = {
  company: string;
  title: string;
  location: string;
  startDate: Date;
  endDate: Date;
  description: string;
  userProfileId: string;
};

export type TUserProfile = {
  headLine: string;
  location: string;
  isVerified: boolean;
  isProfileComplete: boolean;
  about?: string;
  profileImageUrl?: string;
  education: TEducation[];
  experience: TExperience[];
  skills: string[];
  socialLinks?: Record<string, any>;
  userId: string;
};
