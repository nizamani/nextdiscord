'use client';
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store';
import { toggleSidebar } from '../redux/features/sidebarSlice';
import { toggleDarkMode, setFontSize } from '../redux/features/themeSlice';
import Image from 'next/image';
// import { useEffect } from 'react';
// import { fetchChannelsWithMessages } from '../redux/features/channelSlice';

// all users are gotten in chatarea only
const allUsers = [
    {
        id: 1,
        name: 'Shehzad Nizamani',
        profilePicture: '/shehzad.jpg',
    },
    {
        id: 2,
        name: 'Miya',
        profilePicture: '/miya.jpg',
    },
];

const ChatArea = () => {
  const dispatch = useDispatch<AppDispatch>(); // Type dispatch correctly

  // get theme settings
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const fontSize = useSelector((state: RootState) => state.theme.fontSize);

  // current channel will be "General" because that is set as initial current channel value. When user clicks on
  // a channel from sidebar, this will update to that channel
  const currentChannel = useSelector((state: RootState) => state.channel.currentChannel);

  // id of currently logged in user
  const currentUserId = useSelector((state: RootState) => state.user.id);

  // Create a user lookup object outside the JSX loop
  const userMap: Record<number, { id: number; name: string; profilePicture: string }> = allUsers.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {} as Record<number, { id: number; name: string; profilePicture: string }>);


  return (
    <main className={`flex-1 p-6 flex flex-col gap-4 overflow-auto rounded-lg shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
      
      {/* Burger Menu Button */}
      <button onClick={() => dispatch(toggleSidebar())}
        className={`${darkMode ? "bg-gray-900" : "bg-gray-70"}
        w-12 md:hidden p-2 text-white rounded-lg`}>
        ☰
      </button>

      {/* Theme Toggle & Font Size */}
      <div className="flex justify-center items-center gap-4 mb-4">
          <button onClick={() => dispatch(toggleDarkMode())}
          className={`${darkMode ? "bg-gray-900" : "bg-gray-700"} text-white px-4 py-2 rounded-lg`}>
            Toggle Dark Mode
          </button>
          <select onChange={(e) => dispatch(setFontSize(e.target.value))} value={fontSize}
          className={`${darkMode ? "bg-gray-900" : "bg-gray-700"} text-white px-4 py-2 rounded-lg`}>
              <option value="text-sm">Small</option>
              <option value="text-base">Medium</option>
              <option value="text-lg">Large</option>
          </select>
      </div>

      {/* Chat Messages */}
      <div className={`flex flex-col space-y-4 ${fontSize}`}>
      {currentChannel !== undefined && currentChannel?.messages && currentChannel?.messages.map((message) => (
        <div key={message.id} 
        className={`flex items-start gap-3 p-3 rounded-lg 
          ${darkMode ? (message.userId === currentUserId ? "bg-gray-900 text-white" : "bg-gray-800 text-white") :
           (message.userId === currentUserId ? "bg-gray-400" : "bg-gray-300")}`}>
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
                    <span className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-700"}`}> {message.time}</span>
                  </p>
                  <p className="chat-text">{message.text}</p>
              </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className={`${darkMode ? "bg-gray-800" : "bg-gray-200"} p-4 flex items-center fixed bottom-4 left-4 md:left-64 right-4 text-black`}>
          <textarea className="bg-white flex-1 p-2 rounded border border-gray-400" rows={2} placeholder="Type your message..."></textarea>
          <button className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg">Send</button>
      </div>
    </main>
  );
};

export default ChatArea;
