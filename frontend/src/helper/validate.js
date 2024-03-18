import toast from "react-hot-toast";
import {authenticate} from './helper';

/** validate login page username */
export async function usernameValidate(values) {
    const errors = usernameVerify({}, values);

    if(values.username){
        // check user exist or not
        const { status } = await authenticate(values.username);
        
        if(status !== 200){
            errors.exist = toast.error('User does not exist...!')
        }
    }

    return errors;
}

/** validate username */
function usernameVerify(errors = {}, values) {
    if (!values.username) {
        errors.username = toast.error("Username Required");
    } else if (values.username.includes(" ")) {
        errors.username = toast.error("Invalid Username");
    }

    return errors;
}

/** validate login page password */
export async function passwordValidate(values) {
    const errors = passwordVerify({}, values);
    return errors;
}

/** validate password */
function passwordVerify(errors = {}, values) {
    const passwordRegex =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    if (!values.password) {
        errors.password = toast.error("Password Required");
    } else if (values.password.includes(" ")) {
        errors.password = toast.error("Wrong Password");
    } else if (!passwordRegex.test(values.password)) {
        errors.password = toast.error(
            "Password must contain minimum 8 characters, at least one uppercase letter, one lowercase letter, one digit and one special character"
        );
    }

    return errors;
}

/** validate email */
function emailVerify(errors = {}, values){

    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/

    if(!values.email){
        errors.email = toast.error("Email Required");
    }
    else if(values.email.includes(" ")){
        errors.email = toast.error("Wrong Email");
    }
    else if(!emailRegex.test(values.email)){
        errors.email = toast.error("Invalid Email Address");
    }
    return errors;
}

/** validate register form */
export async function registerValidation(values){
    const errors = passwordVerify({},values);
    usernameVerify(errors, values);
    emailVerify(errors,values);

    return errors;
}

/** validate profile page */
export async function profileValidation(values){
    const errors = emailVerify({}, values);
    return errors;
}

/** validate reset password */
export async function resetPasswordValidate(values){
    const errors = passwordVerify({}, values);
    if(values.password !== values.confPassword){
        errors.exist = toast.error("Password not match");
    }
    return errors;
}