'use client'
import React from 'react'

function Unauthorised() {
  return (
    <div className="bg-black w-screen h-screen">
        <div className='text-white flex flex-col items-center justify-center font-semibold'>
        <h1 className='text-6xl'>Unauthorised</h1>
        <p className='text-3xl'>You are not authorised to view this page.</p>
        </div>
    </div>
  )
}

export default Unauthorised