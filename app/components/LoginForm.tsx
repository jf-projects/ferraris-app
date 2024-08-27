'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false
            })

            if (res?.error) {
                setError('Invalid Credentials')
                return
            }

            router.replace('admin/client')
        } catch (error) {
            console.log(error);
        }
    }

    return <div className='grid place-items-center h-screen'>
        <div className='shadow-lg p-5 rounded-lg border-t-4
        border-green-600'>
            <h1 className='text-center text-xl font-bold m-4'>Ferraris System</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                <input onChange={e => setEmail(e.target.value)} type="text" placeholder='Email' />
                <input onChange={e => setPassword(e.target.value)} type="password" placeholder='Password' />
                <button className='bg-green-600 text-white font-bold cursor-pointer px-6 py-2'>Login</button>
                {error && (
                    <div className=' bg-red-500 text-white w-fit text-sm py-1 px-4 rounded-md mt-2'>{error}</div>
                )}
            </form>
        </div>
    </div>
}

export default LoginForm