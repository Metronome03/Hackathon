function AddFriendScreen({setAddFriendDisplay,setFriendsList})
{
    const handleAddFriendRequest=async ()=>{
        const friendEmailInput=document.getElementById("friendEmailInput").value;
        try
        {
            const response=await fetch("/add-friend",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({friendEmail:friendEmailInput}),
                credentials:"include",
            });
            if(response.ok)
            {
                setAddFriendDisplay(false);
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
        <div id="chat-display" className="basis-4/6 w-full sm:h-full flex flex-col justify-evenly items-center">
            <h4 className="w-full basis-1/6 flex justify-center items-center">Add Friend</h4>
            <div className="w-5/6 basis-2/6 flex flex-col justify-center items-center">
                <h5>Enter the email of the user</h5>
                <input id="friendEmailInput" type="text" className="w-full basis-1/6 text-black"></input>
            </div>
            <button onClick={handleAddFriendRequest} className="w-5/6 basis-1/6 hover:bg-black border-2">Add Friend</button>
        </div>
    );
}

export default AddFriendScreen;