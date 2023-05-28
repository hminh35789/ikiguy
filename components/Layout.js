import Head from 'next/head'
import Link from 'next/link'
import React, {useContext, useEffect, useState} from 'react'
import { Store } from '../utils/Store'
import Button from '../pages/Button';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import { Menu } from '@headlessui/react';
import DropdownLink from './DropdownLink';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

function Layout({ title, children}) {

  const { state, dispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [ cartItemCount, setCartItemCount] = useState(0);
  const router = useRouter();
  useEffect(() => {
    setCartItemCount(cart.cartItems.reduce(( a, c) => a + c.quantiny, 0))
  }, [cart.cartItems]);

 
  const logoutClickHandler = () => {
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('userInfo');
    Cookies.remove('cart');
    router.push('/');
    
  }
  return (

    <div>
      <Head>
        <title>{title ? title + ' - Ikiguy' : 'Ikiguy'}</title>
        <meta name='description' content='Ecomerce' />
        <link rel='icon' href='/favicon' />
      </Head>

      <ToastContainer position='bottom-center' limit={1} />

      <div className='flex min-h-screen flex-col justify-between'>
        <header>
          <nav className='flex h-12 justify-between shadow-md items-center px-4'>
            <Link href="/" className='text-lg font-bold'>
              ikiguy
            </Link>
            <div>
              <Link href="/cart" className='p-2'>
              Cart
             { cartItemCount > 0 && (
              <span className='ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>
                {cartItemCount}
              </span>
             )}
              </Link>
              
                 {/* { status === "loading" ? ("Loading") :
                  
                    session?.user ? 
                   ( 
                    <Menu as="div" className="relative inline-block">
                      <Menu.Button className="text-orange-600">
                        {session.user.name}
                      </Menu.Button>
                      <Menu.Items className="absolute right-0 w-56 origin-top-right shadow-lg">
                        <Menu.Item>
                          <DropdownLink href="/profile" className="dropdown-link">
                            Profile
                          </DropdownLink>
                        </Menu.Item>
                        <Menu.Item>
                          <DropdownLink href="/order-history" className="dropdown-link">
                            Order History
                          </DropdownLink>
                        </Menu.Item>
                        <Menu.Item>
                          <button href="#" className="dropdown-link w-full" onClick={logoutClickHandler}>
                           Logout!
                          </button>
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                   ) : 
                   (
                    <Link href="/login" className='p-2'>Login</Link>
                   )
                  
                 } */}
                {userInfo ? (
                  <Menu as="div" className="relative inline-block">
                      <Menu.Button className="text-orange-600">
                        {userInfo.name}
                      </Menu.Button>
                      <Menu.Items className="absolute right-0 w-56 origin-top-right shadow-lg">
                        <Menu.Item>
                          <DropdownLink href="/profile" 
                          className="dropdown-link" 
                          // onClick={loginMenuCloseHandler}
                          >
                            Profile
                          </DropdownLink>
                        </Menu.Item>
                        <Menu.Item>
                          <DropdownLink href="/order-history" 
                          className="dropdown-link" 
                          // onClick={loginMenuCloseHandler}
                          >
                            Order History
                          </DropdownLink>
                        </Menu.Item>
                        {
                          userInfo.isAdmin && (
                            <Menu.Item>
                              <DropdownLink href="/admin/dashboard" 
                              className="dropdown-link" 
                              // onClick={loginMenuCloseHandler}
                              >
                                Admin Dashboard
                              </DropdownLink>
                        </Menu.Item>
                          )
                        }
                        <Menu.Item>
                          <button href="#" className="dropdown-link w-full" onClick={logoutClickHandler}>
                           Logout!
                          </button>
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
              
              ) : (
                
                  <Link href="/login">Login</Link>
             
              )}
              
                  {/* dark mode */}
        
             <Button />
            </div>
          </nav>
        </header>
        <main className='container m-auto mt-4 px-4'>{children}
    
        </main>
        <footer className='flex justify-center items-center h-10 shadow-inner'>
          <p>Copyright</p>
          <Link href='/chitiet'>
            chiyet
          </Link>
          <Link href='/dsdsd'>
            dsdsdsd
          </Link>
        </footer>
      </div>
        
    </div>
  )
}

export default Layout;