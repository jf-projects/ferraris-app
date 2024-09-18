'use client';
import React, { useEffect } from 'react'
import LoginForm from '../components/LoginForm'

const Login = () => {
  useEffect(() => {
    console.log('sss')
  }, []);

  return (
    <div>
       <LoginForm/>
    </div>
  )
}

export default Login