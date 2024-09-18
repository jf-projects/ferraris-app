'use client';

import React from 'react'

interface Props { 
    error: Error;
    reset: () => void;
}

const ErrorPage = ( { error,reset }: Props ) => {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">500</h1>
                <p className="text-lg">An unexpected Error has occured.</p>
            </div>
        </div>
    </>
  )
}

export default ErrorPage