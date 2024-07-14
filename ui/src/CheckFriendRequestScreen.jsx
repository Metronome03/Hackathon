function CheckFriendRequestScreen({pendingFriendsList,setPendingFriendsList,setFriendsList})
{
    
    const handleAnswer=async (answer,email,username)=>{
        try
        {
            const data={answer,email};
            const response=await fetch("/accept-request",{
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
                    let acceptedUser={};
                    setPendingFriendsList(prevList=>{
                        const updatedList=prevList.filter(request=>{
                            if(request["email"]==email);
                            {
                                setFriendsList(prevList=>[...prevList,request])
                                return false;
                            }
                            return truel
                        }
                        );
                        return updatedList;
                    })
                }
                else
                {

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
        {pendingFriendsList.map(friendRequest=>{
            return (
                <div key={friendRequest.email} className="w-5/6 h-1/6 flex flex-row justify-between items-center bg-slate-900">
                    <div className="basis-4/6 flex flex-col justify-evenls items-start">
                        <div className="basis-3/6">{friendRequest.email}</div>
                        <div className="basis-2/6">{friendRequest.username}</div>
                    </div>
                    <div className="basis-2/6 flex flex-row justify-evenly items-center">
                        <button onClick={()=>handleAnswer(true,friendRequest.email,friendRequest.username)} className="bg-green-800">Add</button>
                        <button onClick={()=>handleAnswer(false,friendRequest.email,friendRequest.username)} className="bg-red-800">Reject</button>
                    </div>
                </div>
            );
        })}
    </div>
    );
}

export default CheckFriendRequestScreen;