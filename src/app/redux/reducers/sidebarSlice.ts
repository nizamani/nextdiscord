import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isSidebarOpen: false,
    isSettingsMenuOpen: false,
};

const sidebarSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        toggleSidebar: (state) => { state.isSidebarOpen = !state.isSidebarOpen; },
        closeSidebar: (state) => { state.isSidebarOpen = false; },
        toggleSettingsMenu: (state) => { state.isSettingsMenuOpen = !state.isSettingsMenuOpen; },
    }
});

export const { toggleSidebar, closeSidebar, toggleSettingsMenu } = sidebarSlice.actions;
export default sidebarSlice.reducer;
