import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";

export default function BookingPage() {
  // Get the booking ID from the URL params
  const { id } = useParams();
  
  // State variable to store the booking data
  const [booking, setBooking] = useState(null);

  // Fetch the booking data from the server based on the booking ID
  useEffect(() => {
    if (id) {
      axios.get('/bookings').then(response => {
        // Find the booking object with the matching ID
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  // If booking data is not available, return an empty string
  if (!booking) {
    return '';
  }

  return (
    <div className="my-8">
      {/* Display booking details */}
      <h1 className="text-3xl">{booking.place.title}</h1>
      <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-4">Your booking information:</h2>
          {/* Display booking dates */}
          <BookingDates booking={booking} />
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total price</div>
          <div className="text-3xl">${booking.price}</div>
        </div>
      </div>
      {/* Display place gallery */}
      <PlaceGallery place={booking.place} />
    </div>
  );
}
