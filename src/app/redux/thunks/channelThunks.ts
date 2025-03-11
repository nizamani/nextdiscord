import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch } from "../store";
import { Channel, Message, ReadMsgs } from '../../types';
import { setUnreadCountToZero } from '../reducers/channelSlice';
import { updateChannels } from '../reducers/channelSlice';
import { saveMessageToFirebase } from '@/pages/api/messages';

interface SendMessagePayload {
  text: string;
  userId: number;
  selectedChannelId: string;
}

// Calculate unread messages for each channel
export const updateReadMsgCount = (channels: Channel[], readMsgs: ReadMsgs[]) => {
  return channels.map(channel => {
    const readMsg = readMsgs.find(rm => rm.channelId === channel.id);

    if (readMsg && channel.messages) {
      const unreadCount = channel.messages.filter(msg => msg.id > readMsg.readMsgId).length;
      return { ...channel, unreadMsgCount: unreadCount };

      // user haven't read any messages for this channel, but channel does have some messages in it, in this
      // case all of the messages in this channel are unread
    } else if (channel.messages) {
      return { ...channel, unreadMsgCount: channel.messages.length };
    }

    // channel doesn't have any messages in this case, there are no unread messages
    return { ...channel, unreadMsgCount: 0 };
  });
};

// Fetch channels and messages together and calculate unread messages count for each channel
export const fetchChannelsWithMessages = createAsyncThunk<Channel[], number>(
  "channels/fetchChannelsWithMessages",
  async (userId: number) => {
    // make 3 API calls to get channels, messages and unread messages from firestore database
    const [channelsRes, messagesRes, readMsgsRes] = await Promise.all([
      fetch("/api/channels"),
      fetch("/api/messages?action=getmessages"),
      fetch(`/api/messages?action=getunreadmessages&userId=${userId}`),
    ]);

    const channels: Channel[] = await channelsRes.json();
    const messages: Message[] = await messagesRes.json();
    const readMsgs: ReadMsgs[] = await readMsgsRes.json();

    // sort messages in asscending order. Because we have sorted messages by decending order when fetching from
    // database so that we can only get X number most recent messages on page load
    messages.sort((a, b) => a.id - b.id);

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
    
    // if there is no current channel selected or current channel doesn't have have any messages then there is
    // nothing to update into database
    if (!channel || !channel.messages || channel.messages.length === 0) return null;

    // most recent message is the message that is on the last index of the array
    const mostRecentMessageId = channel.messages[channel.messages.length - 1].id;

    // Update channel read message ID in the database
    await fetch(
      `/api/messages?action=updatereadmsgid&userId=${userId}&mostRecentMessageId=${mostRecentMessageId}&channelId=${channelId}`
    );

    return { channelId, readMessageId: mostRecentMessageId };
  }
);

// send message and store sent message into firebase database
export const sendMessage = createAsyncThunk(
  "channels/sendMessage",
  async ({ text, userId, selectedChannelId }: SendMessagePayload, { getState, dispatch }) => {
    // Here we are getting channel from redux store, channel object contains all the channels information such as
    // names of channel, their read message count and messages sent/received into each channel
    const state = getState() as { channel: { channels: Channel[] } };
    const channels: Channel[] = state.channel.channels;
    const currentChannel = channels.find((channel) => channel.id === selectedChannelId);

    // if user doesn't have any current channel selected then don't try to insert this message into database or
    // into redux store
    if (!currentChannel || !text.trim()) return;

    // Determine new message ID (highest existing ID + 1), highest id is highest amoung all messages that user have
    // sent. Note that this is not suitable if we have alot of messages into our redux store. We need to ensure that
    // messages that we show to users is always low. It would be better if we used relational database where
    // messageId is auto-incremented as a primary key
    const allMessages = channels.flatMap((channel) => channel.messages || []);
    const newId = allMessages.length > 0 ? Math.max(...allMessages.map((msg: Message) => msg.id)) + 1 : 1;

    // create message in format that we have channels.messages node, we also have messages in this same format
    // into our firebase database
    const newMessage: Message = {
      id: newId,
      channelId: selectedChannelId,
      text,
      userId,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // create updated channels object so that channel have latest message sent by user
    const updatedChannels = channels.map((channel) =>
      channel.id === selectedChannelId
        ? { ...channel, messages: [...(channel.messages || []), newMessage] }
        : channel
    );

    // update redux store with updated channel data so that our component re-renders
    dispatch(updateChannels(updatedChannels));

    // Save to Firebase
    await saveMessageToFirebase(newMessage);
  }
);

// Mark a channel as read and update the database
export const markChannelAsRead = (channelId: string, userId: number) => 
  async (dispatch: AppDispatch) => {
  dispatch(setUnreadCountToZero(channelId));
  dispatch(updateReadMessage({ channelId, userId }));
};
