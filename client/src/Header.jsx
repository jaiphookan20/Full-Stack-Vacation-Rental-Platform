import {Link} from "react-router-dom";
import {useContext} from "react";
import {UserContext} from "./UserContext.jsx";

export default function Header() {
    /* once login is successful and user state value has been updated using the setUser func -> 
        we can use the value of 'user' from the context to print extra info here 
     */
  const {user} = useContext(UserContext);
  
  return (
    <header className="flex justify-between">
      <Link to={'/'} className="flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="110" height="34.59" viewBox="0 0 512 161"><path fill="#FF385C" d="M147.508 113.996c-.72-2.022-1.562-3.978-2.363-5.79a540.89 540.89 0 0 0-3.772-8.282l-.1-.215a1852.883 1852.883 0 0 0-35.53-72.668l-.529-1.024a472.824 472.824 0 0 0-3.926-7.505A48.76 48.76 0 0 0 95.51 9.62a26.897 26.897 0 0 0-9.248-7.098a26.951 26.951 0 0 0-22.776.003a26.895 26.895 0 0 0-9.246 7.1a48.97 48.97 0 0 0-5.773 8.89a480.76 480.76 0 0 0-3.962 7.574l-.49.95A1854.565 1854.565 0 0 0 8.484 99.71l-.162.35a547.21 547.21 0 0 0-3.709 8.145c-.8 1.811-1.641 3.766-2.362 5.793a35.508 35.508 0 0 0-1.916 17.308a34.195 34.195 0 0 0 6.924 16.173a34.282 34.282 0 0 0 14.055 10.606a34.861 34.861 0 0 0 13.151 2.544c1.416 0 2.831-.083 4.238-.247a43.244 43.244 0 0 0 16.172-5.456c6.523-3.665 12.966-9.036 20.004-16.711c7.038 7.675 13.48 13.046 20.004 16.71a43.225 43.225 0 0 0 16.172 5.457a36.67 36.67 0 0 0 4.238.247c4.507.01 8.973-.854 13.15-2.544a34.286 34.286 0 0 0 14.056-10.606a34.194 34.194 0 0 0 6.924-16.173a35.54 35.54 0 0 0-1.915-17.31Zm-72.629 8.367c-8.713-11.044-14.303-21.3-16.265-29.897a26.439 26.439 0 0 1-.56-9.857a16.106 16.106 0 0 1 2.593-6.739a17.952 17.952 0 0 1 6.302-5.15a17.996 17.996 0 0 1 15.862.002a17.95 17.95 0 0 1 6.301 5.15a16.115 16.115 0 0 1 2.593 6.74a26.447 26.447 0 0 1-.562 9.86c-1.964 8.597-7.553 18.85-16.264 29.891Zm64.368 7.489a23.911 23.911 0 0 1-4.841 11.307a23.971 23.971 0 0 1-9.828 7.416a25.051 25.051 0 0 1-12.336 1.614a32.586 32.586 0 0 1-12.317-4.207c-5.807-3.262-11.685-8.27-18.3-15.617c10.53-12.983 17.106-24.95 19.54-35.61a36.568 36.568 0 0 0 .7-13.7a26.272 26.272 0 0 0-4.274-10.985a28.21 28.21 0 0 0-9.989-8.427a28.256 28.256 0 0 0-25.444 0a28.2 28.2 0 0 0-9.99 8.425a26.272 26.272 0 0 0-4.274 10.981a36.583 36.583 0 0 0 .696 13.696c2.433 10.663 9.009 22.634 19.542 35.621c-6.614 7.346-12.492 12.354-18.299 15.617a32.584 32.584 0 0 1-12.317 4.206a25.054 25.054 0 0 1-12.337-1.614a23.972 23.972 0 0 1-9.827-7.415a23.91 23.91 0 0 1-4.84-11.308a25.183 25.183 0 0 1 1.426-12.42c.574-1.616 1.247-3.2 2.08-5.084a542.847 542.847 0 0 1 3.639-7.991l.162-.352a1844.428 1844.428 0 0 1 35.336-72.266l.492-.955c1.26-2.443 2.562-4.97 3.876-7.411a39.647 39.647 0 0 1 4.539-7.087a16.65 16.65 0 0 1 25.631-.002a39.463 39.463 0 0 1 4.54 7.084c1.301 2.42 2.592 4.924 3.841 7.345l.53 1.027a1842.197 1842.197 0 0 1 35.335 72.267l.1.216c1.23 2.663 2.503 5.415 3.701 8.126c.834 1.886 1.508 3.472 2.081 5.082a25.202 25.202 0 0 1 1.426 12.42Zm69.993-8.782c-4.01 0-7.7-.803-11.07-2.411s-6.257-3.86-8.824-6.753c-2.567-2.894-4.492-6.27-5.937-9.969c-1.444-3.859-2.086-8.04-2.086-12.541c0-4.502.803-8.844 2.247-12.703c1.444-3.858 3.53-7.235 6.097-10.29c2.567-2.894 5.615-5.306 9.145-6.914c3.53-1.608 7.22-2.412 11.392-2.412c4.01 0 7.54.804 10.75 2.573c3.209 1.608 5.776 4.02 7.861 7.074l.482-7.878h14.76v60.617h-14.76l-.482-8.843c-2.085 3.215-4.813 5.788-8.343 7.717c-3.209 1.77-7.06 2.734-11.231 2.734Zm3.852-14.47c2.888 0 5.455-.804 7.862-2.251c2.246-1.608 4.01-3.698 5.455-6.27c1.283-2.573 1.925-5.628 1.925-9.005c0-3.377-.642-6.432-1.925-9.004c-1.284-2.573-3.21-4.663-5.455-6.27c-2.247-1.609-4.974-2.252-7.862-2.252s-5.455.804-7.862 2.251c-2.246 1.608-4.011 3.698-5.455 6.27c-1.284 2.573-1.926 5.628-1.926 9.005c0 3.377.642 6.432 1.926 9.004c1.283 2.573 3.209 4.663 5.455 6.27c2.407 1.448 4.974 2.252 7.862 2.252Zm56.156-64.155c0 1.769-.321 3.377-1.124 4.663a9.273 9.273 0 0 1-3.369 3.216c-1.444.804-3.048 1.125-4.652 1.125c-1.605 0-3.21-.321-4.654-1.125a9.273 9.273 0 0 1-3.369-3.216c-.802-1.447-1.123-2.894-1.123-4.663c0-1.768.32-3.376 1.123-4.663c.802-1.447 1.925-2.411 3.37-3.215c1.443-.804 3.048-1.126 4.653-1.126c1.604 0 3.208.322 4.652 1.126a9.272 9.272 0 0 1 3.37 3.215c.641 1.287 1.123 2.734 1.123 4.663Zm-17.168 76.857V58.685h16.044v60.617H252.08Zm58.884-44.7v.162c-.802-.322-1.765-.483-2.568-.643c-.962-.161-1.765-.161-2.727-.161c-4.493 0-7.862 1.286-10.108 4.02c-2.407 2.733-3.53 6.592-3.53 11.576v29.746h-16.044V58.685h14.76l.482 9.165c1.604-3.216 3.53-5.628 6.257-7.396c2.567-1.77 5.615-2.573 9.145-2.573c1.124 0 2.247.16 3.21.321c.48.161.801.161 1.123.322v16.079Zm6.417 44.7v-85.54h16.045v32.64c2.246-2.893 4.813-5.145 8.022-6.913c3.21-1.608 6.74-2.573 10.75-2.573s7.701.804 11.07 2.412c3.37 1.608 6.258 3.859 8.825 6.753c2.568 2.894 4.493 6.271 5.937 9.97c1.444 3.858 2.085 8.038 2.085 12.54c0 4.503-.802 8.844-2.245 12.703c-1.445 3.859-3.53 7.235-6.098 10.29c-2.567 2.895-5.615 5.306-9.145 6.914c-3.53 1.608-7.22 2.412-11.391 2.412c-4.012 0-7.541-.804-10.75-2.573c-3.21-1.608-5.777-4.02-7.862-7.074l-.482 7.878l-14.76.161Zm30.966-12.702c2.889 0 5.456-.804 7.862-2.251c2.246-1.608 4.011-3.698 5.455-6.27c1.284-2.573 1.926-5.628 1.926-9.005c0-3.377-.642-6.432-1.926-9.004c-1.444-2.573-3.209-4.663-5.455-6.27c-2.246-1.609-4.973-2.252-7.862-2.252c-2.888 0-5.455.804-7.861 2.251c-2.247 1.608-4.012 3.698-5.456 6.27c-1.283 2.573-1.925 5.628-1.925 9.005c0 3.377.642 6.432 1.925 9.004c1.284 2.573 3.21 4.663 5.456 6.27c2.406 1.448 4.973 2.252 7.861 2.252Zm37.866 12.702V58.685h14.76l.482 7.879c1.765-2.895 4.171-5.146 7.22-6.914c3.048-1.769 6.578-2.573 10.59-2.573c4.492 0 8.342 1.125 11.551 3.216c3.37 2.09 5.937 5.145 7.702 9.004c1.765 3.859 2.727 8.521 2.727 13.828v36.338h-16.044V85.215c0-4.18-.963-7.557-2.888-9.97c-1.925-2.41-4.493-3.697-7.862-3.697c-2.407 0-4.493.482-6.418 1.608c-1.765 1.125-3.209 2.572-4.332 4.663c-1.123 1.929-1.604 4.34-1.604 6.753v34.73h-15.884Zm63.054 0v-85.54h16.045v32.64c2.246-2.893 4.813-5.145 8.022-6.913c3.21-1.608 6.74-2.573 10.75-2.573c4.012 0 7.702.804 11.071 2.412c3.37 1.608 6.257 3.859 8.824 6.753c2.57 2.894 4.492 6.271 5.938 9.97c1.446 3.858 2.083 8.038 2.083 12.54c0 4.503-.798 8.844-2.244 12.703c-1.445 3.859-3.529 7.235-6.099 10.29c-2.566 2.895-5.614 5.306-9.144 6.914c-3.53 1.608-7.22 2.412-11.391 2.412c-4.011 0-7.541-.804-10.75-2.573c-3.21-1.608-5.776-4.02-7.862-7.074l-.481 7.878l-14.762.161Zm31.127-12.702c2.888 0 5.455-.804 7.862-2.251c2.246-1.608 4.01-3.698 5.455-6.27c1.284-2.573 1.926-5.628 1.926-9.005c0-3.377-.642-6.432-1.926-9.004c-1.283-2.573-3.209-4.663-5.455-6.27c-2.247-1.609-4.974-2.252-7.862-2.252s-5.455.804-7.862 2.251c-2.246 1.608-4.01 3.698-5.455 6.27c-1.444 2.573-1.926 5.628-1.926 9.005c0 3.377.643 6.432 1.926 9.004c1.284 2.573 3.21 4.663 5.455 6.27c2.407 1.448 4.814 2.252 7.862 2.252Z"/></svg>
      </Link>
      <div className="flex gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-300">
        <div>Anywhere</div>
        <div className="border-l border-gray-300"></div>
        <div>Any week</div>
        <div className="border-l border-gray-300"></div>
        <div>Add guests</div>
        <button className="bg-primary text-white p-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>
      </div>

      {/* This is the Top-right section containing the hamburger menu, user icon and Name*/}
      {/* If we have logged in user successfully, clicking on this top right user bar should take us to account. If not logged in successfully, then go to login page*/}
      <Link to={user?'/account':'/login'} className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 ">
        
        {/* Hamburger menu */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>

        {/* User icon */}
        <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 relative top-1">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
          </svg>
        </div>
        {/* This is where the name gets displayed (next to the user icon double!! converts user into a boolean */}
        {!!user && (
          <div>
            {user.name}
          </div>
        )}
      </Link>
    </header>
  );
}