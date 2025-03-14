// pages/client/ClientPage.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../dashboard/layout';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import ClientForm from '@/app/components/ClientForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteModal from '@/app/components/DeleteModal';
import { ExportAsPdf, PrintDocument } from "react-export-table";
import { useSession } from "next-auth/react";
import { faEdit, faTrash, faHistory } from '@fortawesome/free-solid-svg-icons'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
interface clientProps {
  id?: number;
  firstName: string;
  lastName: string;
  address: string;
  gender: string;
  civilStatus: string;
  email: string;
  bday: string;
  spouseFirstName: string;
  spouseLastName: string;
  spouseMiddleName: string;
  clientNumber: string;
  middleName: string;
  image: string;
  client_id: string;
}

const ClientPage = () => {
  const { data: session, status } = useSession();
  console.log(session)
  const [clients, setClients] = useState<any[]>([]);
  const [clientsExport, setClientsExport] = useState<any[]>([]);

  const [url, setUrl] = useState<string>('');
  const [client_id, setClientID] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number>();

  const [form, setForm] = useState<clientProps>({
    id: undefined,
    firstName: '',
    lastName: '',
    middleName: '',
    address: '',
    gender: '',
    civilStatus: '',
    email: '',
    bday: '',
    spouseFirstName: '',
    spouseLastName: '',
    spouseMiddleName: '',
    clientNumber: '',
    image: '',
    client_id: '',
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const resetClientForm = () => {
    setForm({
      id: undefined,
      firstName: '',
      lastName: '',
      middleName: '',
      address: '',
      gender: '',
      civilStatus: '',
      email: '',
      bday: '',
      spouseFirstName: '',
      spouseLastName: '',
      spouseMiddleName: '',
      clientNumber: '',
      image: '',
      client_id: ''
    });

    setUrl('');
    setClientID('');

  };

  const handleEdit = (id: number) => {
    const item = clients.find(client => client.id === id);
    if (item) {
      setForm({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        address: item.address,
        gender: item.gender,
        civilStatus: item.civilStatus,
        email: item.email,
        bday: item.bday ? new Date(item.bday).toISOString().split('T')[0] : '',
        spouseFirstName: item.spouseFirstName,
        spouseLastName: item.spouseLastName,
        spouseMiddleName: item.spouseMiddleName,
        clientNumber: item.clientNumber,
        middleName: item.middleName,
        image: item.image,
        client_id: item.client_id,
      });
      setUrl(item.image);
      setClientID(item.client_id);
    }
  };


  const fetchData = async () => {
    try {
      const response = await fetch('/api/client');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();

      const reorderedClients = result.map((client: { id: any; firstName: any; middleName: any; lastName: any; gender: any; bday: any; civilStatus: any; spouseFirstName: any; spouseMiddleName: any; spouseLastName: any; email: any; clientNumber: any; clientLandline: any; address: any; image: any; }) => ({
        id: client.id,
        fullname: `${client.firstName} ${client.middleName} ${client.lastName}`,
        gender: client.gender,
        email: client.email,
        clientNumber: client.clientNumber,
        address: client.address,
      }));

      console.log(reorderedClients)

      setClients(result);
      setClientsExport(reorderedClients);
    } catch (error: any) {
      console.error('Error fetching data:', error);
    }
  };


  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'firstName', headerName: 'First Name', width: 150 },
    // { field: 'fullName', headerName: 'Full Name', width: 150 },
    { field: 'address', headerName: 'Address', width: 150, editable: false },
    { field: 'email', headerName: 'Email', width: 150, editable: false },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      disableExport: true,
      renderCell: (params: any) => (
        <div className='space-x-2'>
          {session?.user.type === 'admin' &&
            <>
              <button
                className="btn btn-xs btn-success text-white px-2 py-1 rounded hover:bg-blue-600 "
                onClick={() => handleEdit(params.row.id)}  title="Edit Client"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                className="btn btn-xs btn-error text-white px-2 py-1 rounded hover:bg-red-600 "
                onClick={() => handleOpenModal(params.row.id)} title="Delete Client" 
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </>
          }

          <a href={`/admin/history?model=Client&itemID=${params.row.id}`}
            className="btn btn-xs btn-outline  px-2 py-1 rounded " title="View History" 
          >
            <FontAwesomeIcon icon={faHistory} />
          </a>
        </div>
      ),
    },
  ];

  const transformedRows = clients.map((row: { firstName: any; lastName: any; }) => ({
    ...row,
    fullName: `${row.firstName} ${row.lastName}`,
  }));


  useEffect(() => {
    fetchData();
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
      const response = await fetch(`/api/client/${selectedId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        toast.success('Client was deleted successfully!');
        fetchData();
      } else {
        console.error('Error submitting form:', response.statusText);
      }

    } catch (error: any) {
      console.error('Error fetching data:', error);
    }

    setIsModalOpen(false);
  };

  return (
    <DashboardLayout>
      <ToastContainer />
      <DeleteModal isOpen={isModalOpen} onClose={handleCloseModal} onDelete={handleDelete} />
      <div className="flex flex-col md:flex-row space-x-0 md:space-x-4">
        <div className="w-full md:w-full lg:w-1/2 border border-gray-300 p-4 rounded-md">
          <div className='flex items-center my-6 space-x-4'>
            <h2 className="text-2xl font-bold ">Client List</h2>
            <button className="btn btn-outline btn-sm" onClick={resetClientForm}>Add Client</button>
          </div>

          <div className='mb-2 flex space-x-1 justify-end'>
            <ExportAsPdf
              data={clientsExport}
              headers={["ID", "Full Name", "Gender", "Email", "Number", "Address"]}
              headerStyles={{ fillColor: "red" }}
              title="Client List"
              fileName="Client_List"
            >
              {(props) => (
                <button {...props} className='btn btn-xs btn-outline'>
                  Export as PDF
                </button>
              )}
            </ExportAsPdf>
            <PrintDocument
              data={clientsExport}
              headers={["ID", "Full Name", "Gender", "Email", "Number", "Address"]}
              title="Client List"
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
              rows={transformedRows}
              columns={columns}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[5, 10, 25]}
            />
          </div>

        </div>

        <div className="w-full md:w-full lg:w-1/2 mt-4 md:mt-0 border border-gray-300 p-4 rounded-md">
          <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
          <ClientForm
            form={form}
            handleChange={handleChange}
            resetClientForm={resetClientForm}
            fetchData={fetchData}
            url={url}
            setUrl={setUrl}
            client_id={client_id}
            setClientID={setClientID}
          />
        </div>
      </div>
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
