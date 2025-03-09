import { createSlice, createAsyncThunk  } from '@reduxjs/toolkit';

export interface Message {
    messageId: number;
    channelId: number;
    text: string;
    time: string;
    userId: number;
}

export interface Channel {
    id: number;
    name: string;
    icon: string;
    isFavorite: boolean;
    messages?: Message[];
}

export interface ChannelState {
    currentChannel: Channel;
    channels: Channel[];
    loading: boolean;
    error: string | undefined;
}

// Fetch channels and messages together
export const fetchChannelsWithMessages = createAsyncThunk(
    "channels/fetchChannelsWithMessages",
    async () => {
      const [channelsRes, messagesRes] = await Promise.all([
        fetch("/api/channels"),  // API endpoint for channels
        fetch("/api/messages"),  // API endpoint for messages
      ]);
  
      const channels: Channel[] = await channelsRes.json();
      const messages: Message[] = await messagesRes.json();
  
      // Combine messages into corresponding channels
      return channels.map((channel) => ({
        ...channel,
        messages: messages.filter((msg) => msg.channelId === channel.id),
      }));
    }
  );

const initialState: ChannelState = {
    currentChannel: { id: 1, name: "General", icon: "🏠", isFavorite: false },
    channels: [],
    loading: false,
    error: undefined,
};

const themeSlice = createSlice({
    name: 'channel',
    initialState,
    reducers: {
        setCurrentChannel: (state, action) => { state.currentChannel = action.payload; },
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
          });
    },
});

export const { setCurrentChannel } = themeSlice.actions;
export default themeSlice.reducer;
