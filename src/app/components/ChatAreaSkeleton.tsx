const ChatAreaSkeleton = () => {
return (
    <main className="flex-1 p-6 flex flex-col gap-4 overflow-auto rounded-lg shadow bg-gray-100 animate-pulse">
    
    {/* Burger Menu Button */}
    <div className="w-12 md:hidden h-10 bg-gray-400 rounded-lg"></div>

    {/* Theme Toggle & Font Size */}
    <div className="flex justify-center items-center gap-4 mb-4">
        <div className="w-32 h-10 bg-gray-400 rounded-lg"></div>
        <div className="w-24 h-10 bg-gray-400 rounded-lg"></div>
    </div>

    {/* Chat Messages (Placeholder) */}
    <div className="flex flex-col space-y-4">
        {[...Array(4)].map((_, index) => (
        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-400 w-3/4">
            <div className="w-10 h-10 rounded-full bg-gray-500"></div>
            <div>
            <div className="w-32 h-5 bg-gray-500 rounded"></div>
            <div className="w-48 h-4 bg-gray-400 rounded mt-1"></div>
            <div className="w-64 h-4 bg-gray-400 rounded mt-1"></div>
            </div>
        </div>
        ))}
    </div>

    {/* Chat Input */}
    <div className="bg-gray-200 p-4 flex items-center fixed bottom-4 left-4 md:left-64 right-4 text-black">
        <div className="bg-gray-300 flex-1 p-2 rounded border border-gray-400 h-16"></div>
        <div className="ml-2 w-16 h-10 bg-gray-500 rounded-lg"></div>
    </div>
    </main>
);
};

export default ChatAreaSkeleton;
