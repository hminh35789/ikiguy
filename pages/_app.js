import '../styles/globals.css'
import { StoreProvider } from '../utils/Store'
import { ThemeProvider } from "next-themes"
import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
  return (
    
      <StoreProvider>
      <ThemeProvider attribute='class'>
       
           <Component {...pageProps} />
         
      </ThemeProvider>
      
      </StoreProvider>
    
    
  )
  
}


export default MyApp
