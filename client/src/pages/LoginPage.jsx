// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUser} = useContext(UserContext);
    
    async function handleLoginSubmit(e) {
        e.preventDefault();

        try {            
            /* When cookies are reqd to be sent bw diff ports, hosts and domains - even for axios, we need to enable axios to accept cookies using 'withCredentials' as a param */
            const response = await axios.post('/login', {
                "email": email,
                "password": password
            }); 
            //using post method of Axios to send an HTTP POST request to the specified URL

            setUser(response.data); //updating the state value of User by using the setUser func from context
            alert('Login sucesful'); 
            setRedirect(true);
        }
        catch(e) {
            alert('Login failed. Please try again');
        }
    }

    if(redirect) { //ie if login successful, redirect to homepage
        return <Navigate to={'/'} />
    }

  return (
    <div className='mt-4 grow flex items-center justify-around'>
        <div className='mb-64'>
            <h1 className='text-4xl text-center mb-4'>Login</h1>
            
            <form className='max-w-md mx-auto' onSubmit={handleLoginSubmit}>
                <input 
                    type='email' 
                    placeholder={'your@email.com'} 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                /> 
                <input 
                    type='password' 
                    placeholder={'password'} 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                /> 
                <button className='primary'>Login</button>
                <div className='text-center py-2 text-gray-500'>
                    Dont have an account yet?  
                    <Link to={'/register'} className='underline text-black px-1.5'> 
                        Register now
                    </Link>
                </div>
            </form>
        </div>
    </div>
  )
}
export default LoginPage