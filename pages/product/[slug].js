import React, { useContext } from 'react'
import Layout from '../../components/Layout';
// import { useRouter } from 'next/router';
// import data from '../../utils/data';
// import Link from 'next/link';
import Image from 'next/image';
import { Store } from '../../utils/Store'
import db from '../../utils/db';
import Product from '../../model/productModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import Rating from "../../components/Rating"
// import { ChevronDownIcon } from '@heroicons/react/solid';

function ProductScreen(props) {

    const { product } = props;
    const { state, dispatch } = useContext(Store);
    // const router = useRouter()
    // const {slug} = query;
    // const product = data.products.find(x => x.slug === slug)

    if(!product){
        return <Layout title="Product Not Found">Product Not Found!</Layout>
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
            <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
            >
            </Image>
          </div>
          <div>
            <ul>
              <li>
                <h1 className='text-lg'>{product.name}</h1>
              </li>
              <li>Category: {product.category}</li>
              <li>Brand: {product.brand}</li>
              <li className='flex'>
              <Rating rating={product.rating}> 

              </Rating>
               <p className='flex space-x-2 m-1'> 
                 of <span> </span>{product.numReviews && (
              <a href="#reviews" >
                {product.numReviews}  previews
              </a>
      )}
              
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
                <div>{product.countInstock > 0 ? "In stock" : "Unvailable"}</div>
              </div>
              <button className='primary-button w-full' onClick={addToCartHandler}>Add to cart</button>
            </div>
          </div>
        </div>

    </Layout>
  )
}

export default ProductScreen;

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();

  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}