import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

/** import all components */
import Username from './components/Username/Username';
import Password from './components/Password/Password';
import OTPVerification from './components/OTPVerification/OTPVerification';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Register from './components/Register/Register';
import Profile from './components/Profile/Profile';
import PageNotFound from './components/PageNotFound/PageNotFound';


/** auth middleware */
import { AuthorizeUser, ProtectRoute } from './middleware/auth'

/** Root Routes */
const router = createBrowserRouter([
  {
    path : '/',
    element : <Username />
  },
  {
    path : '/password',
    element : <ProtectRoute><Password /></ProtectRoute>
  },
  {
    path : '/otp-verification',
    element : <OTPVerification />
  },
  {
    path : '/reset-password',
    element : <ResetPassword />
  },
  {
    path : '/register',
    element : <Register />
  },
  {
    path : '/profile',
    element : <AuthorizeUser><Profile /></AuthorizeUser>
  },
  {
    path : '*',
    element : <PageNotFound />
  }
])

function App() {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
}

export default App;
