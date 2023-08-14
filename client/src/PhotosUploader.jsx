import { useState } from "react";
import axios from 'axios';

// eslint-disable-next-line react/prop-types
export default function PhotosUploader({addedPhotos, onChange}) {
    const [photoLink, setPhotoLink] = useState('');
    
  async function addPhotoByLink(e) {
    e.preventDefault();
    // destructure the response to straight away obtain the response.data ie {data} which we then rename to filename
    const { data: filename } = await axios.post(
      "/upload-by-link",
      { link: photoLink } //request payload
    );
    onChange((prev) => {
      return [...prev, filename]; //returning a new array with the previous photos + the new photo f
    });

    setPhotoLink("");
  }

  function removePhoto(e, filename) {
    e.preventDefault();
    /* When we click the trash icon, we update the array of addedPhotos(state) by 
       filtering out from the entire array any photo which does not match the clicked photo's link/filename
       ie the addedPhotos array will only contain all photos except for the photo with the particular link
    */
    onChange([...addedPhotos.filter(photo => photo !== filename)]); //setAddedPhotos
  }

  function selectAsMainPhoto(e, filename) {
    e.preventDefault();
    
    const addedPhotosWithoutSelected = addedPhotos.filter(photo => photo !== filename);

    const newAddedPhotos = [filename, ...addedPhotosWithoutSelected]; //setting the selected photo on index 0 so that it is displayed, and setting the remaining photos after it

    onChange(newAddedPhotos); //setAddedPhotos
    
  }

  /* uploadPhoto() code explanation: 
    
    It creates a new instance of the FormData object, which allows you to construct a set of key/value pairs 
    representing form fields and their values. In this case, the FormData object is used to prepare the data for 
    sending to the server.

    It loops through the selected files and appends them to the FormData object using data.append('photos', files[i]). 
    This associates each selected file with the key 'photos' in the form data.

    It makes a POST request to the /upload endpoint using axios.post(). The data parameter represents the form 
    data to be sent in the request body. The headers parameter is set to specify that the request contains multipart 
    form data.

    Upon receiving a successful response from the server, the function extracts the filename(s) from the response 
    using destructuring assignment: const { data: filename } = response;.

    It updates the addedPhotos state by appending the new filename(s) to the previous array of filenames using 
    the spread operator: return [...prev, ...filename];. This ensures that the new filename(s) are added to the 
    existing array without losing the previous values.

    Overall, this function allows you to handle the upload of multiple photos by sending them to the server 
    using a POST request with the appropriate form data format. After a successful upload, it updates the 
    state to include the newly uploaded photo filename(s) in the addedPhotos state variable, which 
    can be used to display or manage the uploaded photos in your application.
        
    */

  function uploadPhoto(e) {
    const files = e.target.files;
    console.log({ files });

    /*  Result sample:
            [
                {
                    fieldname: 'photos',
                    originalname: 'Screenshot 2023-04-24 at 9.10.45 AM.png',
                    encoding: '7bit',
                    mimetype: 'image/png',
                    destination: 'uploads',
                    filename: '850bcf27f0aa5553ba673601d8427e15',
                    path: 'uploads/850bcf27f0aa5553ba673601d8427e15',
                    size: 656169
                }
            ]
        */

    const data = new FormData(); //Creates a new instance of the FormData object, which allows you to construct a set of key/value pairs representing form fields and their values. In this case, the FormData object is used to prepare the data for sending to the server.

    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    axios
      .post("/upload", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;

        onChange((prev) => {
          return [...prev, ...filenames];
        });
      });
  }

  return (
    <>
      {/* Photos Section & Add Photo */}
      <div className="flex gap-2">
        
        <input onChange={(e) => setPhotoLink(e.target.value)} value={photoLink} type="text"placeholder={"Add using a link ...jpg"} />
        
        {/* Add Photo by Link */}
        
        <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">
          Add&nbsp;Photo
        </button>
        
      </div>

      {/* Upload Photo */}
      <div className="mt-2 grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-6">
        {/*------------------ MAPPING through Array of addedPhotos to display:----------------- */}
        {addedPhotos.length > 0 && addedPhotos.map((link) => (
            // eslint-disable-next-line react/jsx-key
            <div className="h-32 flex relative" key={link}>
                <img className="rounded-2xl w-full object-cover" 
                    src={"http://localhost:4000/uploads/" + link}>    
                </img>
                {/* To Delete a Chosen Photo */}
                <button onClick={(e)=> removePhoto(e, link)} className="cursor-pointer absolute bottom-2 right-2 text-white bg-gray-500 rounded-xl p-0.5 bg-opacity-70">
                    {/* Trash Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </button>
                {/* To Select as Main Photo */}
                <button onClick={(e)=> selectAsMainPhoto(e,link)} className="cursor-pointer absolute bottom-2 left-2 text-white bg-gray-500 rounded-xl p-0.5 bg-opacity-70">
                    {/* Star Icon */}
                    {link === addedPhotos[0] && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>                    
                    )}
                    {link !== addedPhotos[0] && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>                    
                    )}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                </button>
            </div>
          ))}

        <label className="cursor-pointer h-32 flex items-center justify-center gap-1 border bg-transparent rounded-2xl p-6 text-2xl text-gray-600 mt-2">
            <input type="file" className="hidden" 
            onClick={() => console.log("Input file clicked!")} multiple onChange={uploadPhoto}
            />
          {/* Input Photo File */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
          </svg>
          Upload
        </label>
      </div>
    </>
  );
}
