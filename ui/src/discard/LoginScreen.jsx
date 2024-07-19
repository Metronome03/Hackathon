import { useState } from "react";
import SignupForm from '../SignupForm.jsx'
import LoginForm from '../LoginForm.jsx'

function CheckSignupForm({setAuthenticated})
{
    const [singingUp,setSigningUp] = useState(false);
    if(singingUp)
    {
        return (
            <SignupForm setSigningUp={setSigningUp}/>
        );
    }
    else
    {
        return (
            <LoginForm setSigningUp={setSigningUp} setAuthenticated={setAuthenticated}/>
        );
    }
}

function LoginScreen({setAuthenticated})
{
    return (
        <div className="w-1/2 h-4/5 border-2 border-white flex flex-col justify-evenly items-center">
            <h6 className="flex items-center basis-2/12">ChatPlat</h6>
            <CheckSignupForm setAuthenticated={setAuthenticated}/>
        </div>
    );
}

export default LoginScreen