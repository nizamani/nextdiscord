'use client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { toggleSidebar, toggleSettingsMenu } from '../redux/features/sidebarSlice';
import Image from 'next/image';

export default function Sidebar() {
    const dispatch = useDispatch();

    // get theme mode dark/light
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);

    // tells us what is the state of sidebar whether it's open or not
    const isSidebarOpen = useSelector((state: RootState) => state.sidebar.isSidebarOpen);
    const isSettingsMenuOpen = useSelector((state: RootState) => state.sidebar.isSettingsMenuOpen);

    // user slice to display user's profile picture and their full name
    const user = useSelector((state: RootState) => state.user);

    // this will come inside useEffect from backend
    const channels = [
        {
            key: 1,
            name: 'General',
            icon: '🏠',
            isFavorite: false,
        },
        {
            key: 2,
            name: 'Gaming',
            icon: '🎲',
            isFavorite: false,
        },
        {
            key: 3,
            name: 'Coding',
            icon: '#',
            isFavorite: false,
        },
        {
            key: 4,
            name: 'Movies',
            icon: '#',
            isFavorite: false,
        },
        {
            key: 5,
            name: 'Music',
            icon: '🎸',
            isFavorite: false,
        },
        {
            key: 6,
            name: 'Tech Talk',
            icon: '🧑🏻‍💻',
            isFavorite: true,
        },
        {
            key: 7,
            name: 'Sports',
            icon: '🥎',
            isFavorite: true,
        },
    ];
    
  return (
    <aside className={`pb-20 md:pb-0 h-full fixed md:relative w-1/2 md:w-64 p-5 flex flex-col gap-4 overflow-y-auto rounded-lg transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} ${darkMode ? "bg-gray-800 text-white" : "bg-indigo-200 text-gray-900"}
     ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} 
     ${darkMode ? "bg-gray-800 text-white" : "bg-indigo-200 text-gray-900"}`}>
        <button onClick={() => dispatch(toggleSidebar())}
        className={`md:hidden absolute top-4 right-4 text-xl p-2 rounded-full text-white
             ${darkMode ? "bg-gray-900" : "bg-indigo-700 hover:bg-indigo-600"}`}>✕</button>
        
        {/* Settings */}
        <h2 className="text-lg font-bold">Settings</h2>
        <div className="relative flex items-center mt-2 cursor-pointer" onClick={() => dispatch(toggleSettingsMenu())}>
            <Image src={user.profilePicture} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-gray-600" />
            <div className="select-none ml-3 mt-3">{user.name}</div>
            {isSettingsMenuOpen ? (
                <div className="absolute left-0 top-10 mt-2 w-48 bg-white shadow-lg rounded-lg">
                    <ul className="py-2 text-gray-700">
                        <li><button className="w-full text-left px-4 py-2 hover:bg-gray-200">Logout</button></li>
                    </ul>
                </div>
            ): ''}
        </div>

        {/* Favorite Channels */}
        <h2 className="text-lg font-bold">Favorite Channels</h2>
        <ul className="mt-2">
            {channels.map((channel) => (
                // only favorite channels will be shown here
                (channel.isFavorite) ?
                <li key={channel.key} className={`${darkMode ? "bg-gray-800 text-white" : "bg-indigo-200 text-gray-900"} font-bold p-2 rounded cursor-pointer sidebar-content flex justify-between items-center`}>
                {channel.icon} {channel.name}
                </li>
                // non-favorite channels won't be shown
                : ''
            ))}
        </ul>

        {/* Inbox */}
        <h2 className="text-lg font-bold">Inbox</h2>
        <div className="flex justify-center items-center">
            📩 <button className={`${darkMode ? "bg-gray-800 text-white" : "bg-indigo-200 text-gray-900"} block w-full text-left mt-2 p-2 rounded`}>Direct Messages</button>
        </div>

        {/* Channels */}
        <div>
            <h2 className="text-lg font-bold">
            Channels
            </h2>
            <ul className="mt-2">
                {channels.map((channel) => (
                    (!channel.isFavorite) ?
                    <li key={channel.key} className={`${darkMode ? "bg-gray-800 text-white" : "bg-indigo-200 text-gray-900"} font-bold p-2 rounded cursor-pointer sidebar-content flex justify-between items-center`}>
                    {channel.icon} {channel.name} <span id="unread-general" className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">3</span>
                    </li>
                    // favorite channel won't be shown here
                    : ''
                ))}
            </ul>
        </div>
    </aside>
  )
}
