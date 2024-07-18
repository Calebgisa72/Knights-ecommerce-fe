import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchProfile,
  updateUserProfile,
  updateUserProfileImage,
  enableTwoFactorAuth,
  disableTwoFactorAuth
} from '../actions/profileAction';
import { ProfileData, ProfileResponse } from '../../types/profileTypes';

export interface profileState {
  profile: ProfileData | object;
  loadingGetProfile: boolean;
  loadingUpdateProfile: boolean;
  loadingUpdateImage: boolean;
  loadingTwoFactor: boolean;
  error: string | null;
  responseMessage: string | null;
}

const initialState: profileState = {
  profile: {},
  loadingGetProfile: false,
  loadingUpdateProfile: false,
  loadingUpdateImage: false,
  loadingTwoFactor: false,
  error: null,
  responseMessage: null
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetState: () => initialState,
    resetResponse: (state) => {
      state.responseMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loadingGetProfile = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<ProfileResponse>) => {
        state.profile = action.payload.data.profile;
        state.loadingGetProfile = false;
      })
      .addCase(fetchProfile.rejected, (state, action: PayloadAction<any>) => {
        state.loadingGetProfile = false;
        state.error = action.payload?.message || 'Something went wrong, please try again.';
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loadingUpdateProfile = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<ProfileResponse>) => {
        state.responseMessage = action.payload.data.message;
        state.profile = action.payload.data.profile;
        state.loadingUpdateProfile = false;
      })
      .addCase(updateUserProfile.rejected, (state, action: PayloadAction<any>) => {
        state.loadingUpdateProfile = false;
        state.error = action.payload?.message || 'Something went wrong, please try again.';
      })
      .addCase(updateUserProfileImage.pending, (state) => {
        state.loadingUpdateImage = true;
        state.error = null;
      })
      .addCase(updateUserProfileImage.fulfilled, (state, action: PayloadAction<ProfileResponse>) => {
        state.responseMessage = action.payload.data.message;
        state.profile = action.payload.data.profile;
        state.loadingUpdateImage = false;
      })
      .addCase(updateUserProfileImage.rejected, (state, action: PayloadAction<any>) => {
        state.loadingUpdateImage = false;
        state.error = action.payload?.message || 'Something went wrong, please try again.';
      })
      .addCase(enableTwoFactorAuth.pending, (state) => {
        state.loadingTwoFactor = true;
        state.error = null;
      })
      .addCase(enableTwoFactorAuth.fulfilled, (state, action: PayloadAction<ProfileResponse>) => {
        state.responseMessage = action.payload.data.message;
        state.profile = action.payload.data.profile;
        state.loadingTwoFactor = false;
      })
      .addCase(enableTwoFactorAuth.rejected, (state, action: PayloadAction<any>) => {
        state.loadingTwoFactor = false;
        state.error = action.payload?.message || 'Something went wrong, please try again.';
      })
      .addCase(disableTwoFactorAuth.pending, (state) => {
        state.loadingTwoFactor = true;
        state.error = null;
      })
      .addCase(disableTwoFactorAuth.fulfilled, (state, action: PayloadAction<ProfileResponse>) => {
        state.responseMessage = action.payload.data.message;
        state.profile = action.payload.data.profile;
        state.loadingTwoFactor = false;
      })
      .addCase(disableTwoFactorAuth.rejected, (state, action: PayloadAction<any>) => {
        state.loadingTwoFactor = false;
        state.error = action.payload?.message || 'Something went wrong, please try again.';
      });
  }
});

export const { resetState, resetResponse } = profileSlice.actions;
export default profileSlice.reducer;
