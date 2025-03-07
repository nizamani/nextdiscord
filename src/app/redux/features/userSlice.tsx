import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  name: string;
  profilePicture: string;
}

const initialState: UserState = {
  name: 'Shehzad Nizamani',
  profilePicture: 'law.jpg',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
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

export const { setUser, updateProfilePicture, updateUserName, logout } = userSlice.actions;
export default userSlice.reducer;
