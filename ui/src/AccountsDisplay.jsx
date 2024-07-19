import ChatUtilities from "./ChatUtilities.jsx";
import FriendChats from "./FriendChats.jsx";


function AccountsDisplay({setDisplayScreen,friendsList,setCurrentChat})
{
    return (
        <div id="account-display" className="basis-2/6 w-full sm:h-full border-2 border-white flex flex-col justify-start items-center">
            <ChatUtilities setDisplayScreen={setDisplayScreen}/>
            <FriendChats friendsList={friendsList} setCurrentChat={setCurrentChat}/>
        </div>
    );
}

export default AccountsDisplay