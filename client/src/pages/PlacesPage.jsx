import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "../Image.jsx";

const PlacesPage = () => {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        axios.get('/places')
            .then(({data}) => {setPlaces(data)});
    }, [])

    return (
      <div>
        <AccountNav />
        <div className="text-center">
          <br />
          <Link
            to="/account/places/new"
            className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>

            Add New Place

          </Link>
        </div>
        <div className="mt-4 gap-4">
            {places.length > 0 && places.map(place => (
                <Link to={'/account/places/' + place._id} className="flex cursor-pointer gap-4 bg-gray-100 bg-opacity-70 mb-3 p-4 rounded-3xl shadow-lg  " key={place._id} >
                    <div className="flex w-32 h-32 bg-gray-200 grow shrink-0">
                        {place.photos.length > 0 && (
                            <Image className="object-cover" src={'http://localhost:4000/uploads/'+ place.photos[0]} alt="" /> 
                        )} 
                        {/* if any photos added ie photos.length > 0, then display image. Also we are just posting the first photo of a place thats been added  */}
                    </div>
                    <div className="grow-0 shrink">
                        <h2 className="text-xl">{place.title}</h2>
                        <p className="text-sm mt-2">{place.description}</p>
                    </div>
                </Link>
            ))}
        </div>
      </div>
    );
}

export default PlacesPage
