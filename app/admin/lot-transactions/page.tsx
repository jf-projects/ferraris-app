'use client';

import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../dashboard/layout';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import DocxDownloader from '@/app/components/ContractButton';
import { ExportAsPdf, PrintDocument } from "react-export-table";
import DeleteModal from '@/app/components/DeleteModal';
import { toast } from 'react-toastify';
import { useSession } from "next-auth/react";
import { faEdit, faTrash, faHistory, faMoneyBill1Wave, faUpload, faPercentage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InterestModal from '@/app/components/InterestModal';

const LotTransactionPage = () => {
    const { data: session, status } = useSession();

    const [transactions, setTransactions] = useState<any[]>([]);
    const [transactionsExport, setTransactionsExport] = useState();
    const [selectedId, setSelectedId] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInterestModalOpen, setInterestModalOpen] = useState(false);
    const [interestDate, setInterestDate] = useState('');


    const fetchTransactions = async () => {
        try {
            const response = await fetch('/api/lot-transactions');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();

            const transformedRows = result.map((row: {
                client: any; propertyTotalAmount: number, interest: number
            }) => ({
                ...row,
                fullName: row.client ? `${row.client.firstName} ${row.client.lastName}` : '',
                formatted_amount: new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(row.propertyTotalAmount),
                formatted_interest: `${row.interest}%`,
            }));

            const reorderedClients = result.map((item: {
                paymentTerms: any; id: any; client: { firstName: any; middleName: any; lastName: any; }; propertyUnit: any; propertyUnitAddress: any; propertyTotalAmount: number | bigint; interest: any;
            }) => ({
                id: item.id,
                fullName: item.client ? `${item.client.firstName} ${item.client.middleName} ${item.client.lastName}` : '',
                propertyUnit: item.propertyUnit,
                propertyUnitAddress: item.propertyUnitAddress,
                amount: `P${new Intl.NumberFormat('en-PH', { style: 'decimal' }).format(item.propertyTotalAmount)}`,
                interest: `${item.interest}%`,
                paymentTerms: `${item.paymentTerms}`

            }));
            setTransactionsExport(reorderedClients);
            setTransactions(transformedRows);
        } catch (error: any) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        fetchTransactions();
    }, []);


    const handleOpenModal = (id: number) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };

    const handleOpenInterestModal = (id: number) => {
        setSelectedId(id);

        let selected = transactions.find(transaction => transaction.id === id);
        selected.interestDate ? setInterestDate(new Date(selected.interestDate).toISOString().split('T')[0] ) : setInterestDate('');
        setInterestModalOpen(true);
    };

   

    const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { value } = e.target;
        setInterestDate(value)
    };

    const handleInterestCloseModal = () => {
        setInterestModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleDelete = async () => {
        if (selectedId === null) return;

        try {
            const response = await fetch(`/api/lot-transactions/${selectedId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const data = await response.json();
                toast.success('Client was deleted successfully!');
                fetchTransactions();
            } else {
                console.error('Error submitting form:', response.statusText);
            }

        } catch (error: any) {
            console.error('Error fetching data:', error);
        }

        setIsModalOpen(false);
    };

    const onSaveInterest = async () => {
        if (selectedId === null) return;
        var data = {
            id: selectedId,
            interestDate: interestDate
        }
        console.log(JSON.stringify(data),'adas')

        // try {
        //     const response = await fetch(`/api/lot-transactions/${selectedId}`, {
        //         method: 'DELETE',
        //     });

        //     if (response.ok) {
        //         const data = await response.json();
        //         toast.success('Client was deleted successfully!');
        //         fetchTransactions();
        //     } else {
        //         console.error('Error submitting form:', response.statusText);
        //     }

        // } catch (error: any) {
        //     console.error('Error fetching data:', error);
        // }

        setInterestModalOpen(false);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        {
            field: 'fullName',
            headerName: 'Full Name',
            width: 150,
        },
        { field: 'propertyUnit', headerName: 'Property', width: 200, editable: false },
        { field: 'propertyUnitAddress', headerName: 'Address', width: 300, editable: false },
        { field: 'formatted_amount', headerName: 'Amount', width: 150, editable: false },
        { field: 'paymentTerms', headerName: 'Payment Terms', width: 100, editable: false },
        { field: 'formatted_interest', headerName: 'Interest', width: 100, editable: false },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 350,
            sortable: false,
            disableExport: true,
            renderCell: (params: any) => (
                <div className='space-x-2'>
                    <a
                        className="btn btn-xs btn-neutral text-white px-2 py-1 " title="Add Payment"
                        href={`/admin/payment/new?transactionId=${params.row.id}`}
                    >
                        <FontAwesomeIcon icon={faMoneyBill1Wave} />
                    </a>
                    {session?.user.type === 'admin' &&
                        <>
                            <a
                                className="btn btn-xs btn-success text-white px-2 py-1 " title="Edit Transaction"
                                href={`/admin/lot-transactions/${params.row.id}`}
                            >
                                <FontAwesomeIcon icon={faEdit} />
                            </a>


                            <button
                                className="btn btn-xs btn-error text-white px-2 py-1 rounded hover:bg-red-600 " title="Delete Transaction"
                                onClick={() => handleOpenModal(params.row.id)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>

                            <button
                                className={`btn btn-xs ${params.row.interestDate ? 'bg-green-400 hover:bg-green-600' : 'bg-slate-400 hover:bg-slate-600'} text-white px-2 py-1 rounded}`} title="Interest Implementation Date"
                                onClick={() => handleOpenInterestModal(params.row.id)}
                            >
                                <FontAwesomeIcon icon={faPercentage} />
                            </button>
                        </>
                    }

                    <a href={`/admin/history?model=LotTransaction&itemID=${params.row.id}`}
                        className="btn btn-xs btn-outline px-2 py-1 rounded " title="View History"
                    >
                        <FontAwesomeIcon icon={faHistory} />
                    </a>

                    <a href={`/admin/payment/upload-payment?lotTransactionId=${params.row.id}`}
                        className="btn btn-xs btn-warning  text-white px-2 py-1 rounded " title="Upload Payments"
                    >
                        <FontAwesomeIcon icon={faUpload} />
                    </a>
                    
                    <DocxDownloader params={params.row} />
                </div>
            ),
        },
    ];

    function getFormattedDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }


    return (
        <DashboardLayout>
            <DeleteModal isOpen={isModalOpen} onClose={handleCloseModal} onDelete={handleDelete}  />
            <InterestModal isOpen={isInterestModalOpen} onClose={handleInterestCloseModal} onSave={onSaveInterest} interestDate={interestDate} changeInterest={handleInterestChange} />
            <div className="flex flex-col md:flex-row space-x-0 md:space-x-4">
                <div className="w-full md:w-full lg:w-full border border-gray-300 p-4 rounded-md">
                    <div className='flex items-center my-6 space-x-4'>
                        <h2 className="text-2xl font-bold ">Property List</h2>
                        <a className="btn btn-outline btn-sm" href="/admin/lot-transactions/new">Add Transaction</a>
                    </div>

                    <div className='mb-2 flex space-x-1 justify-end'>
                        <ExportAsPdf
                            data={transactionsExport!}
                            headers={["ID", "Full Name", "Property", "Address", "Amount", "Interest", "Payment Terms (Yrs)"]}
                            headerStyles={{ fillColor: "green" }}
                            title="Transaction List"
                            fileName={"Transaction-List-" + getFormattedDate()}
                        >
                            {(props) => (
                                <button {...props} className='btn btn-xs btn-outline'>
                                    Export as PDF
                                </button>
                            )}
                        </ExportAsPdf>
                        <PrintDocument
                            data={transactionsExport!}
                            headers={["ID", "Full Name", "Property", "Address", "Amount", "Interest", "Payment Terms (Yrs"]}
                            title="Transaction List"
                        >
                            {(props) => (
                                <button {...props} className='btn btn-xs btn-outline'>
                                    Print
                                </button>
                            )}
                        </PrintDocument>
                    </div>
                    <div style={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rowHeight={40}
                            slots={{
                                toolbar: CustomToolbar,
                            }}
                            rows={transactions}
                            columns={columns}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 10 } },
                            }}
                            pageSizeOptions={[5, 10, 25]}
                        />
                    </div>

                </div>
            </div>
        </DashboardLayout>
    )
}

function CustomToolbar() {
    return (
        <GridToolbarContainer style={{ display: 'flex', justifyContent: 'space-between' }}>
            <GridToolbarQuickFilter
                quickfilterprops={{
                    debounceMs: 500, // Delay in ms before filtering starts
                }}
            />
        </GridToolbarContainer>
    );
}

export default LotTransactionPage