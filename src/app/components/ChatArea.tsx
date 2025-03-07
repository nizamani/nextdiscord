'use client';
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store';
import { toggleSidebar } from '../redux/features/sidebarSlice';
import { toggleDarkMode, setFontSize } from '../redux/features/themeSlice';

const ChatArea = () => {
  const dispatch = useDispatch();

  // get theme settings
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const fontSize = useSelector((state: RootState) => state.theme.fontSize);

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
          <div className={`flex items-start gap-3 p-3 rounded-lg ${darkMode ? "bg-gray-600 text-white" : "bg-indigo-300"}`}>
              <img src="law.jpg" className="w-10 h-10 rounded-full" alt="Profile" />
              <div>
                  <p className="font-bold">User123 <span className="text-sm chat-time">10:30 AM</span></p>
                  <p className="chat-text">Hello everyone!</p>
              </div>
          </div>
          <div className={`flex items-start gap-3 p-3 rounded-lg ${darkMode ? "bg-gray-900 text-white" : "bg-indigo-400"}`}>
              <img src="law.jpg" className="w-10 h-10 rounded-full" alt="Profile" />
              <div>
                  <p className="font-bold">User456 <span className="text-sm chat-time">10:45 AM</span></p>
                  <p className="chat-text">What's up?</p>
              </div>
          </div>
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
