import styles from './OTPVerification.module.css';

import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from  '../../store/store';
import { generateOTP, verifyOTP } from '../../helper/helper';
import { useNavigate } from 'react-router-dom'

export default function OTPVerification() {

    const { username } = useAuthStore(state => state.auth);
    const [OTP, setOTP] = useState();
    const navigate = useNavigate()
  
    useEffect(() => {
      generateOTP(username).then((OTP) => {
        if(OTP) return toast.success('OTP has been send to your email!');
        return toast.error('Problem while generating OTP!')
      })
    }, [username]);
  
    async function onSubmit(e){
      e.preventDefault();
      try {
        let { status } = await verifyOTP({ username, code : OTP })
        if(status === 201){
          toast.success('Verify Successfully!')
          return navigate('/reset-password')
        }  
      } catch (error) {
        return toast.error('Wront OTP! Check email again!')
      }
    }
  
    // handler of resend OTP
    function resendOTP(){
  
      let sentPromise = generateOTP(username);
  
      toast.promise(sentPromise ,
        {
          loading: 'Sending...',
          success: <b>OTP has been send to your email!</b>,
          error: <b>Could not Send it!</b>,
        }
      );
  
      sentPromise.then((OTP) => {
        
      });
      
    }

    return (
        <div className='container mx-auto'>

            <Toaster position='top-center' reverseOrder='false'></Toaster>

            <div className="flex justify-center items-center h-screen">
                <div className={styles.otpForm}>
                    <div className='title flex flex-col items-center'>
                        <h4 className='text-5xl font-bold'>OTP Verification</h4>
                        <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                        Enter OTP to reset password
                        </span>
                    </div>

                    <form className='pt-20' onSubmit={onSubmit}>

                        <div className="textbox flex flex-col items-center gap-6 relative">
                                <span className='text-sm text-gray-500'>
                                    Enter 6 digit OTP sent to your email address
                                </span>
                                <input type="text" onChange={(e) => setOTP(e.target.value) } className={styles.textbox} placeholder='Enter OTP' />
                            <button type="submit" className={styles.btn}>OTP Verification</button>
                        </div>

                        <div className="text-center py-4">
                            <span className='text-gray-500'>Can't get OTP? <button className='text-red-500' onClick={resendOTP}>Resend OTP</button></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
