import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";


const ProfilePage = () => {
  /* Watch portion between 1hr50mins to 1hr52mins*/
  const {user, ready, setUser} = useContext(UserContext);
  const [redirect, setRedirect] = useState(null);
  
  let {subpage}= useParams();
  // ie if '/account' we set the subpage to 'profile' so that the 'My Profile' link can be shown in red
  if(subpage === undefined) {
    subpage = 'profile';
  }

  /* LOG-OUT FUNCTION: */
  async function logout() {
    await axios.post('/logout');
    setRedirect('/'); //on logout, we should redirect to index page
    setUser(null);  //when we logout, we want to remove the User data from the context, so we set it to null;
  }

  if(!ready) {
    return 'Loading...';
  } 

  /* Explanation at the bottom */
  if(ready && !user && !redirect) {
    return <Navigate to={'/login'} />
  }

  
  if(redirect) {
    /* if redirect is not null. if(redirect) equals if(redirect == true)
      if logout button clicked, redirect is set to ('/') -> then we Navigate to '/'; */
    return <Navigate to={redirect} /> 
  }

  return (
    <div>
      <AccountNav />

      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})< br/>
          <button onClick={logout}   className="primary max-w-sm mt-2">Logout</button>
        </div>
      )}

      {subpage === 'places' && (
        <div>
          <PlacesPage />
        </div>
      )}

  
    </div>
  )
}

export default ProfilePage;


/* Explanation of if(ready && !user && !redirect): 
ready: It represents the state indicating whether the component is ready to render. Initially, it is set to false in the UserContextProvider, and once the user data is fetched and stored in the user state, it is set to true.

!user: It checks if the user state is null or not. If the user state is null, it means the user is not logged in.

!redirect: It checks if the redirect state is null or not. The redirect state is set when the user triggers a logout action. If the redirect state is not null, it means the user has logged out, and the component should navigate to the homepage.

So, when ready is true, the user is null, and the redirect is null, it indicates that the user is not logged in and the component is ready to render. In this case, the component returns <Navigate to={'/login'} />, which triggers a navigation to the login page. This allows the user to be redirected to the login page when they are not logged in and try to access the account page directly.

This condition acts as a guard clause, ensuring that only logged-in users can access the account page, and if a user tries to access it without logging in, they are automatically redirected to the login page for authentication. 
*/