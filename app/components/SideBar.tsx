import React from 'react'

const SideBar = () => {
    return (
        <div className='fixed ml-3'>
            <div className="bg-transparent h-screen flex justify-center items-center">
                <div className="flex w-16 flex-col items-center">
                    <div className="space-y-48 rounded-md bg-slate-50">
                        <ul>
                            <li className="p-5">
                                <svg className="h-6 w-6 cursor-pointer text-gray-500 transition-all hover:text-blue-600"
                                    width={24} height={24} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <path d="M9 22V12h6v10" />
                                    <title>Dashboard</title>
                                </svg>
                            </li>
                            <li className="p-5">
                                <svg className="h-6 w-6 cursor-pointer text-gray-500 transition-all hover:text-blue-600"
                                    width={24} height={24} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <path d="M8.5 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z" />
                                    <path d="M20 8v6" />
                                    <path d="M23 11h-6" />
                                    <title>Clients</title>
                                </svg>
                            </li>
                            <li className="p-5">

                            </li>
                            <li className="p-5">

                            </li>
                            <li className="p-5">
                            </li>
                            <li className="p-5">

                            </li>
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