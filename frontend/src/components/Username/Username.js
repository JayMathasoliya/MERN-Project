import styles from './Username.module.css'

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../../assets/profile.png'
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { usernameValidate } from '../../helper/validate'; 
import {useAuthStore} from '../../store/store';

export default function Username() {

    const navigate = useNavigate();
    const setUsername = useAuthStore(state => state.setUsername)
    
    const formik = useFormik({
        initialValues : {
            username : ''
        },
        validate: usernameValidate,
        validateOnBlur: false,
        validateOnChange:false,
        onSubmit : async values =>{
           setUsername(values.username);
           navigate('/password'); 
        }
    })

  return (
    <div className='container mx-auto'>

        <Toaster position='top-center' reverseOrder='false'></Toaster>

        <div className="flex justify-center items-center h-screen">
            <div className={styles.usernameForm}>
                <div className='title flex flex-col items-center'>
                    <h4 className='text-5xl font-bold'>Hello Again!</h4>
                    <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                        Explore More by connecting with us
                    </span>
                </div>

                <form onSubmit={formik.handleSubmit} className='py-1'>
                    <div className='profile flex justify-center py-4'>
                        <img src={avatar} className={styles.profileImg} alt='avatar' />
                    </div>

                    <div className="textbox flex flex-col items-center gap-6">
                        <input {...formik.getFieldProps('username')} type="text" className={styles.textbox} placeholder='Username' />
                        <button type="submit" className={styles.btn}>Let's Go</button>
                    </div>

                    <div className="text-center py-4">
                        <span className='text-gray-500'>Not a Member? <Link to="/register" className='text-red-500'>Register Now</Link></span>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}
