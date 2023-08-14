import { Link, useLocation } from "react-router-dom";


const AccountNav = () => {

   const location = useLocation(); //Returns the current location object, which represents the current URL in web browsers.
   const pathname = location.pathname;

   let subpage = pathname.split('/')?.[2]; // ie '/account/profile' - we want to extract the portion after 2nd slash
    
    //if we are on 'account/' -> meaning 'My Profile' has been selected, we set the subpage to be equal to profile so that the 'My Profile' button can be shown in red
    if(subpage === 'undefined') {
        subpage = 'profile';
    }
    
  // If we are on 'account/booking' subpage - we want the 'My Bookings' link to be shown in red and vice versa for 'account/places' and 'account'
  function linkClasses(type=null) {

    let classes = 'py-2 px-6 inline-flex gap-1 rounded-full ';

    if(type === subpage) {
      classes += ' bg-primary text-white rounded-full';
    }

    else{
      classes += 'bg-gray-200';
    } 
    
    return classes;
  }

  return (
    <div>
      <nav className="w-full flex justify-center mt-8 gap-2 mb-8">
        <Link className={linkClasses('profile')} to={'/account'}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          My Profile
        </Link>
        <Link className={linkClasses('bookings')} to={'/account/bookings'}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
          My Bookings
        </Link>
        <Link className={linkClasses('places')} to={'/account/places'}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
          </svg>
              My Accomadations
        </Link>
      </nav>
      
    </div>
  );
}

export default AccountNav