'use client';

import BreakDown from '@/app/components/BreakDown';
import PaymentForm from '@/app/components/PaymentForm';
import TransactionForm from '@/app/components/TransactionForm';
import DashboardLayout from '@/app/dashboard/layout';
import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from "next-auth/react";
import NotAuthorized from '@/app/components/NotAuthorize';
import LoadingSpinner from '@/app/components/LoadingSpinner';

interface Props {
    params: {
        id: number;
    }
}


interface Payment {
    id: number;
    lotTransactionId: number;
}
const PaymentPage = ({ params: { id } }: Props) => {
    const { data: session, status } = useSession();
    const [payment, setPayment] = useState<Payment | null>(null);

    const fetchPayment = async () => {
        try {
            const response = await fetch(`/api/payment/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            console.log(result);
            setPayment(result);
        } catch (error: any) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchPayment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    // Loading state
    if (status === "loading") {
        return <LoadingSpinner />; // Display a loading spinner or any other loading indicator
    }
    return (
        <DashboardLayout>
            {session?.user.type === 'admin' ?
                <>
                    <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 mb-12">
                        <div className="w-full md:w-full lg:w-1/2 mt-4 md:mt-0 border border-gray-300 p-4 rounded-md">
                            <h2 className="text-2xl font-bold mb-6 uppercase ">Payment Details</h2>
                            <PaymentForm transactionId={null} paymentId={id} />
                        </div>
                        <div className="w-full md:w-full lg:w-1/2 mt-4 md:mt-0 border border-gray-300 p-4 rounded-md">
                            <h2 className="text-2xl font-bold mb-6 uppercase ">Payment Breakdown</h2>
                            {payment && (
                                <BreakDown transactionId={payment.lotTransactionId} paymentId={id} />
                            )}
                        </div>
                    </div>
                </>
                :
                <>
                    <div className="flex flex-col 4">
                        <NotAuthorized />
                    </div>
                </>
            }
            <ToastContainer />
        </DashboardLayout>
    )
}

export default PaymentPage