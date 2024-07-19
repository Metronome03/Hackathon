import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./UserContext";
import ChatUtilities from './ChatUtilities.jsx'
import FriendChats from './FriendChats.jsx'

function AccountsDisplay({
  addFriendDisplay,
  setAddFriendDisplay,
  friendsList,
  setCurrentChat,
}) {
  return (
    <div
      id="account-display"
      className="basis-2/6 w-full sm:h-full border-2 border-white flex flex-col justify-start items-center"
    >
      <ChatUtilities setAddFriendDisplay={setAddFriendDisplay} />
      <FriendChats
        addFriendDisplay={addFriendDisplay}
        setAddFriendDisplay={setAddFriendDisplay}
        friendsList={friendsList}
        setCurrentChat={setCurrentChat}
      />
    </div>
  );
}

export default AccountsDisplay;
