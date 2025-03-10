'use client';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/redux/store';
import ChatArea from '../app/components/ChatArea';
import Sidebar from '../app/components/Sidebar';
import { fetchChannelsWithMessages, setCurrentChannel } from './redux/features/channelSlice';
import { useEffect } from 'react';
import SidebarSkeleton from './components/SidebarSkeleton';
import ChatAreaSkeleton from './components/ChatAreaSkeleton';

const ChatApp = () => {
    const dispatch = useDispatch<AppDispatch>(); // Type dispatch correctly

    // id of currently logged in user
    const currentUserId = useSelector((state: RootState) => state.user.id);

    // one we have dispatched channges from database, this will update redux store causing virtual dom to
    // update and display all the channels in the sidebar
    useEffect(() => {
        dispatch(fetchChannelsWithMessages(currentUserId)).unwrap().then((channels) => {
            if (channels.length > 0) {
                dispatch(setCurrentChannel(channels[0])); // Set the first channel
            }
        }).catch((error) => {
            console.error("Failed to fetch channels:", error);
        });
    }, [dispatch, currentUserId]);

  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  // get initial value of channels, this will return an empty array
  const { channels } = useSelector((state: RootState) => state.channel);

    return (
        <div className={`flex flex-col h-screen transition duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-500 text-gray-900"}`}>
            <div className="flex flex-1 overflow-hidden p-4">
            {channels.length > 0 ? (
            <>
                {/* Sidebar */}
                <Sidebar />

                {/* Main Chat Area */}
                <ChatArea />
            </>
            ) : (
                <>
                <SidebarSkeleton />
                <ChatAreaSkeleton />
              </>
            )}
            </div>
        </div>
    );
};

export default ChatApp;
