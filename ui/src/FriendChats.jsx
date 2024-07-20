function FriendChats({friendsList,setCurrentChat})
{
    const handleSelectChat=async (friend)=>{
        setCurrentChat(friend);
    };
    return (
        <div id="friends-chats" className="w-full basis-5/6 overflow-y-auto max-h-full flex flex-col justfy-start items-center">
            {friendsList.map(friend=>{
                if(friend["pending"]!=true)
                {
                    return (
                        <button onClick={()=>handleSelectChat(friend)} key={friend.email} className="w-full h-3/6 sm:h-1/6 border-1 border-black bg-blue-950 hover:bg-black font-thin flex flex-col justify-evenly items-start">
                            <div className="h-3/6 text-xl pl-2">
                                {friend.email}
                            </div>
                            <div className="h-2/6 text-md pl-2">
                                {friend.username}
                            </div>
                        </button>
                    );
                }
            })}
        </div>
    );
}

export default FriendChats;