import { useEffect, useRef } from "react";
import config from "./UserMethods.jsx";

function CheckFriendRequestScreen({friendsList,setFriendsList,setDisplayScreen})
{
    const requestRef=useRef(null);

    const handleOutsideClick=(e)=>{
        if((getPendingFriendsListSize(friendsList)==0)||(requestRef.current&&!requestRef.current.contains(e.target)))
        {
            setDisplayScreen(0);
        }
    };
    
    useEffect(()=>{
        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
        }, 0);
        return ()=>{
            setTimeout(() => {
                document.removeEventListener('click', handleOutsideClick);
            }, 0);
        }
    },[]);

    const getPendingFriendsListSize=(friendsList)=>{
        let num=0;
        friendsList.map(friend=>{
            if(friend["pending"]==true)
            {
                num+=1;
            }
        });
        return num;
    };
    
    const handleAnswer=async (answer,email,username)=>{
        try
        {
            const data={answer,email};
            const response=await fetch(config.server+"/accept-request",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(data),
                credentials:"include",
            });
            if(response.ok)
            {
                const result=await response.json();
                if(result["accepted"]==true)
                {
                    setFriendsList(prevList=>{
                        const updatedList=prevList.map(friend=>{
                            if(friend["email"]==email);
                            {
                                friend["pending"]=false;
                            }
                            return friend;
                        }
                        );
                        return updatedList;
                    })
                }
                else
                {
                    setFriendsList(prevList=>{
                        const updatedList=prevList.filter(friend=>{
                            if(friend["email"]==email);
                            {
                                return false;
                            }
                            return true;
                        });
                        return updatedList;
                    })
                }
            }
            else
            {
                console.log("User request could not be processed")
            }
        }
        catch(e)
        {
            console.log(e);
        }
    };
    return (
    <div id="friend-requests-display" className="fixed inset-0 bg-cyan-700  w-full h-full flex justify-center items-center">
    <div className="w-5/6 h-5/6 overflow-y-auto max-h-full flex flex-col justify-start items-center">
    {getPendingFriendsListSize(friendsList)==0?(
        <div className="w-full h-full flex justify-center items-center">
            There are no pending friend requests
        </div>
    ):(
        friendsList.map(friendRequest=>{
            if(friendRequest["pending"]==true)
            {
                return (
                    <div ref={requestRef} key={friendRequest.email} className="w-5/6 h-1/6 flex flex-row justify-between items-center bg-slate-100">
                        <div className="basis-4/6 flex flex-col justify-evenls items-start">
                            <div className="basis-3/6">{friendRequest.email}</div>
                            <div className="basis-2/6">{friendRequest.username}</div>
                        </div>
                        <div className="basis-2/6 flex flex-row justify-evenly items-center">
                            <button onClick={()=>handleAnswer(true,friendRequest.email,friendRequest.username)} className="hover:bg-green-800 border-1 border-black">Add</button>
                            <button onClick={()=>handleAnswer(false,friendRequest.email,friendRequest.username)} className="hover:bg-red-800 border-1 border-black">Reject</button>
                        </div>
                    </div>
                );
            }
        })
    )
    }
    </div>
    </div>
    );
}

export default CheckFriendRequestScreen;