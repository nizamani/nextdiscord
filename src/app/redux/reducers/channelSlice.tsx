import { createSlice } from '@reduxjs/toolkit';
import { ChannelState } from '../../types';
import { fetchChannelsWithMessages, updateReadMessage } from '../thunks/channelThunks';
import { AppDispatch } from '../store';

const initialState: ChannelState = {
    currentChannel: undefined,
    unreadMessages: [],
    channels: [],
    loading: false,
    error: undefined,
};

const themeSlice = createSlice({
    name: 'channel',
    initialState,
    reducers: {
        setCurrentChannel: (state, action) => {
          state.currentChannel = action.payload;
        },
        setUnreadMessages: (state, action) => {
          state.unreadMessages = action.payload;
        },
        setUnreadCountToZero: (state, action) => {
          state.channels = state.channels.map(channel => 
              channel.id === action.payload 
                  ? { ...channel, unreadMsgCount: 0 } 
                  : channel
          );
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchChannelsWithMessages.pending, (state) => {
            state.loading = true;
          })
          .addCase(fetchChannelsWithMessages.fulfilled, (state, action) => {
            state.loading = false;
            state.channels = action.payload; // Store combined channels & messages
          })
          .addCase(fetchChannelsWithMessages.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
    },
});

// mark message as read and update database
export const markChannelAsRead = (channelId: string, userId: number) => 
  async (dispatch: AppDispatch) => {
    dispatch(setUnreadCountToZero(channelId));
    dispatch(updateReadMessage({ channelId, userId }));
};

export const { setCurrentChannel, setUnreadMessages, setUnreadCountToZero } = themeSlice.actions;
export default themeSlice.reducer;
