'use client';

import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../dashboard/layout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactToPrint from 'react-to-print';

interface ReportProps {
    start_date?: string;
    end_date: string;
}

const ReportPage = () => {
    const componentRef = React.useRef<HTMLDivElement>(null);
    const [payments, setPayments] = useState<any[]>([]);
    const [totalPayment, setTotalPayment] = useState<number>(0);
    const [form, setForm] = useState<ReportProps>({
        start_date: new Date().toISOString().split('T')[0], // Initialize with today's date
        end_date: new Date().toISOString().split('T')[0]
    });

    // Function to get today's date in YYYY-MM-DD format


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        // Update form state
        setForm((prevForm) => ({
            ...prevForm,
            [id]: value
        }));


    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent the default form submission
        fetchPayments();
    };

    const fetchPayments = async () => {
        try {
            const formattedDates = {
                start_date: form.start_date ? new Date(`${form.start_date}T00:00:00.000Z`).toISOString() : undefined,
                end_date: form.end_date ? new Date(`${form.end_date}T00:00:00.000Z`).toISOString() : undefined
            };

            const response = await fetch('/api/payment/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedDates),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data)

            let total = data.reduce((sum: any, item: { amount: number; }) => sum + Number(item.amount), 0).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
            setTotalPayment(total);
            setPayments(data);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    useEffect(() => {
        // fetchPayments();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
    };
    return (
        <DashboardLayout>
            <ToastContainer />





            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className="flex flex-col">
                                <label htmlFor="start_date" className="text-sm font-semibold mb-1">Start Date:</label>
                                <input
                                    id="start_date"
                                    type="date"
                                    value={form.start_date}
                                    className="p-2 border border-gray-300 rounded-md w-full"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="end_date" className="text-sm font-semibold mb-1">End Date:</label>
                                <input
                                    id="end_date"
                                    type="date"
                                    value={form.end_date}
                                    className="p-2 border border-gray-300 rounded-md w-full"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mt-6 space-x-3">
                                <button
                                    type="submit"
                                    className="btn btn-outline btn-sm"
                                >
                                    Create Report
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="">
                    <div className='flex justify-end p-3'>
                        <ReactToPrint
                            trigger={() => <button className='btn btn-neutral btn-sm'>Print</button>}
                            content={() => componentRef.current}
                        />
                    </div>
                </div>
            </div>


            <div className="flex flex-col space-x-0 md:space-x-4">
                <div className="w-full md:w-full lg:w-full mt-4 md:mt-0 border border-gray-300 rounded-md" >
                    <div ref={componentRef} className='p-4'>
                        <div className='flex flex-col items-center'>
                            <h1 className="text-4xl font-bold">Ferraris & Engineers Ville</h1>
                            <h3>Cutud, Angeles City</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4 p-7">
                            <div className="flex flex-col items-start">
                                <h1 className="text-xl font-bold">Payment Report</h1>
                                <div className="flex items-center">
                                    <span className="text-sm font-semibold mr-2">Date:</span>
                                    <span className="text-sm">
                                        {form.start_date ? formatDate(form.start_date) : ''} -
                                        {form.end_date ? formatDate(form.end_date) : ''}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-start">
                                <span className="text-sm font-semibold mr-2">Total Amount:</span>
                                <span className="text-sm">{totalPayment}</span>
                            </div>
                        </div>

                        {payments.length > 0 &&
                            <div className="max-h-[30rem] overflow-y-auto print:max-h-full print:overflow-y-visible px-6">
                                <table className="table table-md table-pin-rows table-pin-cols ">
                                    <thead>
                                        <tr>
                                            <td>ID</td>
                                            <td>Client Name</td>
                                            <td>Property</td>
                                            <td>Amount</td>
                                            <td>Payment Date</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments!.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.transaction.client.firstName} {item.transaction.client.lastName}</td>
                                                <td>{item.transaction.propertyUnit}</td>
                                                <td>{Number(item.amount).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</td>
                                                <td>{formatDate(item.paymentDate)}</td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ReportPage;
