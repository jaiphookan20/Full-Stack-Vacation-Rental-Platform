import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

/* SUMMARY: 

Represents a page for displaying information about a specific place. 

Here's an explanation of the code:

The component uses the useParams hook from the react-router-dom package to extract 
the id parameter from the URL. This allows us to identify the specific place to display.

The component sets up a state variable place using the useState hook. Initially, 
the value is set to null.

The useEffect hook is used to fetch the place data from the server when the component 
mounts or when the id parameter changes. It makes an HTTP GET request to /places/{id} 
endpoint to retrieve the place data based on the provided id. The response data is 
then set in the place state variable using setPlace.

The component conditionally renders the content based on the availability of the 
place data. If the place is still null, it returns null to display nothing.

If the place data is available, the component renders the following sections:

Place title and address displayed with appropriate styling.
PlaceGallery component to display images of the place.
Description, check-in/out details, and maximum number of guests displayed.
BookingWidget component to allow users to book the place.
Extra info section with additional details about the place.

*/


export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    // Fetch the place data from the server based on the provided ID
    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id]);

  // If the place data is not yet available, display nothing
  if (!place) return null;

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>
      <PlaceGallery place={place} />

      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            {place.description}
          </div>
          Check-in: {place.checkIn}<br />
          Check-out: {place.checkOut}<br />
          Max number of guests: {place.maxGuests}
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>

      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
          {place.extraInfo}
        </div>
      </div>
    </div>
  );
}

