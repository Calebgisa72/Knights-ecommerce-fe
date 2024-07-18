export interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phoneNumber: string;
  photoUrl: string | null;
  verified: boolean;
  status: string;
  userType: string;
  twoFactorEnabled: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
  accountBalance: string;
}

export interface UpdateProfileImage {
  image: string;
}

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
}

export interface UserTwoFactorAuth {
  email: string;
}

export interface ProfileResponse {
  data: {
    code: number;
    message: string;
    profile: ProfileData;
  };
  status: string;
}
