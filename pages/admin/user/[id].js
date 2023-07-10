import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useContext, useReducer, useState } from 'react';
import { getError } from '../../../utils/error';
import { Store } from '../../../utils/Store';
import Layout from '../../../components/Layout';

import {  useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Link from 'next/link';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
}

function UserEdit({ params }) {
  const userId = params.id;
  const { state } = useContext(Store);
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const {
    handleSubmit,
    
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const [isAdmin, setIsAdmin] = useState(false);
  
  const router = useRouter();
 
  const { userInfo } = state;

  useEffect(() => {
  
    if (!userInfo) {
      return router.push('/login');
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`/api/admin/users/${userId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setIsAdmin(data.isAdmin);
          dispatch({ type: 'FETCH_SUCCESS' });
          setValue('name', data.name);
        } catch (err) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };
      fetchData();
    }
  }, []);

  const submitHandler = async ({ name }) => {
    
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/admin/users/${userId}`,
        {
          name,
          isAdmin,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('User updated successfully', { variant: 'success' });
      router.push('/admin/users');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };
  const handleCheck = () => {
    setIsAdmin(!isAdmin)
}


  return (
    <Layout title={`Edit User ${userId}`}>
       <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/admin/products">
                Products
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className="font-bold">Users</Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <form
              className="mx-auto max-w-screen-md"
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className="mb-4 text-xl">{`Edit User ${userId}`}</h1>
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
                <label htmlFor="countInStock">Is Admin</label>
                <input
                  type="radio"
                  className=""
                  id="admin"
                  checked={isAdmin}
                  onClick={handleCheck}
                  {...register('admin'
                   
                  )}
                />
                
                {errors.isAdmin && (
                  <div className="text-red-500">
                    {errors.isAdmin.message}
                  </div>
                )} 


              </div>
              <div className="mb-4">
                <button disabled={loadingUpdate} className="primary-button">
                  {loadingUpdate ? 'Loading' : 'Update'}
                </button>
              </div>
              <div className="mb-4">
                <button onClick={() => history.back()}>Back</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(UserEdit), { ssr: false });