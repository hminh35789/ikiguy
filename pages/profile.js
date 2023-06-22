/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useContext, useState } from 'react';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';
import Layout from '../components/Layout';
import Link from 'next/link';
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify'
import Cookies from 'js-cookie';


function ProfileScreen() {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  
  const { userInfo } = state;
 

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

 
  const [file, setFile] = useState(); 

  useEffect(() => {
    if (!userInfo) {
       router.push('/');
    }
    setValue('name', userInfo?.name);
    setValue('email', userInfo?.email);
    setValue('avatar', userInfo?.avatar);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ userInfo]  );

  console.log(userInfo)

  const submitHandler = async ({ name, email, password, avatar }) => {
    try {
     const { data } = await axios.put('/api/users/profile', {
        name,
        email,
        password,
        avatar
      },
      { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));
    //   const result = await signIn('credentials', {
    //     redirect: false,
    //     email,
    //     password,
    //   });
      toast.success('Profile updated successfully');
    //   if (result.error) {
    //     toast.error(result.error);
    //   }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const uploadHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      // dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/users/imageUser', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      // dispatch({ type: 'UPLOAD_SUCCESS' });
      setFile(URL.createObjectURL(file));
      setValue('avatar', data.secure_url);
      toast.success('File uploaded successfully');
    } catch (err) {
      // dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };


//   const changeAvatar = async (e) =>  {
        
//     const file = e.target.files[0]
//     if(!file)
//         return dispatch({type: 'NOTIFY', payload: {error: 'File does not exist.'}})

//     if(file.size > 1024 * 1024) //1mb
//         return dispatch({type: 'NOTIFY', payload: {error: 'The largest image size is 1mb.'}})

//     if(file.type !== "image/jpeg" && file.type !== "image/png") //format
//         return dispatch({type: 'NOTIFY', payload: {error: 'Image format is incorrect.'}})
//     setFile(URL.createObjectURL(file));
  

//    toast.success('Avatar updated successfully');
// }

  return (
    <Layout title="Profile">
     
        <div className="grid md:grid-cols-12 md:gap-5">
          <div className="overflow-x-auto md:col-span-2 ">
              <div className='flex flex-col items-center justify-center p-5 border-2 border-red-200 rounded-md'>
               
                  <Link className='bg-gray-900 w-full text-amber-600' href="/profile" >User Profile</Link>
                  <Link href="/order-history">Order History</Link>
                  <Link href="/coupon">Coupon</Link>
              </div>
          </div>
          <div className="overflow-x-auto md:col-span-10">
            
            <div className='card p-5'>
            <div className="grid md:grid-cols-12 md:gap-5">
              <div className="overflow-x-auto md:col-span-2 ">
          
              <div className="mb-4">
                <label htmlFor="imageFile">Upload image</label>

                <img src={file  || userInfo?.avatar} 
                        alt="avatar" />

                <input
                  type="file"
                  className="w-full"
                  id="imageFile"
                  onChange={uploadHandler}
                />
                <label htmlFor="image">image</label>
                <input
                  type="text"
                  className="w-full"
                  id="avatar"
                  {...register('avatar', {
                    required: 'Please enter avatar',
                  })}
                />
                </div>
              </div>
              <div className="overflow-x-auto md:col-span-10">
              <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Update Profile</h1>

        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="w-full"
            id="name"
            autoFocus
            {...register('name', {
              required: 'Please enter name',
            })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="w-full"
            id="email"
            {...register('email', {
              required: 'Please enter email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Please enter valid email',
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password">New Password</label>
          <input
            className="w-full"
            type="password"
            id="password"
            {...register('password', {
              required: 'Please enter new password',
              minLength: { value: 6, message: 'password is more than 5 chars' },
            })}
          />
          {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            className="w-full"
            type="password"
            id="confirmPassword"
            {...register('confirmPassword', {
              required: 'Please confirm new password',
              validate: (value) => value === getValues('password'),
              minLength: {
                value: 6,
                message: 'confirm password is more than 5 chars',
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500 ">
              {errors.confirmPassword.message}
            </div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === 'validate' && (
              <div className="text-red-500 ">Password do not match</div>
            )}
        </div>
        <div className="mb-4">
          <button className="primary-button">Update Profile</button>
        </div>
            </form>
              </div>

            </div>
          
            </div>
       
            </div>
          </div>
    
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(ProfileScreen), { ssr: false });