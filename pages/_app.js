import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import '../styles/globals.css'
import { StoreProvider } from '../utils/Store'
import { ThemeProvider } from "next-themes"
  

function MyApp({ Component, pageProps }) {
  return (
    
      <StoreProvider>

        <ThemeProvider attribute='class'>

          <PayPalScriptProvider deferLoading={true}>

            <Component {...pageProps} />

          </PayPalScriptProvider>
              
          
        </ThemeProvider>
        
      </StoreProvider>
    
    
  )
  
}


export default MyApp
