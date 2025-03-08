import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: number;
  name: string;
  profilePicture: string;
}

const initialState: UserState = {
  id: 1,
  name: 'Shehzad Nizamani',
  profilePicture: '/shehzad.jpg',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.profilePicture = action.payload.profilePicture;
    },
    updateProfilePicture: (state, action: PayloadAction<string>) => {
      state.profilePicture = action.payload;
    },
    updateUserName: (state, action: PayloadAction<string>) => {
        state.name = action.payload;
      },
    logout: (state) => {
      state.name = '';
      state.profilePicture = '';
    },
  },
});

export const { setCurrentUser, updateProfilePicture, updateUserName, logout } = userSlice.actions;
export default userSlice.reducer;
