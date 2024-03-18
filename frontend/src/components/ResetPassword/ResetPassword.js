import styles from './ResetPassword.module.css'

import React, { useEffect } from 'react'
import passVisible from '../../assets/visible.png';
import passInvisible from '../../assets/invisible.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { resetPasswordValidate } from '../../helper/validate';
import { resetPassword } from '../../helper/helper'
import { useAuthStore } from '../../store/store';
import { useNavigate, Navigate } from 'react-router-dom';
import useFetch from '../../hooks/fetch.hook'

export default function ResetPassword() {

    const { username } = useAuthStore(state => state.auth);
    const navigate = useNavigate();
    const [{ isLoading, apiData, status, serverError }] = useFetch('createResetSession')

    const formik = useFormik({
        initialValues: {
            password: '',
            confPassword : ''
        },
        validate: resetPasswordValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            let resetPromise = resetPassword({ username, password: values.password })

      toast.promise(resetPromise, {
        loading: 'Updating...',
        success: <b>Reset Successfully...!</b>,
        error : <b>Could not Reset!</b>
      });

      resetPromise.then(function(){ navigate('/password') })
        }
    })

    const showHidePassword = (e) => {
        console.log(e)
        if (e.target.parentElement.firstChild.type === 'password') {
            e.target.parentElement.firstChild.type = 'text';
            e.target.src = passInvisible;
        }
        else {
            e.target.parentElement.firstChild.type = 'password';
            e.target.src = passVisible;
        }
    }

    if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
    if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>
    if(status && status !== 201) return <Navigate to={'/password'} replace={true}></Navigate>

    return (
        <div className='container mx-auto'>

            <Toaster position='top-center' reverseOrder={false}></Toaster>

            <div className="flex justify-center items-center h-screen">
                <div className={styles.resetPasswordForm}>
                    <div className='title flex flex-col items-center'>
                        <h4 className='text-5xl font-bold'>Reset Password</h4>
                        <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                            Enter new password
                        </span>
                    </div>

                    <form onSubmit={formik.handleSubmit} className='pt-20'>
                        <div className="textbox flex flex-col items-center pb-6 relative">
                            <input {...formik.getFieldProps('password')} type="password" className={styles.textbox} placeholder='Enter New Password' />
                            <img src={passVisible} className={styles.passwordEye} alt="eye-icon" onClick={showHidePassword} />
                        </div>
                        <div className="textbox flex flex-col items-center pb-6 relative">
                            <input {...formik.getFieldProps('confPassword')} type="password" className={styles.textbox} placeholder='Confirm New Password' />
                            <img src={passVisible} className={styles.passwordEye} alt="eye-icon" onClick={showHidePassword} />
                        </div>
                        <div className="textbox flex flex-col items-center pb-6 relative">
                            <button type="submit" className={styles.btn}>Reset Password</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
