
import React from 'react'

function chitiet() {
     
  return (
    <div>
        <h1>chitiet</h1>
        <button onClick={() => history.back()}>Back</button>
        {
            <h1>{localStorage.getItem('pos')}</h1>
            
        }
    </div>
  )
}

export default chitiet