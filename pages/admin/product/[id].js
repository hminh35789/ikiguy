/* eslint-disable @next/next/no-img-element */

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../../../components/Layout';
import { getError } from '../../../utils/error';
import dynamic from 'next/dynamic';
import { Store } from '../../../utils/Store';

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
 function AdminProductEditScreen({ params }) {
  const  productId = params.id;
  const { state } = useContext(Store);

  const [{ loading, error, loadingUpdate, loadingUpload  }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const router = useRouter();
  const [fileImg, setFileImg] = useState([]); 

  const [isFeatured, setIsFeatured] = useState(false);
  const [fileFeature, setFileFeature] = useState([]); 
  const [ img, setImg ] = useState([]);
  const [ feature, setFeature ] = useState([]);

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/admin/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setFileImg(URL.createObjectURL(file));
      setValue('image', data.secure_url);
      toast.success('File image uploaded successfully');
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  const uploadFeatured = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/admin/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setFileFeature(URL.createObjectURL(file));
      setValue('featuredImage', data.secure_url);
      toast.success('File Feature uploaded successfully');
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  const { userInfo } = state;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  

  useEffect(() => {
    if (!userInfo) {
        return router.push('/login');
      } else{
        const fetchData = async () => {
            try {
              dispatch({ type: 'FETCH_REQUEST' });
              const { data } = await axios.get(`/api/admin/products/${productId}`, {
                headers: { authorization: `Bearer ${userInfo.token}` },
              });
              setIsFeatured(data.isFeatured);
              dispatch({ type: 'FETCH_SUCCESS' });
              setValue('name', data.name);
              setValue('slug', data.slug);
              setValue('price', data.price);
              setValue('image', data.image);
              setValue('featuredImage', data.featuredImage);
              setImg(data.image);
              setFeature(data.featuredImage)
              setValue('category', data.category);
              setValue('brand', data.brand);
              setValue('countInStock', data.countInStock);
              setValue('description', data.description);
              
            } catch (err) {
              dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
          };
          fetchData();
      }
    
  }, [productId, router, setValue, userInfo]);

  
  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    image,
    brand,
    countInStock,
    description,
    featuredImage
  }) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(`/api/admin/products/${productId}`, {
        name,
        slug,
        price,
        category,
        image,
        brand,
        countInStock,
        description,
        isFeatured,
        featuredImage
      },
      { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  const handleCheck = () => {
    setIsFeatured(!isFeatured)
}
  return (
    <Layout title={`Edit Product ${productId}`}>
      <div className="grid md:grid-cols-12 md:gap-5">
        <div className="md:col-span-2">
          <ul>
            <li>
              <Link href="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/admin/products"className="font-bold">
                Products
              </Link>
            </li>
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
          </ul>
         </div>
         
        <div className="md:col-span-5">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <form
              className="mx-auto max-w-screen-md"
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className="mb-4 text-xl">{`Edit Product ${productId}`}</h1>
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
                <label htmlFor="slug">Slug</label>
                <input
                  type="text"
                  className="w-full"
                  id="slug"
                  {...register('slug', {
                    required: 'Please enter slug',
                  })}
                />
                {errors.slug && (
                  <div className="text-red-500">{errors.slug.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">Price</label>
                <input
                  type="text"
                  className="w-full"
                  id="price"
                  {...register('price', {
                    required: 'Please enter price',
                  })}
                />
                {errors.price && (
                  <div className="text-red-500">{errors.price.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  className="w-full"
                  id="category"
                  {...register('category', {
                    required: 'Please enter category',
                  })}
                />
                {errors.category && (
                  <div className="text-red-500">{errors.category.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  className="w-full"
                  id="brand"
                  {...register('brand', {
                    required: 'Please enter brand',
                  })}
                />
                {errors.brand && (
                  <div className="text-red-500">{errors.brand.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="countInStock">Count Instock</label>
                <input
                  type="text"
                  className="w-full"
                  id="countInStock"
                  {...register('countInStock', {
                    required: 'Please enter countInStock',
                  })}
                />
                {errors.countInStock && (
                  <div className="text-red-500">
                    {errors.countInStock.message}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="countInStock">Description</label>
                <input
                  type="text"
                  className="w-full"
                  id="description"
                  {...register('description', {
                    required: 'Please enter description',
                  })}
                />
                {errors.description && (
                  <div className="text-red-500">
                    {errors.description.message}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="countInStock">Is featured image</label>
                <input
                  type="radio"
                  className=""
                  id="featured"
                  checked={isFeatured}
                  onClick={handleCheck}
                  {...register('featured')}
                />
                
                {errors.isFeatured && (
                  <div className="text-red-500">
                    {errors.isFeatured.message}
                  </div>
                )} 
              </div>
              {/* button */}
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
        {/* image */}
        <div className="pt-10 md:col-span-5">
        {isFeatured && 
                   <div className="mb-4">
                      <label htmlFor="imageFile">Upload feature</label>
                      <div className="mb-4">
                          <label htmlFor="feature">Feature url</label>
                          <input
                            type="text"
                            className="w-full"
                            id="featuredImage"
                            {...register('featuredImage')}
                          />
                          {errors.feature && (
                            <div className="text-red-500">{errors.feature.message}</div>
                          )}
                      </div>
                      {fileFeature.length > 0 &&  <img src={fileFeature} 
                            alt="featuredImage" /> 
                       || <img  src={feature}   alt="image" />     
                      }
                  
                      <input
                        type="file"
                        className="w-full"
                        id="featureFile"
                        onChange={uploadFeatured}
                      />
      
                      {loadingUpload && <div>Uploading....</div>}
                 </div>
              }
           
              <div className="mb-4">
                  <label htmlFor="imageFile">Upload image</label>

                  <div className="mb-4">
                    <label htmlFor="image">Image url</label>
                    <input
                      type="text"
                      className="w-full"
                      id="image"
                      {...register('image', {
                        required: 'Please enter image',
                      })}
                    />
                    {errors.image && (
                      <div className="text-red-500">{errors.image.message}</div>
                    )}
                </div>

                  {fileImg.length > 0 &&  <img src={fileImg}  alt="image" />
                  || <img  src={img}   alt="image" />     
                  }

                  <input
                    type="file"
                    className="w-full"
                    id="imageFile"
                    onChange={uploadImage}
                  />

                  {loadingUpload && <div>Uploading....</div>}
              </div>
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

export default dynamic(() => Promise.resolve(AdminProductEditScreen), { ssr: false });