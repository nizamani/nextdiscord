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
    unreadMsgCount: number;
    messages?: Message[];
}

export interface ChannelState {
    currentChannel: Channel | undefined;
    channels: Channel[];
    loading: boolean;
    error: string | undefined;
}

export interface ReadMsgs {
  channelId: number;
  readMsgId: number;
}

// read messages array
const readMsgs: ReadMsgs[] = [
  {
    channelId: 1,
    readMsgId: 1,
  },
  {
    channelId: 2,
    readMsgId: 2
  },
  {
    channelId: 3,
    readMsgId: 3
  },
  {
    channelId: 4,
    readMsgId: 4
  },
  {
    channelId: 5,
    readMsgId: 5
  },
  {
    channelId: 6,
    readMsgId: 10
  },
  {
    channelId: 7,
    readMsgId: 7
  },
];

// calculate unread msgs for each channel
const updateReadMsgCount = (channels: Channel[], readMsgs: ReadMsgs[]) => {
  return channels.map(channel => {
      const readMsg = readMsgs.find(rm => rm.channelId === channel.id);
      
      // user has read some messages and channel has some messages 
      if (readMsg && channel.messages) {
          const unreadCount = channel.messages.filter(msg => msg.messageId > readMsg.readMsgId).length;
          return { ...channel, unreadMsgCount: unreadCount };

          // There are no unread messages since channel doesn't have any messages
      } else if (channel.messages) {
        return { ...channel, unreadMsgCount: 0 };
      }
      
      return { ...channel, unreadMsgCount: 0 };
  });
};

// Fetch channels and messages together
export const fetchChannelsWithMessages = createAsyncThunk<Channel[]>(
    "channels/fetchChannelsWithMessages",
    async () => {
      const [channelsRes, messagesRes] = await Promise.all([
        fetch("/api/channels"),  // API endpoint for channels
        fetch("/api/messages"),  // API endpoint for messages
      ]);
  
      const channels: Channel[] = await channelsRes.json();
      const messages: Message[] = await messagesRes.json();
  
      // Combine messages into corresponding channels and update unreadMsgCount
      const updatedChannels = channels.map((channel) => ({
        ...channel,
        messages: messages.filter((msg) => msg.channelId === channel.id),
      }));

      return updateReadMsgCount(updatedChannels, readMsgs);
    }
  );

const initialState: ChannelState = {
    currentChannel: undefined,
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

          // Find the latest message in the selected channel
          const channel: Channel[] = state.channels.find(ch => ch.id === action.payload.id);
          if (channel && channel.messages.length > 0) {
              const latestMessageId = Math.max(...channel.messages.map(msg => msg.messageId));

              // Update readMsgs array
              const readMsgIndex = state.readMsgs.findIndex(rm => rm.channelId === channel.id);
              if (readMsgIndex !== -1) {
                  state.readMsgs[readMsgIndex].readMsgId = latestMessageId;
              } else {
                  state.readMsgs.push({ channelId: channel.id, readMsgId: latestMessageId });
              }
          }
        },
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
