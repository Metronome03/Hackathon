import React, { createContext, useState,useEffect } from 'react';

export const UserContext = createContext();

export const UserContextProvider=({children})=>{

    const [user,setUser]=useState({});

    const getUserDetails=async ()=>{
        try
        {
          const response=await fetch("/user-data",{
            method:"GET",
            credentials:"include",
          });
          if(response.ok)
          {
            const result=await response.json();
            setUser(result);
          }
          else
          {
            console.log("Couldn't get the user");
          }
        }
        catch(e)
        {
          console.log(e);
        }
      };
      useEffect(()=>{
        getUserDetails();
      },[]);

      return (
        <UserContext.Provider value={{user,setUser}}>
            {children}
        </UserContext.Provider>
      );
}
