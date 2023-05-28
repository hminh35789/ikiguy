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
import { toast } from "react-toastify";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

 
function reducer(state, action) {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true, error: '' };
      case 'FETCH_SUCCESS':
        return { ...state, loading: false, order: action.payload, error: '' };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
      case 'PAY_REQUEST':
        return { ...state, loadingPay: true };
      case 'PAY_SUCCESS':
        return { ...state, loadingPay: false, successPay: true };
      case 'PAY_FAIL':
        return { ...state, loadingPay: false, errorPay: action.payload };
      case 'PAY_RESET':
        return { ...state, loadingPay: false, successPay: false, errorPay: '' };
      case 'DELIVER_REQUEST':
        return { ...state, loadingDeliver: true };
      case 'DELIVER_SUCCESS':
        return { ...state, loadingDeliver: false, successDeliver: true };
      case 'DELIVER_FAIL':
        return { ...state, loadingDeliver: false, errorDeliver: action.payload };
      case 'DELIVER_RESET':
        return {
          ...state,
          loadingDeliver: false,
          successDeliver: false,
          errorDeliver: '',
        };
      default:
        state;
    }
  }

 function OrderScreen({ params }) {
    // order/:id
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    const orderId = params.id;

    const { state  } = useContext(Store);

    const { userInfo } = state;
   
    // const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    //     loading: true,
    //     order: {},
    //     error: '',
    //   });
    const [
      { loading, error, order, successPay, loadingPay,  loadingDeliver, successDeliver },
      dispatch,
    ] = useReducer(reducer, {
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

       if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
      )  {
        fetchOrder();
        if (successPay) {
          dispatch({ type: 'PAY_RESET' });
        }
        if (successDeliver) {
          dispatch({ type: 'DELIVER_RESET' });
        }
      }  else
      {
          const loadPaypalScript = async () => {
            const { data: clientId } = await axios.get('/api/keys/paypal', {
              headers: { authorization: `Bearer ${userInfo.token}` },
              
            });
            console.log(clientId)

            paypalDispatch({
              type: 'resetOptions',
              value: {
                'client-id': clientId,
                currency: 'USD',
              },
            });
            paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
          };
          loadPaypalScript();
      } 
 
    }, [order, successDeliver, orderId, paypalDispatch, userInfo, successPay, router]);

    function createOrder(data, actions) {
      return actions.order
        .create({
          purchase_units: [
            {
              amount: { value: totalPrice },
            },
          ],
        })
        .then((orderID) => {
          return orderID;
        });
    }
  
    function onApprove(data, actions) {
      return actions.order.capture().then(async function (details) {
        try {
          dispatch({ type: 'PAY_REQUEST' });
          const { data } = await axios.put(
            `/api/orders/${order._id}/pay`,
            details,
            {
              headers: { authorization: `Bearer ${userInfo.token}` },
            }
          );
          dispatch({ type: 'PAY_SUCCESS', payload: data });
          toast.success('Order is paid successgully');
        } catch (err) {
          dispatch({ type: 'PAY_FAIL', payload: getError(err) });
          toast.error(getError(err));
        }
      });
    }
    function onError(err) {
      toast.error(getError(err));
    }
    async function deliverOrderHandler() {
      try {
        dispatch({ type: 'DELIVER_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/deliver`,
          {},
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'DELIVER_SUCCESS', payload: data });
        toast('Order is delivered', { variant: 'success' });
      } catch (err) {
        dispatch({ type: 'DELIVER_FAIL', payload: getError(err) });
        toast.error(getError(err), { variant: 'error' });
      }
    }
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
                  {!isPaid && (
                    <li>
                      {isPending ? (
                        <div>Loading...</div>
                      ) : (
                        <div className="w-full flex overflow-x-auto">
                          <PayPalButtons className="w-full rounded-lg bg-gray-700 overflow-x-auto"
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </div>
                      )}
                      {loadingPay && <div>Loading...</div>}
                    </li>
                )}

                  {loadingPay && <div>Loading...</div>}

                  {userInfo.isAdmin  && !order.isDelivered && (
                  <li>
                    {loadingDeliver && <div>Loading...</div>}
                    <button
                      className="primary-button w-full"
                      onClick={deliverOrderHandler}
                    >
                      Deliver Order
                    </button>
                  </li>
                )}

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