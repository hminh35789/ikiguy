/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../components/Layout';
// import { useRouter } from 'next/router';
// import data from '../../utils/data';
// import Link from 'next/link';
import { Store } from '../../utils/Store'
import db from '../../utils/db';
import Product from '../../model/productModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import Rating from "../../components/Rating"
// import { ChevronDownIcon } from '@heroicons/react/solid';
import { useForm } from 'react-hook-form';
import { getError } from '../../utils/error';
import Link from 'next/link';
import dynamic from 'next/dynamic';

function ProductScreen(props) {

    const { product } = props;
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
  
    // const router = useRouter()
    // const {slug} = query;
    // const product = data.products.find(x => x.slug === slug)

  const [reviews, setReviews] = useState([]);
  // const [rating, setRating] = useState(0);
  // const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  console.log(product)
  const {
    handleSubmit,
    register,
    formState: { errors },
} = useForm();


  const submitHandler = async ({ rating, comment }) => {
    console.log(rating, comment, rating)
    setLoading(true);
    try {
      await axios.post(
        `/api/products/${product._id}/reviews`,
       
        {
          userInfo,
          rating,
          comment,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      setLoading(false);
      toast.success('Review submitted successfully');
      fetchReviews();
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/products/${product._id}/reviews`);
      setReviews(data);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

    if(!product){
        return <Layout title="Product Not Found">404 : Product Not Found!</Layout>
    }
    const addToCartHandler = async() => {
      const existItem = state.cart.cartItems.find((x)=> x.slug === product.slug );
      const quantiny = existItem ? existItem.quantiny + 1 : 1;
      const { data } = await axios.get(`/api/products/${product._id}`);
      console.log({data})

      if (data.countInStock < quantiny) {
        return toast.error("Sorry. Product is out of stock!")
      }
      dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantiny } });
    }
  return (
    
    <Layout title={product.name}>
        
        <div className='py-2'>
            {/* <Link href="/"> Back to products</Link> */}
             <button onClick={() => history.back()}>Back to products</button>
        </div>
        <div className='grid md:grid-cols-4 md:gap-3'>
          <div className='md:col-span-2'>
            <img
            src={product.image[0]}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
            />
           
          </div>
          <div>
            <ul>
              <li>
                <h1 className='text-lg'>{product.name}</h1>
              </li>
              <li>Category: {product.category}</li>
              <li>Brand: {product.brand}</li>
              <li className='flex'>
              <Rating rating={product.rating} numReviews={product.numReviews}> 

              </Rating>
               <p className='flex space-x-2 m-1'> 
                 of  <span> </span>{product.numReviews ? (
              <a href="#reviews" >
                {product.numReviews}  previews
              </a>
      ): 
      (
        <a  href="#reviews"> no review </a>
      )
    }
              
                </p> 
              </li>
              <li>Description: {product.description}</li>
            </ul>
          </div>
          <div>
            <div className='card p-5'>
              <div className='mb-2 flex justify-between'>
                <div>Price</div>
                <div>${product.price}</div>
              </div>
              <div className='mb-2 flex justify-between'>
                <div>Status</div>
                <div>{product.countInStock > 0 ? 
                 (<div className=' text-green-600'>In stock</div>): 
                 ( <div className='text-red-600'>Unvailable</div>)
                }
                </div>
              </div>

              {
               product.countInStock > 0 ? 
                (<button className='primary-button w-full' onClick={addToCartHandler} 
                  >Add to cart
                  </button>) :
                (<button className='bg-red-700 w-full' disabled 
                  >Out of stock!
                  </button>)
              }
              
            </div>
          </div>
        </div>
        
        <div id="reviews" className="max-w-screen-md">
        <h2 className="mt-3 text-lg">Customer Reviews</h2>
        {reviews.length === 0 && <div>No review found</div>}
        <ul>
          {Array.isArray(reviews) ?
          reviews.map((review) => (
            <li key={review._id}>
              <div className="mt-3 p-3 shadow-inner dark:shadow-gray-700">
                <div>
                  <strong>{review.name}</strong> on{' '}
                  {review.createdAt?.substring(0, 10)}
                </div>
                <Rating rating={review.rating}></Rating>
                <div>{review.comment}</div>
              </div>
            </li>
          )) : null
          }
        </ul>
        <div className="card mt-5  p-5">
          {userInfo ? (
            <form onSubmit={handleSubmit(submitHandler)}>
              <h2 className="mb-4 text-lg">Leave your review</h2>
              <div className="mb-4">
                <label htmlFor="comment">Comment</label>
                <textarea
                  className="w-full"
                  id="comment"
                  {...register('comment', {
                    required: 'Please enter comment',
                  })}
                />
                {errors.comment && (
                  <div className="text-red-500">{errors.comment.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="rating">Rating</label>
                <select
                  id="rating"
                  className="w-full"
                  {...register('rating', {
                    required: 'Please enter rating',
                  })}
                >
                  <option value=""></option>
                  {['1 star', '2 stars', '3 stars', '4 stars', '5 stars'].map(
                    (x, index) => (
                      <option key={index + 1} value={index + 1}>
                        {x}
                      </option>
                    )
                  )}
                </select>
                {errors.rating && (
                  <div className="text-red-500 ">{errors.rating.message}</div>
                )}
              </div>
              <div className="mb-4 ">
                <button disabled={loading} className="primary-button">
                  {loading ? 'Loading' : 'Submit'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              Please{' '}
              <Link href={`/login?redirect=/product/${product.slug}`}>
                login
              </Link>{' '}
              to write a review
            </div>
          )}
        </div>
      </div>

    </Layout>
  )
}
export default dynamic(() => Promise.resolve(ProductScreen), { ssr: false });


export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }, '-reviews').lean();
 
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}