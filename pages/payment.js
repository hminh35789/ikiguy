import React, { useContext, useEffect, useState } from 'react'
import Layout from '../components/Layout';
import CheckoutWizard from '../components/CheckoutWizard';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';

function PaymentScreen() { 
 
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const { state, dispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const { shippingAddress, paymentMethod } = cart;
  
  const router = useRouter();

  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error('Payment method is required');
    }
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );

    router.push('/placeorder');
  };
 

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
      // if (!shippingAddress) {
      //   return router.push('/shipping');
      // }
    }
    
    setSelectedPaymentMethod(paymentMethod || '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, router, shippingAddress]);

  return (
    <Layout title="Payment method">
        <CheckoutWizard activeStep={2} />
        <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl">Payment Method</h1>
        {['PayPal', 'Stripe', 'Cash On Delivery'].map((payment) => (
          <div key={payment} className="mb-4">
            <input
              name="paymentMethod"
              className="p-2 outline-none focus:ring-0"
              id={payment}
              type="radio"
              checked={selectedPaymentMethod === payment}
              onChange={() => setSelectedPaymentMethod(payment)}
            />

            <label className="p-2" htmlFor={payment}>
              {payment}
            </label>
          </div>
        ))}
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => router.push('/shipping')}
            type="button"
            className="default-button"
          >
            Back
          </button>
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(PaymentScreen), {ssr: false});


