import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./reducers/themeSlice"; // Your existing chat slice
import sidebarSlice from "./reducers/sidebarSlice"; // Your existing chat slice
import userReducer from "./reducers/userSlice"; // Import new user slice
import channelReducer from "./reducers/channelSlice"; // Import new user slice

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
