'use client';
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store';
import { toggleSidebar } from '../redux/features/sidebarSlice';
import { toggleDarkMode, setFontSize } from '../redux/features/themeSlice';
import Image from 'next/image';

// channel messages
const channelMessages = [
  {
    channelId: 1,
    messages: [
      {
        id: 1,
        userId: 1,
        text: 'Hello everyone!',
        time: '10:30 AM',
      },
      {
        id: 1,
        userId: 2,
        text: 'Fine, thanks for asking',
        time: '10:45 AM',
      },
    ],
  },
];

const discordChannels = [
  {
    channelId: 1,
    channelName: "General",
    messages: [
      {
        messageId: 1,
        text: "Hello everyone!",
        time: "10:30 AM",
        userId: 1,
      },
      {
        messageId: 2,
        text: "How's it going?",
        time: "10:41 AM",
        userId: 2,
      },
    ],
  },
  {
    channelId: 2,
    channelName: "Gaming",
    messages: [
      {
        messageId: 3,
        text: "Anyone up for a match?",
        time: "01:30 PM",
        userId: 1,
      },
    ],
  },
  {
    channelId: 3,
    channelName: "Coding",
    messages: [
      {
        messageId: 4,
        text: "Does anyone know Redux well?",
        time: "02:30 PM",
        userId: 2,
      },
      {
        messageId: 5,
        text: "Yes, I can help!",
        time: "02:32 PM",
        userId: 1,
        channelId: 3,
      },
    ],
  },
];


// all users are gotten in chatarea only
const allUsers = [
    {
        id: 1,
        name: 'Shehzad Nizamani',
        profilePicture: '/law.jpg',
    },
    {
        id: 2,
        name: 'Aamir Nizamani',
        profilePicture: '/law.jpg',
    },
];

const ChatArea = () => {
  const dispatch = useDispatch();

  // get theme settings
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const fontSize = useSelector((state: RootState) => state.theme.fontSize);

  // get current channel from state
  const currentChannelId = useSelector(
    (state: RootState) => state.channel.currentChannelId,
  );

  // Find messages of current channel
  const currentChannel = discordChannels.find((channel) => channel.channelId === currentChannelId);

  // get id of current user
  const currentUserId = useSelector((state: RootState) => state.user.id);

  // Create a user lookup object outside the JSX loop
  const userMap: Record<number, { id: number; name: string; profilePicture: string }> = allUsers.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {} as Record<number, { id: number; name: string; profilePicture: string }>);


  return (
    <main className={`flex-1 p-6 flex flex-col gap-4 overflow-auto rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-indigo-100"}`}>
      
      {/* Burger Menu Button */}
      <button onClick={() => dispatch(toggleSidebar())}
        className={`${darkMode ? "bg-gray-900" : "bg-indigo-600"}
        w-12 md:hidden p-2 text-white rounded-lg`}>
        ☰
      </button>

      {/* Theme Toggle & Font Size */}
      <div className="flex justify-center items-center gap-4 mb-4">
          <button onClick={() => dispatch(toggleDarkMode())}
          className={`${darkMode ? "bg-gray-900" : "bg-indigo-600"} text-white px-4 py-2 rounded-lg`}>
            Toggle Dark Mode
          </button>
          <select onChange={(e) => dispatch(setFontSize(e.target.value))} value={fontSize}
          className={`${darkMode ? "bg-gray-900" : "bg-indigo-600"} text-white px-4 py-2 rounded-lg`}>
              <option value="text-sm">Small</option>
              <option value="text-base">Medium</option>
              <option value="text-lg">Large</option>
          </select>
      </div>

      {/* Chat Messages */}
      <div className={`flex flex-col space-y-4 ${fontSize}`}>
      {currentChannel?.messages.map((message) => (
        <div key={message.messageId} 
        className={`flex items-start gap-3 p-3 rounded-lg 
          ${darkMode ? (message.userId === currentUserId ? "bg-gray-900 text-white" : "bg-gray-800 text-white") :
           (message.userId === currentUserId ? "bg-indigo-400" : "bg-indigo-300")}`}>
            <Image 
              src={userMap[message.userId]?.profilePicture || "/default.jpg"}
              className="w-10 h-10 rounded-full object-fill"
              alt="Profile"
              width={40}
              height={40}
            />
              <div>
                  <p className="font-bold">
                    {userMap[message.userId]?.name || "Unknown"}
                    <span className={`text-sm ${darkMode ? "text-white" : "text-gray-700"}`}> {message.time}</span>
                  </p>
                  <p className="chat-text">{message.text}</p>
              </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className={`${darkMode ? "bg-gray-900" : "bg-indigo-200"} p-4 flex items-center fixed bottom-4 left-4 md:left-64 right-4 text-black`}>
          <textarea className="bg-white flex-1 p-2 rounded border border-gray-400" rows={2} placeholder="Type your message..."></textarea>
          <button className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg">Send</button>
      </div>
    </main>
  );
};

export default ChatArea;
