const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');

require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(cors({
  credentials: true,
  origin: 'http://127.0.0.1:5173',
}));

mongoose.connect(process.env.MONGO_URL);

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.get('/test', (req,res) => {
  res.json('test ok');
});

app.post('/register', async (req,res) => {
  const {name,email,password} = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password:bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }

});

app.post('/login', async (req,res) => {
  const {email,password} = req.body;
  const userDoc = await User.findOne({email});
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email:userDoc.email,
        id:userDoc._id
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
});

app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name,email,_id} = await User.findById(userData.id);
      res.json({name,email,_id});
    });
  } else {
    res.json(null);
  }
});

app.post('/logout', (req,res) => {
  res.cookie('token', '').json(true);
});


app.post('/upload-by-link', async (req,res) => {
  const {link} = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    url: link,
    dest: __dirname + '/uploads/' +newName,
  });
  res.json(newName);
});

const photosMiddleware = multer({dest:'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 100), (req,res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const {path,originalname} = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace('uploads/',''));
  }
  res.json(uploadedFiles);
});

app.post('/places', (req,res) => {
  const {token} = req.cookies;
  const {
    title,address,addedPhotos,description,price,
    perks,extraInfo,checkIn,checkOut,maxGuests,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner:userData.id,price,
      title,address,photos:addedPhotos,description,
      perks,extraInfo,checkIn,checkOut,maxGuests,
    });
    res.json(placeDoc);
  });
});

app.get('/user-places', (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id} = userData;
    res.json( await Place.find({owner:id}) );
  });
});

app.get('/places/:id', async (req,res) => {
  const {id} = req.params;
  res.json(await Place.findById(id));
});

app.put('/places', async (req,res) => {
  const {token} = req.cookies;
  const {
    id, title,address,addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

app.get('/places', async (req,res) => {
  res.json( await Place.find() );
});

app.post('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const {
    place,checkIn,checkOut,numberOfGuests,name,phone,price,
  } = req.body;
  Booking.create({
    place,checkIn,checkOut,numberOfGuests,name,phone,price,
    user:userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});



app.get('/bookings', async (req,res) => {
  const userData = await getUserDataFromReq(req);
  res.json( await Booking.find({user:userData.id}).populate('place') );
});

app.listen(4000);


// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();
// const User = require('./models/User');
// const cookieParser = require('cookie-parser');
// const imageDownLoader = require('image-downloader');
// const multer = require('multer');
// const fs = require('fs');
// const Place = require('./models/Place');
// const Booking = require('./models/Booking');

// const app = express();
// const bcryptSalt = bcrypt.genSaltSync(10);
// const jwtSecret = 'fasfasfagasgwgawga';

// app.use(express.json());
// app.use(cookieParser());
// app.use('/uploads', express.static(__dirname + '/uploads'));

// /* CHECK BOTTOM OF PAGE FOR MY HANDWRITTEN COMMENTS & CONTEXT REGARDING THE CODE! */

// /* CORS middleware */
// app.use(
//   cors({
//     credentials: true,
//     origin: 'http://127.0.0.1:5173',
//   })
// );

// /* 
//   The above code adds middleware functions to the Express application.

//   - cors: Cross-Origin Resource Sharing (CORS) middleware. It enables Cross-Origin requests, allowing requests from different origins.
//   - cookieParser: Middleware that parses cookies attached to the client's requests and makes them accessible in the req.cookies object.
//   - express.json: Middleware that parses JSON data in the request body and makes it accessible in the req.body object.
//   - express.static: Middleware that serves static files, such as images, from the specified directory.

//   These middleware functions are essential for handling HTTP requests and enabling communication between the client and server.
// */

// mongoose.connect(process.env.MONGO_URL);

// /* 
//   The above code establishes a connection to the MongoDB database using the MONGO_URL from the environment variables.
//   The connection is essential for interacting with the database and performing CRUD operations on the defined models.
// */

// app.get('/test', (req, res) => {
//   res.json('test ok');
//   console.log('Test working');
// });

// /* 
//   A simple test route to verify that the server is running and accessible.
//   When a GET request is made to '/test', the server responds with the JSON string 'test ok'.
//   This route is useful for checking the server's availability during development or debugging.
// */

// app.post('/register', async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const userDoc = await User.create({
//       name,
//       email,
//       password: bcrypt.hashSync(password, bcryptSalt),
//     });

//     res.json(userDoc);
//   } catch (e) {
//     res.status(422).json(e);
//   }
// });

// /* 
//   The above code handles the POST request to the '/register' endpoint.
//   It expects the name, email, and password data in the request body.
//   Upon receiving the request, it creates a new user document in the database using the User model.
//   The password is hashed using bcrypt before being stored in the document.
//   If the registration is successful, the created user document is sent as a JSON response.
//   If there's an error, the server responds with a 422 status code and the error object.
// */

// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   const userDoc = await User.findOne({ email: email });

//   if (userDoc != null) {
//     const passOk = bcrypt.compareSync(password, userDoc.password);

//     if (passOk) {
//       jwt.sign(
//         {
//           email: userDoc.email,
//           id: userDoc._id,
//         },
//         jwtSecret,
//         {},
//         (err, token) => {
//           if (err) throw err;
//           res.cookie('token', token).json(userDoc);
//         }
//       );
//     } else {
//       res.status(422).json('Incorrect password');
//     }
//   } else {
//     res.json('not found');
//   }
// });

// /* 
//   The above code handles the POST request to the '/login' endpoint.
//   It expects the email and password in the request body.
//   Upon receiving the request, it finds the user document in the database based on the provided email using the User model.
//   If a user document is found, it compares the provided password with the hashed password stored in the document using bcrypt.
//   If the password matches, a JSON Web Token (JWT) is generated using jwt.sign().
//   The token is then set as a cookie named 'token' in the response using res.cookie().
//   The server also responds with a JSON message indicating a successful login.
//   If the password is incorrect or the user document is not found, appropriate responses are sent.
// */

// app.get('/profile', (request, response) => {
//   const { token } = request.cookies;

//   if (token) {
//     jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//       if (err) throw err;

//       const { name, email, _id } = await User.findById(userData.id);
//       response.json({ name, email, _id });
//     });
//   } else {
//     response.json(null);
//   }
// });

// /* 
//   The above code handles the GET request to the '/profile' endpoint.
//   It expects a cookie named 'token' to be present in the request.
//   If the token is present, it is verified using jwt.verify() with the jwtSecret.
//   Upon successful verification, the user data is fetched from the User model using the user ID from the decoded token.
//   The relevant user data, such as name, email, and _id, is extracted from the fetched user document and sent as a JSON response.
//   If the token is not present, the response is null.
// */

// app.post('/logout', (request, response) => {
//   response.cookie('token', '').json(true);
// });

// /* 
//   The above code handles the POST request to the '/logout' endpoint.
//   It sets the cookie named 'token' to an empty string, effectively logging the user out.
//   The response is a JSON boolean value indicating a successful logout.
// */

// app.post('/upload-by-link', async (req, res) => {
//   const { link } = req.body;
//   const newName = 'photo' + Date.now() + '.jpg';

//   await imageDownLoader.image({
//     url: link,
//     dest: __dirname + '/uploads/' + newName,
//   });

//   res.json(newName);
// });

// /* 
//   The above code handles the POST request to the '/upload-by-link' endpoint.
//   It expects the link to an image file in the request body.
//   Using the image-downloader library, the code downloads the image from the provided link and saves it in the 'uploads' directory.
//   A new name is generated for the image file to avoid conflicts.
//   The new name is sent as a JSON response.
// */

// const photosMiddleware = multer({ dest: 'uploads' });
// app.post('/upload', photosMiddleware.array('photos', 100), (request, response) => {
//   const uploadedFiles = [];

//   for (let i = 0; i < request.files.length; i++) {
//     const { path, originalname } = request.files[i];
//     const parts = originalname.split('.');
//     const ext = parts[parts.length - 1];
//     const newPath = path + '.' + ext;
//     fs.renameSync(path, newPath);
//     uploadedFiles.push(newPath.replace('uploads/', ''));
//   }

//   response.json(uploadedFiles);
// });

// /* 
//   The above code handles the POST request to the '/upload' endpoint.
//   It uses the multer middleware to process multiple files uploaded under the field name 'photos'.
//   The uploaded files are accessible in the request.files array.
//   The code iterates over each file, renames it with a file extension, and stores the new file path in the uploadedFiles array.
//   Finally, the server responds with the uploadedFiles array as a JSON response.
// */

// app.post('/places', (request, response) => {
//   const { token } = request.cookies;
//   const {
//     title,
//     address,
//     addedPhotos,
//     description,
//     perks,
//     extraInfo,
//     checkIn,
//     checkOut,
//     maxGuests,
//     price,
//   } = request.body;

//   jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//     if (err) throw err;

//     const placeDoc = await Place.create({
//       owner: userData.id,
//       title: title,
//       address: address,
//       photos: addedPhotos,
//       description: description,
//       perks: perks,
//       extraInfo: extraInfo,
//       checkIn: checkIn,
//       checkOut: checkOut,
//       maxGuests: maxGuests,
//       price: price,
//     });

//     response.json(placeDoc);
//   });
// });

// /* 
//   The above code handles the POST request to the '/places' endpoint.
//   It expects the place-related data in the request body, including title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, and price.
//   The code verifies the JWT token from the cookie using jwt.verify().
//   If the token is valid, it creates a new place document in the database using the Place model.
//   The owner of the place is set to the user's ID from the decoded token, and other properties are set based on the request body data.
//   The created place document is sent as a JSON response.
// */

// app.get('/places', async (request, response) => {
//   const { token } = request.cookies;

//   jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//     const { id } = userData;
//     response.json(await Place.find({ owner: id }));
//   });
// });

// app.get('/places', async (request, response) => {
//   const { token } = request.cookies;

//   jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//     if (err) {
//       console.error('JWT verification failed:', err);
//       return response.status(401).json({ error: 'Unauthorized' });
//     }

//     if (!userData || !userData.id) {
//       console.error('User data or user ID not found in decoded token');
//       return response.status(500).json({ error: 'Internal Server Error' });
//     }

//     const { id } = userData;
//     response.json(await Place.find({ owner: id }));
//   });
// });


// /* 
//   The above code handles the GET request to the '/places' endpoint.
//   It expects a valid JWT token from the cookie.
//   The code verifies the token and extracts the user's ID from the decoded token.
//   It then fetches all place documents from the database that belong to the user (owner) with the specified ID.
//   The fetched place documents are sent as a JSON response.
// */

// app.get('/places/:id', async (request, response) => {
//   const { id } = request.params;

//   const place = await Place.findById(id);
//   response.json(place);
// });

// /* 
//   The above code handles the GET request to the '/places/:id' endpoint.
//   It expects the place ID as a parameter in the request URL.
//   The code fetches the place document from the database based on the provided ID using the Place model.
//   The fetched place document is sent as a JSON response.
// */

// app.put('/places', async (req, res) => {
//   const { token } = req.cookies;
//   const {
//     id,
//     title,
//     address,
//     addedPhotos,
//     description,
//     perks,
//     extraInfo,
//     checkIn,
//     checkOut,
//     maxGuests,
//     price,
//   } = req.body;

//   jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//     if (err) throw err;
//     const placeDoc = await Place.findById(id);

//     if (userData.id === placeDoc.owner.toString()) {
//       placeDoc.set({
//         title,
//         address,
//         photos: addedPhotos,
//         description,
//         perks,
//         extraInfo,
//         checkIn,
//         checkOut,
//         maxGuests,
//         price,
//       });

//       await placeDoc.save();
//       res.json(placeDoc);
//     }
//   });
// });

// /* 
//   The above code handles the PUT request to the '/places' endpoint.
//   It expects the place-related data in the request body, including the place ID, title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, and price.
//   The code verifies the JWT token from the cookie using jwt.verify().
//   If the token is valid and the user ID matches the owner ID of the place, the code updates the place document with the new data.
//   The updated place document is sent as a JSON response.
// */

// function getUserDataFromReq(req) {
//     return new Promise((resolve, reject) => {
//       jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
//         if (err) throw err;
//         resolve(userData);
//       });
//     });
//   }

// app.get('/bookings', async (req, res) => {
  
//   const userData = await getUserDataFromReq(req);
//   res.json(await Booking.find({ user: userData.id }).populate('place'));
// });

// app.post('/bookings', async (req, res) => {
//   const userData = await getUserDataFromReq(req);
//   const {
//     place,
//     checkIn,
//     checkOut,
//     numberOfGuests,
//     name,
//     phone,
//     price,
//   } = req.body;

//   Booking.create({
//     place,
//     checkIn,
//     checkOut,
//     numberOfGuests,
//     name,
//     phone,
//     price,
//     user: userData.id,
//   })
//     .then((doc) => {
//       res.json(doc);
//     })
//     .catch((err) => {
//       throw err;
//     });
// });

// /* 
//   The above code handles the GET and POST requests to the '/bookings' endpoint.
//   - GET: It fetches all booking documents from the database that belong to the authenticated user.
//   - POST: It creates a new booking document in the database with the provided data, including the place, check-in/out dates, number of guests, user details, and price.
//   The booking document is associated with the authenticated user using their user ID.
//   The created/queried booking documents are sent as a JSON response.
// */

// if (process.env.API_PORT) {
//   app.listen(process.env.API_PORT);
// }

// module.exports = app;





//CHECK BELOW FOR HANDWRITTEN COMMENTS PROVIDED FOR MORE CONTEXT:


// const express = require('express');
// const cors = require('cors'); //enables Cross-Origin Resource Sharing (CORS) for allowing requests from different origins.
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();
// const User = require('./models/User');
// const cookieParser = require('cookie-parser');
// const imageDownLoader = require('image-downloader');
// const multer = require('multer');
// const fs = require('fs');
// const Place = require('./models/Place');
// const Booking = require('./models/Booking');

// const app = express();
// const bcryptSalt = bcrypt.genSaltSync(10);
// const jwtSecret = 'fasfasfagasgwgawga'; //jwtSecret is a secret key used for signing JSON Web Tokens (JWTs). 


// app.use(express.json()); // The server uses express.json() middleware to parse JSON data in the request body.
// app.use(cookieParser()); // express cannot read obtained cookies ordinarily without using this middleware
// app.use('/uploads', express.static(__dirname+'/uploads')); //middleware for when we hit the '/uploads' route

// /*line 17-20 explanation: 
// 1. The app.use function is used to add middleware (functions that can process requests and perform additional operations before they reach the route handlers) to the Express application.

// 2. In this case, the cors middleware is added with specific configurations. For security reasons, web browsers restrict cross-origin requests by default. 
// This means that if your web application is running on one origin (e.g., http://example.com), it is generally 
// not allowed to make requests to another origin (e.g., http://api.example.com) unless the server explicitly allows it.

// 3. The credentials option is set to true to allow including credentials (e.g., cookies) in  cross-origin requests. This is useful when you want to make authenticated requests from one origin to another.

// 4. The origin option is set to 'http://127.0.0.1:5173/' to specify the allowed origin for requests. This means that requests originating from the URL 'http://127.0.0.1:5173/' are allowed to access the server's resources.

// 5. NOTE: Without adding 'yarn add cors' and adding this cors middleware, when we earlier trying to submit the registration form with the values, we were getting a CORS error, that's why
// */
// app.use(cors({
//     credentials: true,
//     origin: 'http://127.0.0.1:5173',
// }));

// /* Example of using Cors() & why we need to use it: 
// 1. Let's say you have a web application running on http://example.com, and you also have a server running on http://api.example.com. 
// Your web application needs to make authenticated requests to the server to access certain resources or perform specific actions.

// 2. However, due to the security restrictions imposed by the browser, by default, your web application is 
// not allowed to make requests to a different origin (in this case, http://api.example.com). This is known as the same-origin policy.

// 3. To overcome this restriction and enable authenticated requests from your web application to the server, you can use 
// CORS with the credentials: true configuration.

// 4. By setting credentials: true in the CORS configuration, your web application can include credentials such as cookies in 
// the cross-origin requests. This is important for authentication purposes because it allows the server to verify the identity of the user 
// making the request and provide access to protected resources.

// 5. So, in this example, by using CORS with credentials: true, your web application running on http://example.com 
// can successfully make authenticated requests to the server running on http://api.example.com. 
// This ensures that only authorized users can access the server's resources and perform actions that require authentication. 

// */

// //add your connection string from mongodb
// mongoose.connect(process.env.MONGO_URL);

// /*  It sets up a server that listens on port 4000 and defines a route for handling GET requests to the '/test' endpoint. 
//     When a GET request is made to '/test', the provided callback function is executed. */
// app.get('/test', (req, res) => {
//     res.json('test ok');
// });

// /* Explanation of the POST method below & how it connects to RegisterPage:
// The server defines two routes:
// A GET route for the /test endpoint, which responds with the JSON string 'test ok' when accessed.
// A POST route for the /register endpoint, which expects the name, email, and password data in the request body. 
// It responds with the received data as a JSON object.

// Connection Explanation: 

// 1. So, when the user submits the registration form in the frontend (RegisterPage), 
// it triggers the registerUser function, which sends an HTTP POST request to 
// the /register endpoint of the backend server. 

// 2. The server then receives the request, processes the data, and 
// responds with the received data as a JSON object.

// What happens if the 3 values expected by the post method are not provided in the request body in axios on register page?
// -> In the provided backend code, when the server receives a POST request to the /register endpoint, it expects the request body to contain name, email, and password fields. The server code attempts to destructure these fields from the request body using {name, email, password} = req.body;.
//    If any of these fields are missing or not provided in the request body, the values assigned to name, email, or password on the server side would be undefined. In the subsequent response, the server would still send a JSON object containing these fields with the respective values of undefined

// */
// app.post('/register', async (req, res) => {
//     const {name, email, password} = req.body;

//     try {
//         const userDoc = await User.create({ //async func so we need to use await. 
//             name,
//             email,
//             password: bcrypt.hashSync(password, bcryptSalt)
//         })
    
//         res.json(userDoc); //returns the received data as a response (as a JSON object)    
//     }

//     catch(e) {
//         res.status(422).json(e); //ie Unprocessable Content eg if email is duplicate
//     }
    
// });

// app.post('/login', async (req, res) => {
//     const {email, password} = req.body; //The route handler function receives the email and password from the request body.
//     const userDoc = await User.findOne({email: email}); //The code attempts to find a user document in the database (assuming a User model is defined elsewhere) based on the provided email using User.findOne({ email: email }).

//     if(userDoc != null) {
        
//         const passOk = bcrypt.compareSync(password, userDoc.password);
        
//         /* when password is correct, we want to loginuser &  create a json web token (JWT) and
//         respond with a cookie and encrypted username */
//         if(passOk) {
//             /* Synchronously sign the given payload into a JSON Web Token string payload */
//             jwt.sign({                /* function sign(1. payload: string/object/Buffer, 2. secretOrPrivateKey: jwt.Secret, 3. options: jwt.SignOptions, 4. callback: jwt.SignCallback) */
//                 email: userDoc.email,
//                 id: userDoc._id,
//                 /* {name: userDoc.name} */
//             }, jwtSecret, {}, (err, token) => {
//                 if(err) throw err;
//                 res.cookie('token', token).json(userDoc);    /* If password is correct - a json response is shown & a cookie is created under the Set-Cookie section under the Headers tab in Network*/
//             });

//             /* jwt.sign explanation: 
               
//                 If a user document is found, the code compares the provided password with the hashed password stored in the user document using bcrypt.compareSync(password, userDoc.password). If the password matches, the code proceeds to create a JSON Web Token (JWT) using the jwt.sign() function.
//                 The JWT payload contains the email and id of the user.
//                 The jwt.sign() function signs the payload using the jwtSecret and generates a token.
//                 If the token is successfully generated, it is set as a cookie named 'token' in the response using res.cookie('token', token).
//                 The response also includes a JSON message 'Password OK' indicating a successful login.
//             */
            
//         } else {
//             res.status(422).json('Incorrect password')
//         }

//     } else {
//         res.json('not found');
//     }
// })

// /*An endpoint at /profile is defined to handle requests for user profile data. */
// app.get('/profile', (request, response) => {
//     // mongoose.connect(process.env.MONGO_URL);
//     const {token} = request.cookies; /*This endpoint expects a cookie named token to be present in the request.*/

//     /* If we have token, we use JWT to verify the token */
//     if(token) {
//         /* If the token is present, it is verified using jwt.verify() with the jwtSecret. Upon successful verification, the user data is fetched from the User model using the user ID from the userData object.*/
//         /* if it has been verified by JWT to have the correct token and no error throw, respond with user data -> this information - jwt.sign( email: userDoc.email, id: userDoc._id )*/
//         jwt.verify(token, jwtSecret, {}, async (err, userData)=> {
//             if(err) throw err;
            
//             // const userData = await User.findById(userData.id); // this way we get all user data including password which we don't want so we want to destructure the response to only get the data we need 
//             const {name, email, _id} = await User.findById(userData.id); //The relevant user data, such as name, email, and _id, is extracted from the fetched user document and sent as a JSON response.
//             response.json({name, email, _id}); 
//         })
//     }
//     else {
//         response.json(null);
//     }
// })


// /* When the logout route is hit (when logout button is clicked in AccountPage) -> we set the cookie NOT to the signed ie authenticated token but to AN EMPTY STRING. 
//    This way
// */
// app.post('/logout', (request, response) => {
//     response.cookie('token', '').json(true)
// })

// app.post('/upload-by-link', async (req, res) => {
//     const {link} = req.body; 
    
//     /* using yarn library 'image-downloader' to download image files*/
//     const newName = 'photo' + Date.now() + '.jpg';
//     await imageDownLoader.image({
//         url: link,
//         dest: __dirname+'/uploads/'+newName, //we should be able to see all the uploaded photos stored here
//     })

//     res.json(newName);
// })

// const photosMiddleware = multer({dest: 'uploads'})
// app.post('/upload', photosMiddleware.array('photos', 100), (request, response) => { //photosMiddleware.array('photos', 100) -> Returns middleware that processes multiple files sharing the same field name.
//     const uploadedFiles = [];
//     /* Explanation of this logic between 3hr 22 mins*/ 
//     for (let i = 0; i < request.files.length; i++) {
//         const {path, originalname} = request.files[i]; //path & originalname are attributes which are present inside the response, which we destructure
//         const parts = originalname.split('.');
//         const ext = parts[parts.length - 1];
//         const newPath = path + '.' + ext;
//         fs.renameSync(path, newPath) //rename the path of the file
//         uploadedFiles.push(newPath.replace('uploads/',''));    
//     }

//     response.json(uploadedFiles);
// });

// /* Explanation of the 'app.post('/places', (request, response) POST endpoint:

// This endpoint is used to create a new Place in the database.

// Here's a step-by-step breakdown:

// The function first retrieves the JWT token from the client's cookies, and it also 
// extracts the place-related data from the request body. 
// The place-related data includes title, address, addedPhotos, description, perks, 
// extraInfo, checkIn, checkOut, and maxGuests. This data is coming from the 
// PlacesPage component form.

// Next, the JWT token is verified using the jwt.verify method. This method checks 
// if the JWT token was signed with the correct secret (jwtSecret). If the token is 
// not valid, an error will be thrown.

// If the token is valid, the function retrieves the user's data (userData) from 
// the decoded JWT token.

// Then, the function attempts to create a new place document in the MongoDB 
// database using the Place model's create method. It sets the owner of the place 
// to be the user's id (userData.id), and it sets the other properties of the 
// place using the data from the request body.

// Finally, the newly created place document is sent back to the client in the 
// HTTP response.

// */

// app.post('/places', (request, response) => {
    
//     const {token} = request.cookies;
//     /* Extracts the place-related data from the request body, which has been sent by the addNewPlace form */
//     const {title, address, addedPhotos, 
//            description, perks, extraInfo,
//            checkIn, checkOut, maxGuests, price
//            } = request.body;
    
//     jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//         if(err) throw err;
//         // Creates and returns a new place document from the db
//         const placeDoc = await Place.create({
//             owner: userData.id, //sets the owner of the place to be the user's id (userData.id)
//             title: title, 
//             address: address,
//             photos: addedPhotos,   
//             description: description, 
//             perks: perks, 
//             extraInfo: extraInfo,
//             checkIn: checkIn, 
//             checkOut: checkOut, 
//             maxGuests: maxGuests,
//             price: price
//         })

//         response.json(placeDoc);
//     })
    
// })

// app.get('/places', (request, response) => {

//     /* in order to extract all the places, we need to first grab the userId */

//     const {token} = request.cookies;

//     /* Extract the userId to identify the owner by first extracting the cookie and decrypting it
//     and then sending it back to the client to use it */
//     jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//         const {id} = userData;

//         response.json(await Place.find({owner:id}) );
//     });
// });

// app.get('/places/:id', async (request, response) => {
//     const {id} = request.params;
    
//     const place = await Place.findById(id);
//     response.json(place);
// })

// /* when we get the placeDoc, we want to certify that in the placeDoc, 
//        the owner of the placeDoc is the same as that which has the id inside the {token}
//     */
// app.put('/places', async (req,res) => {
//     const {token} = req.cookies;
//     const {
//       id, title,address,addedPhotos,description,
//       perks,extraInfo,checkIn,checkOut,maxGuests,price
//     } = req.body;

//     jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//       if (err) throw err;
//       const placeDoc = await Place.findById(id);
//       /* then we can update*/
//       if (userData.id === placeDoc.owner.toString()) {
//         placeDoc.set({
//           title,address,photos:addedPhotos,description,
//           perks,extraInfo,checkIn,checkOut,maxGuests,price
//         }); //note we don't want to update the owner, just the other attributes
//         await placeDoc.save();
//         res.json(placeDoc);
//       }
//     });
//   });

// /* Explanation of const photosMiddleware = multer({dest: 'uploads'}) & app.post('/upload', photosMiddleware.array('photos', 100), (req, res) =>...... (V IMPORTANT):

// 1. First, an instance of multer is created by specifying the destination folder where the uploaded files will be stored. 
// In this case, the destination folder is set to 'uploads'.

// 2. The photosMiddleware instance is then used as middleware in the /upload route handler to process multiple files sharing 
// the same field name 'photos'.

// 3. When a POST request is made to the /upload endpoint with files attached, photosMiddleware.array('photos', 100) 
// processes the uploaded files and makes them accessible in the request.files array.

// 4. The code then iterates over each file in request.files using a for loop. For each file, it extracts the path and 
// originalname properties.

// 5. It splits the originalname by the dot ('.') to get the file extension (ext).

// 6. It generates a new path by appending the file extension to the original path (newPath).

// 7. The fs.renameSync() function is used to rename the file's path to the new path. 
// This is done to include the file extension in the file name.

// 8. The newPath is modified to remove the 'uploads/' prefix, and the file name is pushed to the uploadedFiles array.

// 9. Finally, the server responds with the uploadedFiles array as a JSON response.

// Connection with PlacesPage component:
// The PlacesPage component in your codebase utilizes this /upload endpoint to handle file uploads. 
// When the user selects or adds photos in the PlacesPage component, the uploadPhoto function is called, 
// which sends a POST request to the /upload endpoint with the selected files. The server receives the files, 
// processes them using multer, and returns the file names as a JSON response. 

// The file names are then stored in the addedPhotos state in the PlacesPage component 
// and can be used to display or manage the uploaded photos.

// */

// /* Returns all Place documents in the db */
// app.get('/places', async (req, res) => {
//     res.json(await Place.find());
// })

// function getUserDataFromReq(req) {
//     return new Promise((resolve, reject) => {
//       jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
//         if (err) throw err;
//         resolve(userData);
//       });
//     });
//   }

// app.post('/bookings', async (req, res) => { 
//     const userData = await getUserDataFromReq(req);
//     const {
//       place,checkIn,checkOut,numberOfGuests,name,phone,price,
//     } = req.body;
//     Booking.create({
//       place,checkIn,checkOut,numberOfGuests,name,phone,price,
//       user:userData.id,
//     }).then((doc) => {
//       res.json(doc);
//     }).catch((err) => {
//       throw err;
//     });
//   });

  
//   app.get('/bookings', async (req,res) => {
//     const userData = await getUserDataFromReq(req);
//     res.json( await Booking.find({user:userData.id}).populate('place') );
//   });
  


// if(process.env.API_PORT) {
//     app.listen(process.env.API_PORT); 
// }

// module.exports = app;

// //listening on port 4000
// /* Cookie Authentication Process: IMPORTANT

// In a typical authentication scenario, cookies are not created for a session before a user is logged in. 
// Session cookies are typically generated and associated with a user's session only after successful authentication.

// Here's an overview of the typical authentication process and the role of cookies:

// 1. User visits the website: When a user visits a website, no session cookies are set yet. 
// The user is considered anonymous until they log in.

// 2. User provides login credentials: The user enters their login credentials (e.g., email and password) on the login page.

// 3. Server verifies credentials: The server receives the login credentials and verifies them against the stored user data 
// (e.g., in a database). If the credentials are correct, the server generates a session token or identifier for that user.

// 4. Set session cookie: Upon successful verification, the server sends a response to the client (browser) that includes a 
// session cookie. This session cookie is typically stored by the client and sent automatically with subsequent requests to the server.

// 5. Subsequent requests: For all subsequent requests from the client (after logging in), the session cookie is automatically included 
// in the request headers. This allows the server to identify the user's session and maintain their authenticated state.

// 6. Session persistence: The server can use the session token from the session cookie to keep track of the user's session 
// and associate it with their data (e.g., user profile, permissions, etc.).

// So, to answer your question, cookies are generally not created for a session before a user logs in. They are typically set and 
// associated with a user's session only after successful authentication. Once the user logs in, the same session cookie 
// (with the same identifier) is typically used to maintain the authenticated state throughout the user's session.

// */