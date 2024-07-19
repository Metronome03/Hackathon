function FriendChats({
    friendsList,
    addFriendDisplay,
    setAddFriendDisplay,
    setCurrentChat,
  }) {
    const handleSelectChat = async (friend) => {
      await setAddFriendDisplay(false);
      setCurrentChat(friend);
    };
    return (
      <div
        id="friends-chats"
        className="w-full basis-5/6 overflow-y-auto max-h-full flex flex-col justfy-start items-center"
      >
        {friendsList.map((friend) => {
          if (!friend["pending"]) {
            return (
              <button
                onClick={() => handleSelectChat(friend)}
                key={friend.email}
                className="w-full h-3/6 sm:h-1/6 bg-slate-900 hover:bg-black font-thin flex flex-col justify-evenly items-start"
              >
                <div className="h-3/6 text-xl">{friend.email}</div>
                <div className="h-2/6 text-md">{friend.username}</div>
              </button>
            );
          }
        })}
      </div>
    );
  }

  export default FriendChats;