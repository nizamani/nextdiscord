const SidebarSkeleton = () => {
return (
    <aside className="pb-20 md:pb-0 h-full fixed md:relative w-1/2 md:w-64 p-5 flex flex-col gap-4 overflow-y-auto rounded-lg transition-transform duration-300 ease-in-out -translate-x-full md:translate-x-0 
     bg-gray-100 text-gray-900 animate-pulse">
    
    {/* Close Button */}
    <div className="w-10 h-10 bg-gray-400 rounded-lg self-end"></div>

    {/* Settings Placeholder */}
    <div className="w-24 h-6 bg-gray-400 rounded"></div>
    <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-500"></div>
        <div className="w-32 h-5 bg-gray-400 rounded"></div>
    </div>

    {/* Inbox */}
    <div className="w-24 h-6 bg-gray-400 rounded"></div>
    <div className="w-full h-10 bg-gray-400 rounded"></div>

    {/* Channels Placeholder */}
    <div className="w-32 h-6 bg-gray-400 rounded"></div>
    {[...Array(5)].map((_, index) => (
        <div key={index} className="w-full h-10 bg-gray-400 rounded mt-2"></div>
    ))}
    </aside>
);
};

export default SidebarSkeleton;
