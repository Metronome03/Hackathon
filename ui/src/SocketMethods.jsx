import io from 'socket.io-client';

export const socket=io('ws://localhost:8080',{
    withCredentials:true,
});

socket.on('connect', () => {
    console.log('Connected to server');
});

export const sendMessage=(user,receiver,content)=>{
    const message={
        timestamp:new Date().toISOString(),
        sender:user["email"],
        receiver:receiver["email"],
        type:"text",
        content:content,
    };
    socket.emit("message",message);
};

export const fileUpload=(user,receiver,content)=>{
    const message={
        timestamp:new Date().toISOString(),
        sender:user["email"],
        receiver:receiver["email"],
        type:"file",
        content:content,
    };
    socket.emit("message",message);
}

export const messageListener=(message,user,setChatMessages)=>{
  setChatMessages(prevObject=>{
      const newObject=JSON.parse(JSON.stringify(prevObject));
      let toAdd="";
      if(user["email"]==message["sender"])
      toAdd=message["receiver"];
      else
      toAdd=message["sender"];
      if(newObject[toAdd])
      {
        const messageExists=newObject[toAdd].some(existingMessage=>
          existingMessage["timestamp"]==message["timestamp"]&&
          existingMessage["sender"]==message["sender"]
        );
        if(!messageExists)
        {
          newObject[toAdd].push(message);
          newObject[toAdd].sort((a,b)=>{
            let dateA=new Date(a["timestamp"]);
            let dateB=new Date(b["timestamp"]);
            return dateA-dateB;
          })
        }
      }
      return newObject;
    });
};