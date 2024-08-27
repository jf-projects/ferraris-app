'use client';
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

const Navbar = () => {
    const { status, data: session } = useSession();

    const handleSignOut = async () => {
        await signOut({ redirect: false }); // Prevent automatic redirection by NextAuth
        window.location.href = '/api/auth/signin'; // Redirect to sign-in page manually
    };

    return (
        <>
            <div className="navbar bg-slate-50 fixed z-50">
                <div className="flex-1">
                    {/* <a className="btn btn-ghost text-xl capitalize">Hi {session?.user?.name}</a> */}
                    <a className="btn btn-ghost text-xl capitalize">Ferraris App</a>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        {status === 'authenticated' && (
                            <button className='mr-3' onClick={handleSignOut}>
                                Signout
                            </button>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Navbar;
