// pages/client/ClientPage.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../dashboard/layout';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteModal from '@/app/components/DeleteModal';
import { ExportAsPdf, PrintDocument } from "react-export-table";
import { UserProps } from '@/app/interfaces/UserProps';
import UserForm from '@/app/components/UserForm';
import { useSession } from "next-auth/react";
import NotAuthorized from '@/app/components/NotAuthorize';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { faEdit, faTrash, faHistory, faMoneyBill1Wave, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const ClientPage = () => {
    const { data: session, status } = useSession();



    const [users, setUsers] = useState<any[]>([]);
    const [usersExport, setUsersExport] = useState<any[]>([]);
    const [userID, setUserID] = useState<string>('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number>();

    const [form, setForm] = useState<UserProps>({
        id: undefined,
        name: '',
        email: '',
        type: '',
        password: '',
    });

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const resetUserForm = () => {
        setForm({
            id: undefined,
            name: '',
            email: '',
            type: '',
            password: '',
        });


    };

    const handleEdit = (id: number) => {
        const item = users.find(user => user.id === id);
        if (item) {
            setForm({
                id: item.id,
                name: item.name,
                email: item.email,
                type: item.type,
                password: item.password,
            });
            setUserID(item.id);
        }
    };

    const capitalize = (str: string) => {
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };
    const fetchData = async () => {
        try {
            const response = await fetch('/api/user');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            const reorderedUser = result.map((item: { id: any; name: string; email: any; type: string; }) => ({
                id: item.id,
                name: `${capitalize(item.name)}`,
                email: item.email,
                type: capitalize(item.type),
            }));

            setUsers(result);
            setUsersExport(reorderedUser);
        } catch (error: any) {
            console.error('Error fetching data:', error);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 150, editable: false },
        { field: 'type', headerName: 'Type', width: 150, editable: false },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 250,
            sortable: false,
            disableExport: true,
            renderCell: (params: any) => (
                <div className='space-x-2'>

                    <button
                        className="btn btn-xs btn-success text-white px-2 py-1 rounded hover:bg-blue-600"
                        onClick={() => handleEdit(params.row.id)} title='Edit User'
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </button>

                    <button
                        className="btn btn-xs btn-error text-white px-2 py-1 rounded hover:bg-red-600"
                        onClick={() => handleOpenModal(params.row.id)} title='Delete User'
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>

                    <a href={`/admin/history?model=User&itemID=${params.row.id}`}
                        className="btn btn-xs btn-outline  px-2 py-1 rounded" title='View History'
                    >
                        <FontAwesomeIcon icon={faHistory} />
                    </a>
                </div>
            ),
        },
    ];

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            const response = await fetch(`/api/user/${selectedId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data)
                toast.success('User was deleted successfully!');
                fetchData();
            } else {
                console.error('Error submitting form:', response.statusText);
            }

        } catch (error: any) {
            console.error('Error fetching data:', error);
        }

        setIsModalOpen(false);
    };

    // Loading state
    if (status === "loading") {
        return <LoadingSpinner />; // Display a loading spinner or any other loading indicator
    }

    return (
        <DashboardLayout>
            <ToastContainer />
            <DeleteModal isOpen={isModalOpen} onClose={handleCloseModal} onDelete={handleDelete} />
            {session?.user.type === 'admin' ?
                <>
                    <div className="flex flex-col md:flex-row space-x-0 md:space-x-4">
                        <div className="w-full md:w-full lg:w-1/2 border border-gray-300 p-4 rounded-md">
                            <div className='flex items-center my-6 space-x-4'>
                                <h2 className="text-2xl font-bold ">User List</h2>
                                <button className="btn btn-outline btn-sm" onClick={resetUserForm}>Add User</button>
                            </div>

                            <div className='mb-2 flex space-x-1 justify-end'>
                                <ExportAsPdf
                                    data={usersExport}
                                    headers={["ID", "Name", "Email", "Type"]}
                                    headerStyles={{ fillColor: "green" }}
                                    title="User List"
                                    fileName="User-List"
                                >
                                    {(props) => (
                                        <button {...props} className='btn btn-xs btn-outline'>
                                            Export as PDF
                                        </button>
                                    )}
                                </ExportAsPdf>
                                <PrintDocument
                                    data={usersExport}
                                    headers={["ID", "Name", "Email", "Type"]}
                                    title="User List"
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
                                    rows={usersExport}
                                    columns={columns}
                                    initialState={{
                                        pagination: { paginationModel: { pageSize: 10 } },
                                    }}
                                    pageSizeOptions={[5, 10, 25]}
                                />
                            </div>

                        </div>

                        <div className="w-full md:w-full lg:w-1/2 mt-4 md:mt-0 border border-gray-300 p-4 rounded-md">
                            <h2 className="text-2xl font-bold mb-6">User Information</h2>
                            <UserForm
                                form={form}
                                handleChange={handleChange}
                                resetUserForm={resetUserForm}
                                fetchData={fetchData}
                                setUserID={setUserID}
                            />
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

        </DashboardLayout>
    );

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
};

export default ClientPage;
