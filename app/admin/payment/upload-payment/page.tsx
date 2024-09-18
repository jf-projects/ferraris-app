'use client';

import BreakDown from '@/app/components/BreakDown';
import DashboardLayout from '@/app/dashboard/layout';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';

interface Props {
    searchParams: {
        lotTransactionId: number;
    },
}

interface DataObject {
    paymentDate: string;
    amount: number;
    bank: string;
    remarks: string;
    lotTransactionId: number;
}

interface Transaction {
    id?: number;
    clientId?: number | null;
    propertyUnit?: string;
    totalPropertySize?: number | null;
    type?: string;
    unitBlock?: string;
    unitLot?: string;
    propertyUnitAddress?: string;
    propertyTotalAmount?: number | null;
    downpayment?: number | null;
    paymentTerms?: string;
    incrementValues?: string;
    dueDate?: number | null;
    interest?: number | null;
    sqm?: number | null;
    incrementAmount?: number | null;
    transactionDate?: string; // ISO 8601 string format
    autocompute: number;
    deletedAt?: string | null; // ISO 8601 string format or null
    client: {
        firstName: string;
        lastName: string;
        email: string;
        image: string;
    };
    // Add other fields as necessary
}

const UploadPaymentPage = ({ searchParams: { lotTransactionId } }: Props) => {
    const [csvData, setCsvData] = useState<DataObject[]>([]);
    const [transaction, setTransaction] = useState<Transaction>();

    const fetchTransactions = async () => {
        try {
            const response = await fetch(`/api/lot-transactions/${lotTransactionId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            console.log(result);
            setTransaction(result);
        } catch (error: any) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const romanToNumber = (roman: string): string | null => {
        const romanToValue: { [key: string]: string } = {
            'I': 'January',
            'II': 'February',
            'III': 'March',
            'IV': 'April',
            'V': 'May',
            'VI': 'June',
            'VII': 'July',
            'VIII': 'August',
            'IX': 'September',
            'X': 'October',
            'XI': 'November',
            'XII': 'December'
        };

        return romanToValue[roman] ?? null; // Return null if the input is not valid
    };

    const extractNumber = (value: string): number => {
        const match = value.replace(/[^\d.-]/g, '').match(/-?\d+(\.\d+)?/);
        return match ? parseFloat(match[0]) : 0;
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            console.log('No file selected');
            return;
        }

        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const binaryStr = e.target?.result as string;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const csv = XLSX.utils.sheet_to_csv(worksheet);

            const rows = csv.trim().split('\n').map(row => row.split(','));

            let year = 0;
            const yearArr: DataObject[] = [];

            rows.forEach(item => {
                let datex: string = '';
                let amountx: number = 0;

                if (item[1]?.toUpperCase().includes('YEAR')) {
                    year = Number(item[1].replace('YEAR ', ''));
                    return;
                }

                const month = romanToNumber(item[0]);
                if (month) {
                    datex = `${month}-${year}`;
                    amountx = extractNumber(`${item[2]}${item[3]}`);
                    if (amountx > 0) {
                        const obj: DataObject = {
                            paymentDate: datex,
                            amount: amountx,
                            bank: item[4],
                            remarks: item[5],
                            lotTransactionId: Number(lotTransactionId)
                        };
                        yearArr.push(obj);
                    }
                }
            });

            const totalAmount = yearArr.reduce((sum, item) => sum + item.amount, 0);
            setCsvData(yearArr); // Set the CSV data in state
        };

        reader.onerror = (error) => {
            console.error('File reading error:', error);
        };

        reader.readAsBinaryString(file);
    };

    const uploadPayment = async (event: { preventDefault: () => void; }) => {

        event.preventDefault(); // Prevent default form submission

        console.log(JSON.stringify(csvData))
        try {
            // Update an existing client
            const response = await fetch('/api/payment/multiple', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(csvData),
            });
            console.log(response)

            if (response.ok) {
                toast.success('ok');
            } else {
                toast.error("Upload failed: Payments for this transaction already exist. Please review the existing records or try again.");
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <DashboardLayout>
            <h2 className="text-2xl font-bold uppercase mb-6 md:mb-0">Upload Initial Payments</h2>
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-1/2 mt-4 border border-gray-300 p-4 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="col-span-3">
                            <h2 className='text-2xl font-bold pb-2'>Transaction Information</h2>

                            <table className="table table-xs  min-w-full bg-white border border-gray-300 mb-10">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border border-gray-400"></th>
                                        <th className="py-2 px-4 border border-gray-400">VALUE</th>
                                    </tr>

                                </thead>
                                <tbody>
                                    <tr>
                                        <th className="py-2 px-4 border border-gray-400">Transaction ID</th>
                                        <td className="py-2 px-4 border border-gray-400">{transaction?.id || ''}</td>
                                    </tr>
                                    <tr>
                                        <th className="py-2 px-4 border border-gray-400">Client</th>
                                        <td className="py-2 px-4 border border-gray-400">{`${transaction?.client.firstName} ${transaction?.client.lastName}` || ''}</td>
                                    </tr>

                                    <tr>
                                        <th className="py-2 px-4 border border-gray-400">Client Picture</th>
                                        <td className="py-2 px-4 border border-gray-400">
                                            <div className="avatar border border-gray-500 rounded-md">
                                                <div className="max-w-32 rounded">
                                                    <Image src={transaction?.client.image || ''} layout='fill' alt="Uploaded" />
                                                </div>
                                        </div>u
                                        </td>
                                    </tr>


                                    <tr>
                                        <th className="py-2 px-4 border border-gray-400">Email</th>
                                        <td className="py-2 px-4 border border-gray-400">{`${transaction?.client.email}` || ''}</td>
                                    </tr>

                                    <tr>
                                        <th className="py-2 px-4 border border-gray-400">Property</th>
                                        <td className="py-2 px-4 border border-gray-400">{transaction?.propertyUnit || ''}</td>
                                    </tr>
                                    <tr>
                                        <th className="py-2 px-4 border border-gray-400">Property Size</th>
                                        <td className="py-2 px-4 border border-gray-400">{transaction?.totalPropertySize || ''}</td>
                                    </tr>
                                    <tr>
                                        <th className="py-2 px-4 border border-gray-400">Property Address</th>
                                        <td className="py-2 px-4 border border-gray-400">{transaction?.propertyUnitAddress || ''}</td>
                                    </tr>
                                    <tr>
                                        <th className="py-2 px-4 border border-gray-400">Total Property Amount</th>
                                        <td className="py-2 px-4 border border-gray-400">{transaction?.propertyTotalAmount || ''}</td>
                                    </tr>
                                    <tr>
                                        <th className="py-2 px-4 border border-gray-400">Payment Terms</th>
                                        <td className="py-2 px-4 border border-gray-400">{transaction?.paymentTerms || ''} Years</td>
                                    </tr>

                                    <tr>
                                        <th className="py-2 px-4 border border-gray-400">Interest</th>
                                        <td className="py-2 px-4 border border-gray-400">{transaction?.interest || ''}%</td>
                                    </tr>


                                </tbody>
                            </table>

                            <div className='m-8'>
                                <BreakDown transactionId={lotTransactionId} paymentId={null} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 mt-4 border border-gray-300 p-4 rounded-md space-y-2">
                    <h2 className='text-2xl font-bold pb-2'>Upload Excel File</h2>
                    <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                    {csvData.length > 0 &&
                        <>
                            <div className="flex flex-col lg:flex-row gap-4">
                                <h2>Excel File Data</h2>
                                <button className="btn btn-xs btn-neutral" onClick={uploadPayment}>Upload</button>
                            </div>

                            <table className="table table-xs  min-w-full bg-white border border-gray-300">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b border-gray-400">Date</th>
                                        <th className="py-2 px-4 border-b border-gray-400">Amount</th>
                                        <th className="py-2 px-4 border-b border-gray-400">Bank</th>
                                        <th className="py-2 px-4 border-b border-gray-400">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {csvData.map((item, index) => (
                                        <tr key={index}>
                                            <td className="py-2 px-4 border-b border-gray-400">{item.paymentDate}</td>
                                            <td className="py-2 px-4 border-b border-gray-400">₱{item.amount.toLocaleString()}</td>
                                            <td className="py-2 px-4 border-b border-gray-400">{item.bank}</td>
                                            <td className="py-2 px-4 border-b border-gray-400">{item.remarks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    }
                </div>
            </div>
            <ToastContainer />
        </DashboardLayout>
    );
};

export default UploadPaymentPage;
