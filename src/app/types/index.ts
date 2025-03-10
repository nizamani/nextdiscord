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

export interface ReadMsgs {
  channelId: string;
  readMsgId: number;
}

export interface UnreadMessages {
  id: string;
  userId: number;
  channelId: string;
}
  
export interface ChannelState {
  currentChannel: Channel | undefined;
  unreadMessages: UnreadMessages[];
  channels: Channel[];
  loading: boolean;
  error: string | undefined;
}
