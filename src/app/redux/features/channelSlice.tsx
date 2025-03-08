import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentChannelId: 1,
};

const themeSlice = createSlice({
    name: 'channel',
    initialState,
    reducers: {
        setCurrentChannel: (state, action) => { state.currentChannelId = action.payload; },
    }
});

export const { setCurrentChannel } = themeSlice.actions;
export default themeSlice.reducer;
