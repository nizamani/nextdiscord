'use client';
import { useSelector } from "react-redux";
import { RootState } from '../app/redux/store';
import Sidebar from '../app/components/Sidebar';
import ChatArea from '../app/components/ChatArea';

const ChatApp = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

    return (
        <div className={`flex flex-col h-screen transition duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-indigo-500 text-gray-900"}`}>
            <div className="flex flex-1 overflow-hidden p-4">
                {/* Sidebar */}
                <Sidebar
                />
                
                {/* Main Chat Area (Now in ChatArea.tsx) */}
                <ChatArea 
                />
            </div>
        </div>
    );
};

export default ChatApp;
