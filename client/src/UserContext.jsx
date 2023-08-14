/*
In the provided code, a UserContext is created using the createContext function from React. 
The UserContext allows sharing data across multiple components in a React application
*/
import { createContext, useEffect } from "react";
import { useState } from "react";
import axios from "axios";

export const UserContext = createContext({}); //By providing an empty object as the initial value ({}), the context is initialized with an empty value. 


// eslint-disable-next-line react/prop-types
export function UserContextProvider({children}) {
    const [user, setUser] = useState(null);
    const [ready,setReady] = useState(false);

    /* Reason for this, as per tutorial: 
    When we refresh the app, we no longer have our name displayed because we lose our context
    "When we load our app, we should grab login status, to determine whether we are logged in or not. 
    We have the cookie but we don't have any context because we are setting context only on the login page, 
    when we log in"
    */

    useEffect(() => {
        //if user is null (indicating that the profile data hasn't been fetched yet), we want to fetch info about our user ie the cookie
        if(!user) {
            //when this is called, it triggers a call in index.js to the route '/profile', which in turn retrieves the cookie string as a response
            axios.get('/profile')
                .then(({data}) => {
                    setUser(data);
                    setReady(true);
                });
        }
    },[])
    
    return (
        /* The UserContext.Provider component is used to provide the user and setUser values to all the components that are descendants of UserContextProvider. 
           The value prop of UserContext.Provider is set to an object with user and setUser properties, which allows these values to be accessed by consuming components within the context.
        */
        <UserContext.Provider value={ {user, setUser, ready} }> 
            {children}
        </UserContext.Provider>
    );
}

/* Explanation of the Axios.get request to '/profile' endpoint:   

The UserContextProvider fetches user profile data upon mounting using an Axios GET request to /profile, 
which triggers the corresponding route in Index.js to retrieve the user data from the User model based on the provided token. 

The fetched user data is then set in the context state. 
*/

/* UserContext.Provider & Children explanation: 
In summary, the code defines a UserContext and a UserContextProvider component. 

In the provided code, the UserContextProvider component uses the children prop to wrap other components. When you use the UserContextProvider component like this:

<UserContextProvider>
  <Component1 />
  <Component2 />
</UserContextProvider>
  
The <Component1 />, <Component2 />, and other components within the UserContextProvider tags are 
considered children of the UserContextProvider component.
  
By wrapping components with the UserContextProvider, the child components gain access to the values provided 
by the UserContext.Provider, such as the user data and the setUser function.
  
This means that within the child components, you can access and update the user data by
 using the UserContext.Consumer or the useContext(UserContext) hook, depending on whether 
 you are using a functional component or a class component.

The UserContextProvider wraps other components, providing them with access to the user data 
and the ability to update it through the setUser function

*/