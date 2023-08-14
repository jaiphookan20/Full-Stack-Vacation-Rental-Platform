// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    /*  Explanation of registerUser(e) & axios.post('/register) function:
        1. The registerUser function then uses Axios to send an HTTP POST request to the 
           /register endpoint of the backend server (axios.post('/register', ...)). 
        
        2. It includes the captured name, email, and password data in the request body.
            ie it is the state values
        
        3. The form element has an onSubmit prop that is set to 'registerUser', meaning the registerUser function 
           will be executed when the form is submitted.
    */

    async function registerUser(e) 
    {
       e.preventDefault(); // to not reload the page each time
       
       try { 
        
        await axios.post('/register', {
            "name": name,
            "email": email,
            "password": password
        }); //using post method of Axios to send an HTTP POST request to the specified URL
    
           alert('Registration sucesful. Now you can log in'); 
        }
       catch(e) {
            alert('Registration failed. Please try again later');
       }
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    {/* value={name} assigns the name state variable as the current value of the input field. The name variable is controlled by the useState hook, as defined in the component's code.
                    onChange={e => setName(e.target.value)} sets up an event handler that triggers when the input value changes. It uses an arrow function to capture the event (e) and update the name state variable with the new value. e.target.value represents the new value entered by the user. */}
                    <input type='text' 
                            placeholder='Name' 
                            value={name} 
                            onChange={e => setName(e.target.value)}
                    />
                    <input type="email" 
                            placeholder={"your@email.com"} 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}        
                    />
                    <input type="password" 
                            placeholder={"your password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}        
                    />
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                    Already a member?
                    <Link to={"/login"} className="underline text-black px-1.5">
                        Login
                    </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage