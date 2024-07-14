import { useState } from "react";
import CryptoJS from 'crypto-js';

function LoginForm({setSigningUp,setAuthenticated})
{
    const [identifier,setIdentifier] = useState('');
    const [password,setPassword] = useState("");

    const handleLogin=async (e)=>{
        e.preventDefault();
        const hashedPassword=CryptoJS.SHA256(password).toString();
        const userData={identifier,password:hashedPassword};
        try
        {
            const response=await fetch("/login-user",{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if(response.ok)
            {
                const result=await response.json();
                document.cookie=`token=${result.token};max-age=${30*60*60};path=/`
                setAuthenticated(true);
            }
            else
            {
                console.log("Something went wrong on the server side");
            }
        }
        catch(e)
        {
            console.log("Couldn't reach the server for authentication",e);
        }
    }

    const handleInput=(value,setState)=>{
        setState(value);
    };

    const handleScreenChange=()=>{
        setSigningUp(true);
    }
    return (
        <div className="basis-10/12 flex flex-col justify-evenly items-center">
            <div className="flex flex-col justify-center items-center">
                <p>Username or E-mail</p>
                <input type="text" value={identifier} onChange={(e)=>handleInput(e.target.value,setIdentifier)} className="border-2 border-white"></input>
            </div>
            <div className="flex flex-col justify-center items-center">
                <p>Password</p>
                <input type="password" value={password} onChange={(e)=>handleInput(e.target.value,setPassword)} className="border-2 border-white"></input>
            </div>
            <button type="submit" onClick={(e)=>handleLogin(e)} className="border-2 border-white basis-2/12">Sign In</button>
            <a className="text-white text-sm" onClick={handleScreenChange}>Dont have an account? Sign Up</a>
        </div>
    );
}

export default LoginForm