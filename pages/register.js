import React, { useContext, useEffect } from 'react'
import Layout from "../components/Layout"
import Link from 'next/link'
import { useForm } from "react-hook-form"
// import { signIn, useSession } from "next-auth/react"
import { getError } from '../utils/error'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Store } from '../utils/Store'
import Cookies from 'js-cookie'

function RegisterScreen() {
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;

    const router = useRouter();
    const { redirect } = router.query;
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();

    useEffect(() => {
      if (userInfo) {
        router.push('/');
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const [name, setName] = useState('');
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState('');
    
    
    const submitHandler = async ({ name, email, password, confirmPassword}) => {
       
        if (password !== confirmPassword) {
           return  toast.error("Password don't match!")
          
          }
        try {
            const { data } = await axios.post('/api/users/register', {
              name,
              email,
              password,
            
            });

            dispatch({ type: 'USER_LOGIN', payload: data });
              Cookies.set('userInfo', JSON.stringify(data) );
              router.push(redirect || '/');

          } catch (err) {
            toast.error(getError(err));
          }
    }


  return (
   
    <Layout title="Register">
        <form className='mx-auto max-w-screen-md' 
        onSubmit={handleSubmit(submitHandler)}
        >
            <h1 className='mb-4 text-xl'>Register</h1>
            <div className='mb-4'>
                <label htmlFor='name'>Name</label>
                <input type='name' 
                {...register("name", {required: "Please enter email!",
                minLength: { value: 2, message: "Name must 2 chars up"},
                pattern: {
                    value: /^[a-zA-Z0-9_.+-]/i ,
                    message: "Please enter valid name!"
                }
                 })}
                className='w-full'
                 id='name' 
                 autoFocus
                //  onChange={e => setName(e.target.value)}
                 ></input>
             {errors.name && (
                 <div className='text-red-500'> {errors.name.message}</div>
                 )}
            </div>
            <div className='mb-4'>
                <label htmlFor='email'>Email</label>
                <input type='email' 
                 {...register("email", {required: "Please enter email!",
                 pattern: {
                     value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i ,
                     message: "Please enter valid email!"
                 }
                  })}
                className='w-full'
                 id='email' 
                 autoFocus
                //  onChange={e => setEmail(e.target.value)}
                 ></input>
                 {errors.email && (
                 <div className='text-red-500'> {errors.email.message}</div>
                 )}
            </div>
            <div className='mb-4'>
                <label htmlFor='password'>Password</label>
                <input type='password'
                  {...register("password", {
                    required: "Please enter password!",
                    minLength: { value: 2, message: "Password is more than 5 chars"}
                })}
                 className='w-full' 
                 id='password' autoFocus
                //  onChange={e => setPassword( e.target.value)}
                 ></input>
                 {errors.password && (
                 <div className='text-red-500'> {errors.password.message}</div>
                 )} 
            </div>
            <div className='mb-4'>
                <label htmlFor='Confirm password'>Confirm Password</label>
                <input type='password'
                  {...register("confirmPassword", {
                    required: "Please confirm password!",
                    minLength: { value: 2, message: "Password is more than 5 chars"}
                })}
                 className='w-full' 
                 id='confirmPassword' autoFocus
                //  onChange={e => setConfirmPassword( e.target.value)}
                 ></input>
                 {errors.confirmPassword && (
                 <div className='text-red-500'> {errors.confirmPassword.message}</div>
                 )}
            </div>
            <div className='mb-4'>
                <button className='primary-button'>Register</button>
            </div>
            <div className='mb-4'>
               Already have an account? &nbsp;
                <Link href={`/login?redirect=${redirect || '/'}`}>Login</Link>
            </div>
        </form>
    </Layout>
  )
}

export default RegisterScreen