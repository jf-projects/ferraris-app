'use client';

import TransactionForm from '@/app/components/TransactionForm';
import DashboardLayout from '@/app/dashboard/layout';
import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from "next-auth/react";
import NotAuthorized from '@/app/components/NotAuthorize';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import Image from 'next/image';


interface Props {
    params: {
        id: number;
    }

}
const LotTransactionPage = ({ params }: Props) => {
    const { data: session, status } = useSession();
    const [selectedClient, setSelectedClient] = useState<any>(null);

    // Loading state
    if (status === "loading") {
        return <LoadingSpinner />; // Display a loading spinner or any other loading indicator
    }
    return (
        <DashboardLayout>
            <ToastContainer />
            {session?.user.type === 'admin' ?
                <>
                    <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 mb-12">
                        <div className="w-full md:w-full lg:w-2/3 mt-4 md:mt-0 border border-gray-300 p-4 rounded-md">
                            <h2 className="text-2xl font-bold mb-6 uppercase ">Property Information</h2>
                            <TransactionForm setSelectedClient={setSelectedClient} transactionId={params.id} />
                        </div>

                        {selectedClient &&
                            <div className="w-full md:w-full lg:w-1/3 mt-4 md:mt-0 border border-gray-300 p-4 rounded-md">
                                <div className="client-info">
                                    <h2 className="text-2xl font-bold mb-6 uppercase ">Client Information</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-8">
                                        {selectedClient.image &&
                                            <div className="avatar border border-gray-500 rounded-md">
                                                <div className="w-full rounded">
                                                    <Image src={selectedClient.image} alt="Uploaded"
                                                        layout="fill" // or "responsive", "fixed", depending on your needs
                                                    />
                                                </div>
                                            </div>
                                        }

                                        {selectedClient.client_id &&
                                            <div className="avatar border border-gray-500 rounded-md">
                                                <div className="w-full rounded">
                                                    <Image src={selectedClient.client_id} alt="Uploaded"
                                                        layout="fill" // or "responsive", "fixed", depending on your needs
                                                    />
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <div className="divider col-span-3 uppercase font-bold">Client details</div>
                                    <div className="space-y-2">
                                        <table className="min-w-full bg-white border border-gray-200">
                                            <tbody>
                                                <tr className="border-t">
                                                    <td className="border border-gray-200 capitalize px-4">Full Name</td>
                                                    <td className="px-6 py-2 text-gray-900">{selectedClient.firstName}  {selectedClient.lastName} </td>
                                                </tr>
                                                <tr className="border-t">
                                                    <td className="border border-gray-200 capitalize px-4">Gender</td>
                                                    <td className="px-6 py-2 text-gray-900"> {selectedClient.gender} </td>
                                                </tr>
                                                <tr className="border-t">
                                                    <td className="border border-gray-200 capitalize px-4">Birthdate</td>
                                                    <td className="px-6 py-2 text-gray-900"> {new Date(selectedClient.bday).toLocaleDateString('en-US')}</td>
                                                </tr>
                                                <tr className="border-t">
                                                    <td className="border border-gray-200 capitalize px-4">address</td>
                                                    <td className="px-6 py-2 text-gray-900">{selectedClient.address} </td>
                                                </tr>
                                                <tr className="border-t">
                                                    <td className="border border-gray-200 capitalize px-4">civil Status</td>
                                                    <td className="px-6 py-2 text-gray-900">{selectedClient.civilStatus} </td>
                                                </tr>
                                                <tr className="border-t">
                                                    <td className="border border-gray-200 capitalize px-4">email</td>
                                                    <td className="px-6 py-2 text-gray-900">{selectedClient.email} </td>
                                                </tr>
                                                <tr className="border-t">
                                                    <td className="border border-gray-200 capitalize px-4">client Number</td>
                                                    <td className="px-6 py-2 text-gray-900">{selectedClient.clientNumber} </td>
                                                </tr>
                                                <tr className="border-t">
                                                    <td className="border border-gray-200 capitalize px-4">spouse Name</td>
                                                    <td className="px-6 py-2 text-gray-900">{selectedClient.spouseFirstName} {selectedClient.spouseLastName} </td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        }

                    </div>
                </>
                :
                <>
                    <div className="flex flex-col 4">
                        <NotAuthorized />
                    </div>
                </>
            }
        </DashboardLayout>
    )
}

export default LotTransactionPage