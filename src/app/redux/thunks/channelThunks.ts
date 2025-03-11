import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch } from "../store";
import { Channel, Message, ReadMsgs } from '../../types';
import { setUnreadCountToZero } from '../reducers/channelSlice';

// Calculate unread messages for each channel
export const updateReadMsgCount = (channels: Channel[], readMsgs: ReadMsgs[]) => {
  return channels.map(channel => {
    const readMsg = readMsgs.find(rm => rm.channelId === channel.id);

    if (readMsg && channel.messages) {
      const unreadCount = channel.messages.filter(msg => msg.id > readMsg.readMsgId).length;
      return { ...channel, unreadMsgCount: unreadCount };
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
      fetch("/api/channels"),
      fetch("/api/messages?action=getmessages"),
      fetch(`/api/messages?action=getunreadmessages&userId=${userId}`),
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
    const state = getState() as { channel: { channels: Channel[] } };
    const channel = state.channel.channels.find(c => c.id === channelId);
    
    if (!channel || !channel.messages || channel.messages.length === 0) return null;

    const mostRecentMessageId = channel.messages[channel.messages.length - 1].id;

    // Update channel read message ID in the database
    await fetch(
      `/api/messages?action=updatereadmsgid&userId=${userId}&mostRecentMessageId=${mostRecentMessageId}&channelId=${channelId}`
    );

    return { channelId, readMessageId: mostRecentMessageId };
  }
);

// Mark a channel as read and update the database
export const markChannelAsRead = (channelId: string, userId: number) => 
  async (dispatch: AppDispatch) => {
  dispatch(setUnreadCountToZero(channelId));
  dispatch(updateReadMessage({ channelId, userId }));
};
