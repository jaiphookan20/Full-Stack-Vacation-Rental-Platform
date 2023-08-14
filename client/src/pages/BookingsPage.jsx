import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { differenceInCalendarDays, format } from "date-fns";
import { Link } from "react-router-dom";
import BookingDates from "../BookingDates";

/* 

The BookingsPage component displays a list of bookings made by the user. 
Here's the flow:

The component imports necessary dependencies and components such as AccountNav, 
PlaceImg, BookingDates, etc.

The component sets up a state variable bookings using the useState hook to store 
the bookings data.

The useEffect hook is used to fetch the bookings data from the server when the 
component mounts. It makes a GET request to /bookings and sets the retrieved data 
in the bookings state variable using the setBookings function.

The component renders the UI, which includes the AccountNav component and a list of 
bookings.

For each booking in the bookings array, a Link component from react-router-dom is 
rendered. The link has a URL path based on the booking ID.

Inside the Link component, the booking details are displayed, including the place 
image, place title, booking dates, and total price.

*/


export default function BookingsPage() {
  // State variable to store the bookings data
  const [bookings, setBookings] = useState([]);

  // Fetch bookings data from the server on component mount
  useEffect(() => {
    axios.get('/bookings').then(response => {
      setBookings(response.data);
    });
  }, []);

  return (
    <div>
      <AccountNav />
      <div>
        {/* Display each booking as a link */}
        {bookings?.length > 0 && bookings.map(booking => (
          // eslint-disable-next-line react/jsx-key
          <Link to={`/account/bookings/${booking._id}`} className="flex pl-4 pt-4 pb-1 mb-2 bg-teal-100 rounded-3xl overflow-hidden">
            <div className="w-48 ">
              <PlaceImg place={booking.place} />
            </div>
            <div className="py-3 pr-3 pl-4 grow ml-4">
              <h2 className="text-xl">{booking.place.title}</h2>
              <div className="text-xl">
                {/* Display booking dates */}
                <BookingDates booking={booking} className="mb-2 mt-4 text-gray-500" />
                <div className="flex gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                  {/* Display total price */}
                  <span className="text-2xl">
                    Total price: ${booking.price}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
