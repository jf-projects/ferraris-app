import React, { useEffect, useState } from 'react'

const SideBar = () => {
    const [currentPath, setCurrentPath] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // This code runs only in the browser
            const path = window.location.pathname;
            setCurrentPath(path);
        }
    }, []);
    const menuItems = [
        {
            path: '/', icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <path d="M9 22V12h6v10" />
                    <title>Dashboard</title>
                </svg>
            )
        },
        {
            path: '/admin/client', icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <path d="M8.5 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z" />
                    <title>Clients</title>
                </svg>
            )
        },
        {
            path: '/admin/lot-transactions', icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    <title>Transactions</title>
                </svg>
            )
        },
        {
            path: '/admin/payment', icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="m23 6-9.5 9.5-5-5L1 18"></path>
                    <path d="M17 6h6v6"></path>
                    <title>Payment</title>
                </svg>
            )
        },
        {
            path: '/admin/report', icon: (
                <svg className="h-6 w-6 cursor-pointer text-gray-500 transition-all hover:text-blue-600"
                    width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <path d="M13 2v7h7"></path>
                    <title>Report</title>
                </svg>
            )
        },
        {
            path: '/admin/user', icon: (
                <svg className="h-6 w-6 cursor-pointer text-gray-500 transition-all hover:text-blue-600"
                    width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <path d="M9 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z"></path>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    <title>Users</title>
                </svg>
            )
        },
    ];

    return (
        <div className='fixed ml-3'>
            <div className="bg-transparent h-screen flex justify-center items-center">
                <div className="flex w-16 flex-col items-center">
                    <div className="space-y-48 rounded-md bg-slate-50">
                        <ul>
                            {menuItems.map(item => (
                                <li className={`p-5 ${currentPath === item.path ? 'text-blue-600' : 'text-gray-500'}`} key={item.path} >
                                    <a href={item.path}>
                                        {item.icon}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className="flex items-center justify-center pb-5">
                            <svg className="h-6 w-6 cursor-pointer text-gray-500 transition-all hover:text-blue-600"
                                width={24} height={24} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <path d="m16 17 5-5-5-5" />
                                <path d="M21 12H9" />
                                <title>Sign out</title>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideBar