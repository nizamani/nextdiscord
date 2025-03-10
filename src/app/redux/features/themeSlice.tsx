import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    darkMode: true,
    fontSize: 'text-base',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleDarkMode: (state) => { state.darkMode = !state.darkMode; },
        setFontSize: (state, action) => { state.fontSize = action.payload; },
    }
});

export const { toggleDarkMode, setFontSize } = themeSlice.actions;
export default themeSlice.reducer;
