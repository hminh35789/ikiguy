
import React from 'react'
import {router} from "next/router"
function diachi() {
     
  return (
    <div>
        <h1>dia    chi</h1>
        <button onClick={() => router.back()}>Back</button>
        {
            <h1>{localStorage.getItem('pos')}</h1>
            
        }
    </div>
  )
}

export default diachi