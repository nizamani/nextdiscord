import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./features/themeSlice"; // Your existing chat slice
import sidebarSlice from "./features/sidebarSlice"; // Your existing chat slice
import userReducer from "./features/userSlice"; // Import new user slice
import channelReducer from "./features/channelSlice"; // Import new user slice

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    channel: channelReducer,
    sidebar: sidebarSlice,
    user: userReducer, // Add user reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
