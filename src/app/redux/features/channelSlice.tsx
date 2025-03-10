import { createSlice, createAsyncThunk  } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';

export interface Message {
    id: number;
    channelId: string;
    text: string;
    time: string;
    userId: number;
}

export interface Channel {
    id: string;
    name: string;
    icon: string;
    isFavorite: boolean;
    unreadMsgCount: number;
    messages?: Message[];
}

type UnreadMessages = {
  id: string;
  userId: number;
  channelId: string;
};

export interface ChannelState {
    currentChannel: Channel | undefined;
    unreadMessages: UnreadMessages[], 
    channels: Channel[];
    loading: boolean;
    error: string | undefined;
}

export interface ReadMsgs {
  channelId: string;
  readMsgId: number;
}

// calculate unread msgs for each channel
const updateReadMsgCount = (channels: Channel[], readMsgs: ReadMsgs[]) => {
  return channels.map(channel => {
      const readMsg = readMsgs.find(rm => rm.channelId === channel.id);
      
      // user has read some messages and channel has some messages 
      if (readMsg && channel.messages) {
          const unreadCount = channel.messages.filter(msg => msg.id > readMsg.readMsgId).length;
          return { ...channel, unreadMsgCount: unreadCount };

          // There are no unread messages since channel doesn't have any messages
      } else if (channel.messages) {
        return { ...channel, unreadMsgCount: 0 };
      }
      
      return { ...channel, unreadMsgCount: 0 };
  });
};

// Fetch channels and messages together
export const fetchChannelsWithMessages = createAsyncThunk<Channel[], number>(
    "channels/fetchChannelsWithMessages",
    async (userId: number) => {
      const [channelsRes, messagesRes, readMsgsRes] = await Promise.all([
        fetch("/api/channels"),  // API endpoint for channels
        fetch("/api/messages?action=getmessages"),  // API endpoint for messages
        fetch(`/api/messages?action=getunreadmessages&userId=${userId}`)
      ]);
  
      const channels: Channel[] = await channelsRes.json();
      const messages: Message[] = await messagesRes.json();
      const readMsgs: ReadMsgs[] = await readMsgsRes.json();
  
      // Combine messages into corresponding channels and update unreadMsgCount
      const updatedChannels = channels.map((channel) => ({
        ...channel,
        messages: messages.filter((msg) => msg.channelId === channel.id),
      }));

      return updateReadMsgCount(updatedChannels, readMsgs);
    }
  );

// Async action to update read message in Firebase
export const updateReadMessage = createAsyncThunk(
  "channels/updateReadMessage",
  async ({ channelId, userId }: { channelId: string; userId: number }, { getState }) => {

    const state = getState() as { channel: ChannelState };
    const channel = state.channel.channels.find(c => c.id === channelId);
    if (!channel || !channel.messages || channel.messages.length === 0) return null;

    const mostRecentMessageId = channel.messages[channel.messages.length - 1].id;

    // update channel read message id into database
    await fetch(
      `/api/messages?action=updatereadmsgid&userId=${userId}&mostRecentMessageId=${mostRecentMessageId}`+
      `&channelId=${channelId}`
    );

    console.log('After fetch = ', channelId, mostRecentMessageId);

      return { channelId, readMessageId: mostRecentMessageId };
  }
);

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
          /* .addCase(setUnreadCountToZero.fulfilled, (state, action) => {
            state.channels = state.channels.map(channel =>
                channel.id === action.payload.channelId
                    ? { ...channel, readMessageId: action.payload.readMessageId }
                    : channel
            );
        }); */
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
