import { useState } from "react";
import CryptoJS from 'crypto-js';

function SignupForm({setSigningUp})
{
    const [email,setEmail] = useState('');
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");

    const handleInput=(value,setState)=>{
        setState(value);
    };
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const hashedPassword=CryptoJS.SHA256(password).toString();
        const userData={email,username,password:hashedPassword};
        try
        {
            const response=await fetch("/create-user",{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if(response.ok)
            {
                setSigningUp(false);
            }
            else
            {
                console.log("Couldn't create user on the server side");
            }
        }
        catch(e)
        {
            console.log("Soemthing went wrong singing up",e);
        }
    };
    
    return (
        <div className="basis-10/12 flex flex-col justify-evenly items-center">
            <div className="flex flex-col justify-center items-center">
                <p>E-mail</p>
                <input type="text" value={email} onChange={(e)=>handleInput(e.target.value,setEmail)} className="border-2 border-white"></input>
            </div>
            <div className="flex flex-col justify-center items-center">
                <p>Username</p>
                <input type="text" value={username} onChange={(e)=>handleInput(e.target.value,setUsername)} className="border-2 border-white"></input>
            </div>
            <div className="flex flex-col justify-center items-center">
                <p>Password</p>
                <input type="password" value={password} onChange={(e)=>handleInput(e.target.value,setPassword)} className="border-2 border-white"></input>
            </div>
            <button onClick={(e)=>handleSubmit(e)} className="border-2 border-white">Sign Up</button>
        </div>
    );
}

export default SignupForm