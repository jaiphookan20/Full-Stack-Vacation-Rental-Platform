import { Route, Routes } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import './App.css'
import LoginPage from './pages/LoginPage'
import Layout from './Layout'
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import PlacesPage from './pages/PlacesPage'
import PlacesFormPage from './pages/PlacesFormPage'
import PlacePage from './pages/PlacePage';
import BookingPage from './pages/BookingPage';
import BookingsPage from './pages/BookingsPage'
import toast, { Toaster } from 'react-hot-toast';


axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL; //sets it as the common base URL for all your requests, simplifying the request URLs throughout your application.
axios.defaults.withCredentials = true; //By setting withCredentials to true, Axios will include any credentials associated with the current origin (domain, protocol, and port) in the cross-origin requests. This is necessary for making authenticated requests or sending cookies along with the requests.
/* Critical: By including withCredentials: true, when a user logs in or registers using the respective forms, Axios will send the requests with the associated credentials, allowing the API server to authenticate the user properly and set any necessary session cookies.
  This way, withCredentials: true ensures that the authentication and session state are maintained across multiple requests within your web application, providing a seamless login and registration experience. */

function App() {
    
  return (
    <UserContextProvider>
        <Toaster />
        <Routes>
          {/* Here index is a prop. The index prop is a special prop in react-router-dom that is used to specify the default route, which is rendered when the URL matches the root URL ("/").
          The element prop of the <Route> component is used to specify the component that should be rendered when the URL matches the defined path. 
          In this case, <IndexPage/> is provided as the element prop, which means that when the URL matches the root URL ("/"), the IndexPage component will be rendered. */}
        <Route path='/' element={<Layout/> }>
            <Route index element={<IndexPage/>} /> {}
            <Route path="/login" element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />}/>
            <Route path='/account/' element={<ProfilePage/>}/>
            <Route path='/account/places/' element={<PlacesPage/>}/>
            <Route path='/account/places/new' element={<PlacesFormPage/>}/>
            <Route path='/account/places/:id' element={<PlacesFormPage/>}/>
            <Route path='/place/:id' element={<PlacePage/>}/>
            <Route path="/account/bookings" element={<BookingsPage />} />
            <Route path="/account/bookings/:id" element={<BookingPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
