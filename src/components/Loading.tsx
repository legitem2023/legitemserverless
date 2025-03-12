const Loading = () => {
  return (
    <div className="flex w-full bg-[#f1f1f1] shadow-md">
      <div className="flex flex-col w-full text-[#000000] text-[15px] rounded-sm p-2 mb-2">
        <div className="p-1 flex flex-row h-32 shimmer rounded-sm"></div>
      </div> 
      <div className="flex flex-col w-full text-[#000000] text-[15px] rounded-sm p-2 mb-2">
        <div className="p-1 flex flex-row h-32 shimmer rounded-sm"></div>
      </div>
      <div className="flex flex-col w-full text-[#000000] text-[15px] rounded-sm p-2 mb-2">
        <div className="p-1 flex flex-row h-32 shimmer rounded-sm"></div>
      </div> 
    </div>
  );
};

export default Loading;
