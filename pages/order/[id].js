import Layout from "../../components/Layout"
import CheckoutWizard from "../../components/CheckoutWizard"
import Link from "next/link";
import { useContext, useEffect, useReducer } from "react";
import { Store } from "../../utils/Store";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
// import Cookies from "js-cookie";
// import { toast } from "react-toastify";
import { getError } from "../../utils/error"
import dynamic from "next/dynamic";
 
function reducer(state, action) {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true, error: '' };
      case 'FETCH_SUCCESS':
        return { ...state, loading: false, order: action.payload, error: '' };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
      default:
        state;
    }
  }

 function OrderScreen({ params }) {

    const orderId = params.id;
    const { state  } = useContext(Store);

    const { userInfo } = state;
   
    const [{ loading, error, order }, dispatch] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
      });
    const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    isStatus
    } = order;
    
    
    const router = useRouter();
    console.log(isStatus, isDelivered)
    useEffect(() => {
    if(!userInfo){
        return router.push('/login')
    }
    const fetchOrder = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });
          const { data } = await axios.get(`/api/orders/${orderId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (err) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };
      if (!order._id || (order._id && order._id !== orderId)) {
        fetchOrder();
      }   
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order]);
  
    return (
      <Layout title={`Order ${orderId}`}>
        <CheckoutWizard activeStep={3} />
        <h1 className="mb-4 text-xl">Order {orderId}</h1>
        {loading ? (
          <div>
            ...Loading
          </div>
        ) : error ? (
            <div>{error}</div>
        ) :(
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <div className="card  p-5">
                <h2 className="mb-2 text-lg">Shipping Address</h2>
                <div>
                  {shippingAddress.fullName}, {shippingAddress.address},{' '}
                  {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                  {shippingAddress.country}
                </div>
                <div>
                 Status: {isStatus === "is pending" ? (
                  <span className="text-pink-400">is pending </span>
                 ) : (
              <span className="text-green-700">success </span>
                 ) } 
                 
                 {isDelivered
                    ? `delivered at ${deliveredAt}`
                    : 'not delivered'}
                </div>
              </div>
              <div className="card  p-5">
                <h2 className="mb-2 text-lg">Payment Method</h2>
                <div>{paymentMethod}</div>
                 <div>
                 Status: {isPaid ? `paid at ${paidAt}` : 'not paid'}
                 </div>
              </div>
              <div className="card overflow-x-auto p-5">
                <h2 className="mb-2 text-lg">Order Items</h2>
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="px-5 text-left">Item</th>
                      <th className=" p-5 text-right">Quantiny</th>
                      <th className=" p-5 text-right">Price</th>
                      <th className="p-5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item) => (
                      <tr key={item._id} className="border-b">
                        <td>
                          <Link href={`/product/${item.slug}`} className="flex items-center">
                            
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={50}
                                height={50}
                              ></Image>
                              &nbsp;
                              {item.name}
                           
                          </Link>
                        </td>
                        <td className=" p-5 text-right">{item.quantiny}</td>
                        <td className="p-5 text-right">${item.price}</td>
                        <td className="p-5 text-right">
                          ${item.quantiny * item.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               
              </div>
            </div>
            <div>
              <div className="card p-4">
                <h1 className="text-center">Coupon discount</h1>
                <p></p>
              </div>
              <div className="card  p-5">
                <h2 className="mb-2 text-lg">Order Summary</h2>
                <ul>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Items</div>
                      <div>${itemsPrice}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Tax</div>
                      <div>${taxPrice}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Shipping</div>
                      <div>${shippingPrice}</div>
                    </div>
                  </li>
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Total</div>
                      <div>${totalPrice}</div>
                    </div>
                  </li>

                </ul>
              </div>
            </div>
          </div>
        )}
      </Layout>
    );
  }

  export async function getServerSideProps({ params }) {
    return { props: { params } };
  }

  export default dynamic(() => Promise.resolve(OrderScreen), {ssr: false});