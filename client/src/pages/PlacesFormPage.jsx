import { useEffect, useState } from "react";
import Perks from "./Perks";
import PhotosUploader from "../PhotosUploader";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import AccountNav from "../AccountNav";

export default function PlacesFormPage() {
    // const {action} = useParams();
    const {id} = useParams();

    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]); 
    const [perks, setPerks] = useState('');
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [price, setPrice] = useState(100);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if(!id) {
            return; 
        }
        
        axios.get('/places/' + id)
             .then(response => {
                const {data} = response;
                setTitle(data.title);
                setAddress(data.address);
                setAddedPhotos(data.photos);
                setDescription(data.description);
                setPerks(data.perks);
                setExtraInfo(data.extraInfo);
                setCheckIn(data.checkIn);
                setCheckOut(data.checkOut);
                setMaxGuests(data.maxGuests);
                setPrice(data.price);
             })
    }, [id]);

    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        )
    }

    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        )
    }

    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        )
    }


    async function savePlace(ev) {
        ev.preventDefault();
        
        const placeData = {
          title, address, addedPhotos,
          description, perks, extraInfo,
          checkIn, checkOut, maxGuests, price
        };

        /* This func can both save a new place or update a saved place. 
           How do we determine it ? if id exists and is not null, we are updating a place
           otherwise
           we are saving a new place
        */
        if (id) {
          // update
          await axios.put('/places', {
            id, ...placeData
          });
          setRedirect(true);
        } else {
          // new place
          await axios.post('/places', placeData);
          setRedirect(true);
        }
    
      }
    

    if(redirect) { //if redirect == true (ie after submitting the places form, navigate to 'account/places')
        return <Navigate to={'/account/places'} />
    }

    return (
        <div>
            <AccountNav />
            <form onSubmit={savePlace}>
                {/* Title, Address & Photos */}
                {preInput('Title', 'Title for your place should be short & catchy')}
                <input  onChange={e=> setTitle(e.target.value)} value={title} type="text" placeholder="Title, for example: My lovely apartment"/>
                
                {preInput('Address', 'Address to this place')}
                <input onChange={e=> setAddress(e.target.value)} value={address} className="text-gray-500 text-sm" type="text" placeholder="Address"/>
                
                {preInput('Photos', 'more photos = better')}
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
                
                {/* Description */}
                {preInput('Description', 'Description of the place')}
                <textarea value={description} onChange={e=>setDescription(e.target.value)} />
                
                {/* Perks */}
                {preInput('Perks', 'Select all the perks available at your place')}
                <div>
                    <Perks selected={perks} onChange={setPerks} />
                    
                    {/* Extra Info */}
                    {preInput('Extra Info', 'House rules, etc')}
                    <textarea value={extraInfo} onChange={e=>setExtraInfo(e.target.value)} />
                    
                    {/* Check-In, Check-Out, and Max Num of Guests */}
                    {preInput('Check in & out times, remember to have some time window to clean the room between guests', 'Add Check in & Out times')}                        
                    <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                        <div>
                            <h3  className="mt-2 mb-0.5">Check in time</h3>
                            <input type="text" value={checkIn} onChange={e => setCheckIn(e.target.value)} placeholder="14:00"/>
                        </div>
                        <div>
                            <h3 className="mt-2 mb-0.5">Check out time</h3>
                            <input value={checkOut} onChange={e => setCheckOut(e.target.value)} type="text" placeholder="11:00"/>
                        </div>
                        <div>
                            <h3 className="mt-2 mb-0.5">Max Number of Guests</h3>
                            <input value={maxGuests} onChange={e => setMaxGuests(e.target.value)} type="number" placeholder="1" />
                        </div>
                        <div>
                            <h3 className="mt-2 mb-0.5">Price Per Night</h3>
                            <input value={price} onChange={e => setPrice(e.target.value)} type="number" placeholder="1" />
                        </div>
                    </div>
                    <button className="primary my-4" >Save</button>
                </div>
            </form>
        </div>
    )
}