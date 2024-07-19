import config from './main.jsx'

function CheckFriendRequestScreen({friendsList,setFriendsList})
{
    
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
                if(result["accepted"])
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
                    });
                }
                else
                {
                    setFriendsList(prevList=>{
                        const updatedList=prevList.filter(friend=>{
                            return friend["email"]!=email;
                        });
                        return updatedList;
                    });
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
    return (<div className="basis-4/6 w-full sm:h-full overflow-y-auto max-h-full flex flex-col justify-start items-center">
        {friendsList.map(friend=>{
            if(friend["pending"])
            {
                return (
                    <div key={friend.email} className="w-5/6 h-1/6 flex flex-row justify-between items-center bg-slate-900">
                        <div className="basis-4/6 flex flex-col justify-evenls items-start">
                            <div className="basis-3/6">{friend.email}</div>
                            <div className="basis-2/6">{friend.username}</div>
                        </div>
                        <div className="basis-2/6 flex flex-row justify-evenly items-center">
                            <button onClick={()=>handleAnswer(true,friend.email,friend.username)} className="bg-green-800">Add</button>
                            <button onClick={()=>handleAnswer(false,friend.email,friend.username)} className="bg-red-800">Reject</button>
                        </div>
                    </div>
                );
            }
        })}
    </div>
    );
}

export default CheckFriendRequestScreen;