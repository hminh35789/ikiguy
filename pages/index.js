/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react'
import Layout from '../components/Layout'

import ProductItem from '../components/product/ProductItem'
import db from "../utils/db"
import Product from "../model/productModal"
import { Store } from '../utils/Store'
import axios from 'axios'
import { toast } from 'react-toastify'
import dynamic from 'next/dynamic'
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Link from 'next/link';

function Home({ products, featuredProducts }) {

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async(product) => {
    const existItem = cart.cartItems.find((x)=> x.slug === product.slug );
    const quantiny = existItem ? existItem.quantiny + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantiny) {
      return toast.error("Sorry. Product is out of stock")
      
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantiny } });

    toast.success("Product added to the cart!")
  }

  return (
    
      <Layout title="Home Pages"> 
      <Carousel showThumbs={false} autoPlay>
        {featuredProducts.map((product) => (
          <div key={product._id}>
            <Link href={`/product/${product.slug}`} className="flex max-h-96" passHref>
             
                <img className=''
                src={product.featuredImage}
                 alt={product.name} />
             
            </Link>
          </div>
        ))}
      </Carousel>
      <h2 className="h2 my-4">Latest Products</h2>
       <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
          {products.map((product)=> (
            <ProductItem 
            product={product} 
            key={product.slug}
            addToCartHandler={addToCartHandler}
            ></ProductItem>
          ))}
       </div>
      </Layout>
  
  )
}

export default dynamic(() => Promise.resolve(Home), {ssr: false});

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}, '-reviews').lean();
  const featuredProducts = await Product.find({ isFeatured: true }).lean();
  await db.disconnect();
  
  return {
    props: {
      featuredProducts: featuredProducts.map(db.convertDocToObj),
      products: products.map(db.convertDocToObj),
    },
  };
}