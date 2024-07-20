import { useEffect, useRef } from "react";
import config from "./UserMethods.jsx";

function AddFriendScreen({setDisplayScreen,setFriendsList})
{
    const buttonRef=useRef(null);
    const textRef=useRef(null);

    const handleOutsideClick=(e)=>{
        if(buttonRef.current&&!buttonRef.current.contains(e.target)&&textRef.current&&!textRef.current.contains(e.target))
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
    
    const backClick=()=>{
        setDisplayScreen(0);
    };

    const handleAddFriendRequest=async ()=>{
        const friendEmailInput=document.getElementById("friendEmailInput").value;
        try
        {
            const response=await fetch(config.server+"/add-friend",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({friendEmail:friendEmailInput}),
                credentials:"include",
            });
            if(response.ok)
            {
                const result=await response.json();
                if(result)
                {
                    setFriendsList(prevFriendList=>{
                        return [...prevFriendList,{"email":friendEmailInput,"username":result["username"],"pending":true}]
                    });
                    setDisplayScreen(0);
                }
                else
                {
                    console.log("Could not get the username of the user for whom friend request was sent");
                }
            }
            else
            {
                console.log("User couldn't be added as friend");
            }
        }
        catch(e)
        {
            console.log(e);
        }
    };
    return (
        <div id="chat-display" className="fixed inset-0 bg-cyan-700 w-full h-full flex justify-center items-center">
            <div className="w-5/6 h-5/6 flex flex-col justify-evenly items-center">
            <div className="w-5/6 basis-1/6 flex flex-row justify-start items-start">
                <button className="basis-1/12 h-3/6 hover:bg-gray-700" onClick={backClick}>&lt;</button>
            </div>
            <h4 className="w-full basis-1/6 flex justify-center items-center">Add Friend</h4>
            <div className="w-5/6 basis-2/6 flex flex-col justify-center items-center">
                <h5>Enter the email of the user</h5>
                <input ref={textRef} id="friendEmailInput" type="text" className="w-full basis-1/6 text-black "></input>
            </div>
            <button ref={buttonRef} onClick={handleAddFriendRequest} className="w-5/6 basis-1/6 hover:bg-black hover:text-white border-2">Add Friend</button>
            </div>
        </div>
    );
}

export default AddFriendScreen;