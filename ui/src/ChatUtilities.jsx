import { useContext, useEffect, useState,useRef } from "react";
import { UserContext } from "./UserContext";

function MenuIcon({setDisplayScreen}) {
    const [menuDisplay, setMenuDisplay] = useState(false);
    const menuRef=useRef(null);
    const buttonRef=useRef(null);
    const menuItems = ["Friend Requests", "Add friend"];
  
    const handleClick=(e)=>{
      if((menuRef.current&&!menuRef.current.contains(e.target)&&buttonRef.current&&!buttonRef.current.contains(e.target))||(menuDisplay&&menuRef.current.contains(e.target))) 
      {
        setMenuDisplay(false);
      }
    };
  
    useEffect(()=>{
      if(menuDisplay)
      {
        document.addEventListener("click",handleClick);
      }
      else
      {
        document.removeEventListener("click",handleClick);
      }
      return ()=>{
        document.removeEventListener("click",handleClick);
      };
    },[menuDisplay]);
  
    const toggleMenu = () => {
      setMenuDisplay((prevValue) => {
        return !prevValue;
      });
    };
  
    const handleOptionSelect=(e,option)=>{
      e.preventDefault();
      switch(option)
      {
        case menuItems[0]:
          setDisplayScreen(1);
          break;
        case menuItems[1]:
            setDisplayScreen(2);
            break;
        default:
            setDisplayScreen(0);
      }
    };
  
    return (
      <div className="basis-1/6 h-full">
        <div className="relative w-full h-full flex flex-row justify-center">
          <button ref={buttonRef}
            onClick={toggleMenu}
            className="h-5/6 w-2/6 rounded-full transition transition-all ring-0 ring-black hover:bg-black hover:ring-8 bg-black flex flex-col justify-evenly items-center"
          >
            <div className="bg-white w-full h-1/6"></div>
            <div className="bg-white w-full h-1/6"></div>
            <div className="bg-white w-full h-1/6"></div>
          </button>
          {menuDisplay && (
            <div ref={menuRef} className="absolute text-xs top-full left-full mt-2 transform -translate-x-1/2 shadow-lg flex flex-col justify-start items-center">
              {menuItems.map((item) => {
                return (
                  <button key={item} onClick={(e)=>handleOptionSelect(e,item)} className="w-20 h-full bg-black border-1 hover:bg-gray-800">{item}</button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

function ChatUtilities({setDisplayScreen})
{
    const {user}=useContext(UserContext);

    return (
        <div id="chat-utilities" className="w-full basis-1/6 flex flex-col justify-evenly items-center">
            <div className="w-full flex flex-row justify-between items-center">
                <h6 className="basis-4/6">{user.username}</h6>
                <MenuIcon setDisplayScreen={setDisplayScreen}/>
            </div>
            <div className="w-full flex flex-row justify-evenly items-center">
                <input className="w-full text-black" type="text"></input>
            </div>
        </div>
    );
}

export default ChatUtilities;