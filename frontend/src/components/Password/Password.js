import styles from './Password.module.css'

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../../assets/profile.png'
import passVisible from '../../assets/visible.png'
import passInvisible from '../../assets/invisible.png'
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { passwordValidate } from '../../helper/validate';
import {useAuthStore} from '../../store/store';
import useFetch from '../../hooks/fetch.hook';
import { verifyPassword } from '../../helper/helper' 

export default function Password() {

    const navigate = useNavigate();
    const { username } = useAuthStore(state => state.auth)
    const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`)

    const formik = useFormik({
        initialValues : {
            password : ''
        },
        validate: passwordValidate,
        validateOnBlur: false,
        validateOnChange:false,
        onSubmit : async values =>{
            let loginPromise = verifyPassword({ username, password : values.password })
            toast.promise(loginPromise, {
              loading: 'Checking...',
              success : <b>Login Successfully...!</b>,
              error : <b>Password Not Match!</b>
            });
      
            loginPromise.then(res => {
              let { token } = res.data;
              localStorage.setItem('token', token);
              navigate('/profile')
            })
        }
    })

    const showHidePassword = (e)=>{
        if(e.target.parentElement.firstChild.type === 'password'){
            e.target.parentElement.firstChild.type = 'text';
            e.target.src = passInvisible;
        }
        else{
            e.target.parentElement.firstChild.type = 'password';
            e.target.src = passVisible;
        }
    }

    if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
    if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className='container mx-auto'>

        <Toaster position='top-center' reverseOrder={false}></Toaster>

        <div className="flex justify-center items-center h-screen">
            <div className={styles.passwordForm}>
                <div className='title flex flex-col items-center'>
                    <h4 className='text-5xl font-bold'>Hello {apiData?.firstName || apiData?.username}</h4>
                    <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                        Explore More by connecting with us
                    </span>
                </div>

                <form onSubmit={formik.handleSubmit} className='py-1'>
                    <div className='profile flex justify-center py-4'>
                        <img src={apiData?.profile || avatar} className={styles.profileImg} alt='avatar' />
                    </div>

                    <div className="textbox flex flex-col items-center gap-6 relative">
                        <input {...formik.getFieldProps('password')} type="password" className={styles.textbox} placeholder='Password' />
                        <img src={passVisible} className={styles.passwordEye} alt="eye-icon" onClick={showHidePassword}/>
                        <button type="submit" className={styles.btn}>Sign In</button>
                    </div>

                    <div className="text-center py-4">
                        <span className='text-gray-500'>Forgot Password? <Link to="/otp-verification" className='text-red-500'>Reset Now</Link></span>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}
