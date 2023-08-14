
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Image from '../Image';

const IndexPage = () => {
  
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    
    axios.get('/places').then(response => {
      setPlaces(response.data);
    })
  }, [])
  
  return (
    <div className='mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {places.length > 0 && places.map(place => (
            // eslint-disable-next-line react/jsx-key
            <Link to={'/place/'+ place._id}>
                
                <div className='bg-gray-100 rounded-2xl flex mb-2'>
                  {place.photos?.[0] && (
                    <Image className='rounded-2xl object-cover aspect-square' 
                      src={place.photos?.[0]} />
                  )}
                </div>

                  <h2 className='text-sm truncate leading-4'>{place.title}</h2>
                  <h4 className='font-bold text-sm text-gray-500 mt-1'>{place.address}</h4>
                
                <div className='mt-0.3' >
                  <span className='font-bold text-sm'>${place.price} per night</span>
                </div>

            </Link>
        ))}
    </div>
  )
}

export default IndexPage