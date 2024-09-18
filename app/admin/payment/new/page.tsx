'use client';

import BreakDown from '@/app/components/BreakDown';
import PaymentForm from '@/app/components/PaymentForm';
import TransactionForm from '@/app/components/TransactionForm';
import DashboardLayout from '@/app/dashboard/layout';
import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
    searchParams: {
        transactionId: number
    },
}

const PaymentPage = ({searchParams: {transactionId} }: Props) => {
    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 mb-12">
                <div className="w-full md:w-full lg:w-1/2 mt-4 md:mt-0 border border-gray-300 p-4 rounded-md">
                    <h2 className="text-2xl font-bold mb-6 uppercase ">Payment Details</h2>
                    <PaymentForm paymentId={null} transactionId={transactionId} />
                </div>
                <div className="w-full md:w-full lg:w-1/2 mt-4 md:mt-0 border border-gray-300 p-4 rounded-md">
                    <h2 className="text-2xl font-bold mb-6 uppercase ">Payment Breakdown</h2>
                    <BreakDown transactionId={transactionId} paymentId={null}/>
                </div>
            </div>
            <ToastContainer />

        </DashboardLayout>
    )
}

export default PaymentPage