import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

function FriendChats({friendsList,addFriendDisplay,setAddFriendDisplay,setCurrentChat})
{
    const handleSelectChat=async (friend)=>{
        await setAddFriendDisplay(false);
        setCurrentChat(friend);
    };
    return (
        <div id="friends-chats" className="w-full basis-5/6 overflow-y-auto max-h-full flex flex-col justfy-start items-center">
            {friendsList.map(friend=>{
                if(friend["pending"]!=true)
                {
                    return (
                        <button onClick={()=>handleSelectChat(friend)} key={friend.email} className="w-full h-3/6 sm:h-1/6 bg-slate-900 hover:bg-black font-thin flex flex-col justify-evenly items-start">
                            <div className="h-3/6 text-xl">
                                {friend.email}
                            </div>
                            <div className="h-2/6 text-md">
                                {friend.username}
                            </div>
                        </button>
                    );
                }
            })}
        </div>
    );
}
function ChatUtilities({setAddFriendDisplay})
{
    const {user}=useContext(UserContext);

    const handleAddFriend=()=>{
        setAddFriendDisplay(true);
    };

    return (
        <div id="chat-utilities" className="w-full basis-1/6 flex flex-col justify-evenly items-center">
            <div className="w-full flex flex-row justify-between items-center">
                <h6 className="basis-4/6">{user.username}</h6>
                <button onClick={handleAddFriend} className="basis-1/6 rounded-full border-3xl border-slate-900 hover:bg-slate-900">+</button>
            </div>
            <div className="w-full flex flex-row justify-evenly items-center">
                <input className="w-full text-black" type="text"></input>
            </div>
        </div>
    );
}

function AccountsDisplay({addFriendDisplay,setAddFriendDisplay,friendsList,setCurrentChat})
{
    return (
        <div id="account-display" className="basis-2/6 w-full sm:h-full border-2 border-white flex flex-col justify-start items-center">
            <ChatUtilities setAddFriendDisplay={setAddFriendDisplay}/>
            <FriendChats addFriendDisplay={addFriendDisplay} setAddFriendDisplay={setAddFriendDisplay} friendsList={friendsList} setCurrentChat={setCurrentChat}/>
        </div>
    );
}

export default AccountsDisplay