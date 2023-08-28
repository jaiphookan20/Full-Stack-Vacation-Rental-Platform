/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";

/* Overall Summary: 

The overall logic of the code is to create a booking widget component that allows 
users to book a place. Here's a breakdown of the flow:

The component receives the place prop, which represents the place being booked.

State variables are set up using the useState hook to manage form inputs and r
edirection. These include checkIn, checkOut, numberOfGuests, name, phone, and redirect.

The UserContext is accessed using the useContext hook to retrieve the user object. 
If a user is available, the name state variable is updated with the user's name 
using the setName function. This allows the user's name to be pre-filled in the 
booking form if they are logged in.

The number of nights is calculated based on the checkIn and checkOut dates using the 
differenceInCalendarDays function from the date-fns library.

The bookLocation function is defined to handle the booking process. It makes a 
POST request to the /bookings endpoint with the booking data including checkIn, 
checkOut, numberOfGuests, name, phone, place, and price (calculated as numberOfNights 
  * place.price). The booking ID is then retrieved from the server response, and the 
  redirect state variable is set to the path of the booking details page using the 
  setRedirect function.

If the redirect state is set (i.e., a booking has been made), the component returns 
a <Navigate> component from the react-router-dom library, which redirects the user 
to the specified path.

The component renders the booking form UI, including the place price, check-in and 
check-out date inputs, number of guests input, and optionally, the user's name and 
phone number inputs if the number of nights is greater than 0.

When the user clicks the "Book this place" button, the bookLocation function is 
called.

The total price is displayed next to the "Book this place" button, calculated as 
numberOfNights * place.price.
*/

export default function BookingWidget({ place }) {
  // State variables for storing form data and redirection
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [redirect, setRedirect] = useState('');
  
  // Accessing user context from UserContext provider
  const { user } = useContext(UserContext);

  // Update name field if user context changes
  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  // Calculate the number of nights based on check-in and check-out dates
  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  // Function to handle the booking process
  async function bookLocation() {
    // Make a POST request to the server to create a booking
    const response = await axios.post('/bookings', {
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      place: place._id,
      price: numberOfNights * place.price,
    });
    
    // Retrieve the booking ID from the server response
    const bookingId = response.data._id;
    
    // Set the redirect path to the booking details page
    setRedirect(`/account/bookings/${bookingId}`);
  }

  // If redirect state is set, navigate to the specified path
  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in:</label>
            <input
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <input
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input
            type="number"
            value={numberOfGuests}
            onChange={(ev) => setNumberOfGuests(ev.target.value)}
          />
        </div>
        {/* Display name and phone fields if number of nights is greater than 0 */}
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
            <label>Phone number:</label>
            <input
              type="tel"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
            />
          </div>
        )}
      </div>
      {/* Button to trigger the booking process */}
      <button onClick={bookLocation} className="primary mt-4">
        Book this place
        {/* Display the total price if number of nights is greater than 0 */}
        {numberOfNights > 0 && (
          // eslint-disable-next-line react/prop-types
          <span> ${numberOfNights * place.price}</span>
        )}
      </button>
    </div>
  );
}
