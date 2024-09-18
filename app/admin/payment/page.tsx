'use client';

import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../dashboard/layout';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import DocxDownloader from '@/app/components/ContractButton';
import { ExportAsPdf, PrintDocument } from "react-export-table";
import DeleteModal from '@/app/components/DeleteModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from "next-auth/react";
import { faEdit, faTrash, faHistory } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const PaymentPage = () => {
    const { data: session, status } = useSession();

    const [payments, setPayments] = useState([]);
    const [exportedPayments, setExportedPayments] = useState([]);
    const [selectedId, setSelectedId] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchPayments = async () => {
        try {
            const response = await fetch('/api/payment');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();

            const transformedRows = result.map((row: {
                transaction: any; amount: string | number | bigint;
            }) => ({
                ...row,
                formatted_amount: new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(row.amount)),
                property: row.transaction.propertyUnit,
            }));

            const reorderedPayments = transformedRows.map((item: {
                amount: any;
                remarks: any;
                paymentDate: any;
                property: any; id: any;
            }) => ({
                id: item.id,
                property: item.property,
                amount: item.amount,
                remarks: item.remarks,
                paymentDate: new Date(item.paymentDate).toLocaleDateString('en-CA')
            }));

            console.log(transformedRows)
            setExportedPayments(reorderedPayments);
            setPayments(transformedRows)
        } catch (error: any) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        fetchPayments();
    }, []);


    const handleOpenModal = (id: number) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleDelete = async () => {
        if (selectedId === null) return;

        try {
            const response = await fetch(`/api/payment/${selectedId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const data = await response.json();
                toast.success('Payment was deleted successfully!');
                fetchPayments();
            } else {
                console.error('Error submitting form:', response.statusText);
            }

        } catch (error: any) {
            console.error('Error fetching data:', error);
        }

        setIsModalOpen(false);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'property', headerName: 'Property', width: 250 },
        { field: 'amount', headerName: 'Amount', width: 200, editable: false },
        { field: 'bank', headerName: 'Remarks', width: 300, editable: false },
        { field: 'paymentDate', headerName: 'Date', width: 150, editable: false },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 300,
            sortable: false,
            disableExport: true,
            renderCell: (params: any) => (
                <div className='space-x-2'>
                    {session?.user.type === 'admin' &&
                        <>
                            <a
                                className="btn btn-xs btn-success text-white px-2 py-1 rounded hover:bg-blue-600"
                                href={`/admin/payment/${params.row.id}`} title="Edit Payment"
                            >
                                <FontAwesomeIcon icon={faEdit} />

                            </a>

                            <button
                                className="btn btn-xs btn-error text-white px-2 py-1 rounded hover:bg-red-600"
                                onClick={() => handleOpenModal(params.row.id)} title='Delete Payment'
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </>
                    }
                    <a href={`/admin/history?model=Payment&itemID=${params.row.id}`}
                        className="btn btn-xs btn-outline  px-2 py-1 rounded" title='View History'
                    >
                        <FontAwesomeIcon icon={faHistory} />
                    </a>
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
            <ToastContainer />

            <DeleteModal isOpen={isModalOpen} onClose={handleCloseModal} onDelete={handleDelete} />
            <div className="flex flex-col md:flex-row space-x-0 md:space-x-4">
                <div className="w-full md:w-full lg:w-full border border-gray-300 p-4 rounded-md">
                    <div className='flex items-center my-6 space-x-4'>
                        <h2 className="text-2xl font-bold ">Payments</h2>
                        {/* <a className="btn btn-outline btn-sm" href="/admin/lot-transactions/new">Add Payment</a> */}
                    </div>

                    <div className='mb-2 flex space-x-1 justify-end'>
                        <ExportAsPdf
                            data={exportedPayments!}
                            headers={["ID", "Property", "Amount", "Remarks", "Date"]}
                            headerStyles={{ fillColor: "green" }}
                            title="Payment List"
                            fileName={"Payments-"+getFormattedDate()}
                        >
                            {(props) => (
                                <button {...props} className='btn btn-xs btn-outline'>
                                    Export as PDF
                                </button>
                            )}
                        </ExportAsPdf>
                        <PrintDocument
                            data={exportedPayments!}
                            headers={["ID", "Property", "Amount", "Remarks", "Date"]}
                            title="Payment List"
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
                            rows={payments}
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

export default PaymentPage