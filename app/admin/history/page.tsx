'use client';

import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../dashboard/layout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactToPrint from 'react-to-print';

interface Props {
    searchParams: {
        itemID: number,
        model: string
    },
}

const HistoryPage = ({ searchParams: { itemID, model } }: Props) => {
    const componentRef = React.useRef<HTMLDivElement>(null);
    const [history, setHistory] = useState<any[]>([]);


    const fetchHistory = async () => {
        try {
            const response = await fetch(`/api/history?model=${model}&itemID=${itemID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setHistory(data);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    useEffect(() => {
        fetchHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <div className="col-span-3">
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
                    <div className="flex flex-col">
                        <div className="mb-2 p-2 border border-gray-200 rounded">
                            <div className="text-gray-600">
                                <div><strong>Model:</strong> {model}</div>
                                <div><strong>ID:</strong> {itemID}</div>
                            </div>
                        </div>
                    </div>
                    <div ref={componentRef} className='p-4'>
                        {history.length > 0 &&
                            <div className="max-h-[30rem] overflow-y-auto print:max-h-full print:overflow-y-visible px-6">
                                <table className="table table-xs table-pin-rows table-pin-cols">
                                    <thead>
                                        <tr>
                                            <td>ID</td>
                                            <td>Action</td>
                                            <td>Values</td>
                                            <td>Updated By</td>
                                            <td>Updated Date</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history!.map((item) => {
                                            let logData: [];

                                            try {
                                                // Parse JSON if needed (assuming item.transaction is a JSON string)
                                                logData = JSON.parse(item.newValue);
                                            } catch (error) {
                                                console.error('Error parsing JSON:', error);
                                                logData = []; // Fallback to an empty object in case of parsing error
                                            }
                                            return (
                                                <tr key={item.id}>
                                                    <td>{item.id}</td>
                                                    <td>{item.action}</td>
                                                    <td>
                                                        <div className="flex flex-col">
                                                            <table>
                                                                <tr>
                                                                    <th style={{ width: '33%' }}>Field</th>
                                                                    <th style={{ width: '33%' }}>Old Value</th>
                                                                    <th style={{ width: '34%' }}>New Value</th>
                                                                </tr>
                                                                {logData.map((item: any, index: number) => {
                                                                    return (
                                                                        <tr key={index} className={index % 2 === 0 ? 'bg-slate-50' : ''} >
                                                                            <td> {item.field}</td>
                                                                            <td> {item.oldValue}</td>
                                                                            <td> {item.newValue}</td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </table>

                                                        </div>
                                                    </td>
                                                    <td>{item.user ? item.user.name : ''} - {item.user ? item.user.email : ''}</td>
                                                    <td>{formatDate(item.timestamp)}</td>
                                                </tr>
                                            );
                                        })}
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

export default HistoryPage;
