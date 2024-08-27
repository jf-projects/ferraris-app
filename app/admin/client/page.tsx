'use client';

import React, { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '../../dashboard/layout';
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { useMovieData } from '@mui/x-data-grid-generator';
import { Box } from '@mui/material';

import s from './client.module.css';

const VISIBLE_FIELDS = ['address', 'gender', 'civilStatus', 'email'];

interface DataState {
  rows: any[]; // Replace 'any' with the appropriate type for your rows
  columns: GridColDef[];
}

const ClientPage = () => {

  const [data, setData] = useState<DataState>({ rows: [], columns: [] });
  const [clients, setClients] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState();


  const [form, setForm] = useState<{ id?: number; firstName: string; lastName: string; address: string; gender: string; civilStatus: string; email: string;
    bday: Date | null;
    spouseFirstName: string; 
    spouseLastName: string; 
    spouseMiddleName: string; 
    clientNumber: string; 
    middleName: string; 
    
   }>({
    id: undefined,
    firstName: '',
    lastName: '',
    middleName:'',
    address: '',
    gender: '',
    civilStatus: '',
    email: '',
    bday: null,
    spouseFirstName: '',
    spouseLastName: '',
    spouseMiddleName: '',
    clientNumber: ''
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleEdit = useCallback((id: number) => {
    const item = clients.find(client => client.id === id);
    if (item) {
      setSelectedItem(item);
      console.log(item)
      setForm({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        address: item.address,
        gender: item.gender,
        civilStatus: item.civilStatus,
        email: item.email,
        bday: item.bday ? new Date(item.bday) : null, // Handle bday as Date or null
        spouseFirstName: item.spouseFirstName,
        spouseLastName: item.spouseLastName,
        spouseMiddleName: item.spouseMiddleName,
        clientNumber: item.clientNumber,
        middleName: item.middleName,
      });
    }
  }, [clients]);

  const handleDelete = useCallback((id: number) => {
    const item = clients.find(client => client.id === id);
    setSelectedItem(item);
    console.log(item, clients);
  }, [clients]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/client');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      // Assume result is in the format: { rows: [], columns: [] }
      const transformedRows = result.map((row: { firstName: any; lastName: any; }) => ({
        ...row,
        fullName: `${row.firstName} ${row.lastName}`,
      }));

      setClients(result);

      const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 150 },
        { field: 'fullName', headerName: 'Name', width: 150 },
        { field: 'address', headerName: 'Address', width: 150 },
        { field: 'gender', headerName: 'Gender', width: 150 },
        { field: 'civilStatus', headerName: 'Civil Status', width: 150 },
        { field: 'email', headerName: 'Email', width: 150 },
        {
          field: 'actions',
          headerName: 'Actions',
          width: 150,
          sortable: false,
          filterable: false,
          renderCell: (params) => (
            <div className="flex space-x-2 pt-1">
              <button
                className="btn btn-xs btn-success text-white px-2 py-1 rounded hover:bg-blue-600"
                onClick={() => handleEdit(Number(params.id))}
              >
                Edit
              </button>
              <button
                className="btn btn-xs btn-error text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => handleDelete(Number(params.id))}
              >
                Delete
              </button>
            </div>
          ),
        },
      ];

      setData({
        rows: transformedRows,
        columns: columns,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [handleEdit, handleDelete]); // Include memoized handlers as dependencies

  useEffect(() => {
    fetchData();
  }, [fetchData]);




  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row space-x-0 md:space-x-4">
        <div className="w-full md:w-full lg:w-2/3 border border-gray-300 p-4 rounded-md">
          <h2 className="text-2xl font-bold mb-4">Client List</h2>
          <div className={s.printTitle} style={{ display: 'none' }}>My DataGrid Title</div>
          <div>
            <Box>
              <DataGrid
                rowHeight={40}
                {...data}
                slots={{
                  toolbar: CustomToolbar,
                }}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 25]}
                disableColumnFilter
                disableColumnSelector
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
              />
            </Box>
          </div>
        </div>
        <div className="w-full md:w-full lg:w-1/3 mt-4 md:mt-0 border border-gray-300 p-4 rounded-md">
          <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span- md:col-span-2">
                <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">
                  Upload Profile Picture
                </label>
                <input
                  type="file"
                  id="fileUpload"
                  name="fileUpload"
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
              </div>

              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">
                  Middle Name
                </label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={form.middleName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="bday" className="block text-sm font-medium text-gray-700">
                  Birthday
                </label>
                <input
                  type="date"
                  id="bday"
                  name="bday"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={form.bday ? form.bday.toISOString().split('T')[0] : ''} 
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <input
                  type="text"
                  id="gender"
                  name="gender"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={form.gender}
                  onChange={handleChange}
                />
              </div>

              <div >
                <label htmlFor="civilStatus" className="block text-sm font-medium text-gray-700">
                  Civil Status
                </label>
                <input
                  type="text"
                  id="civilStatus"
                  name="civilStatus"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={form.civilStatus}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label htmlFor="clientNumber" className="block text-sm font-medium text-gray-700">
                  Client Number
                </label>
                <input
                  type="text"
                  id="clientNumber"
                  name="clientNumber"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={form.clientNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="spouseFirstName" className="block text-sm font-medium text-gray-700">
                  Spouse First Name
                </label>
                <input
                  type="text"
                  id="spouseFirstName"
                  name="spouseFirstName"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={form.spouseFirstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="spouseMiddleName" className="block text-sm font-medium text-gray-700">
                  Spouse Middle Name
                </label>
                <input
                  type="text"
                  id="spouseMiddleName"
                  name="spouseMiddleName"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={form.spouseMiddleName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="spouseLastName" className="block text-sm font-medium text-gray-700">
                  Spouse Last Name
                </label>
                <input
                  type="text"
                  id="spouseLastName"
                  name="spouseLastName"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={form.spouseLastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );

  function CustomToolbar() {
    return (
      <GridToolbarContainer style={{ display: 'flex', justifyContent: 'space-between' }}>

        <GridToolbarExport
          csvOptions={{
            fileName: 'Test',
            delimiter: ';',
            utf8WithBom: true,
          }}
          printOptions={{
            hideFooter: true,
            hideToolbar: true,
            pageStyle: `.MuiDataGrid-root .MuiDataGrid-main { 
              color: rgba(0, 0, 0, 0.87); 
            }

            .MuiDataGrid-root::before {
              content: 'My DataGrid Title';
              display: block;
              text-align: center;
              font-size: 24px;
              margin-bottom: 20px;
              font-weight: bold;
            }
             .MuiDataGrid-root .MuiDataGrid-row {
              max-height: 30px !important; /* Adjust the maximum row height */
              min-height: 30px !important; /* Adjust the minimum row height */
            }
            .MuiDataGrid-root .MuiDataGrid-cell {
              height: 30px !important; /* Adjust the cell height */
              line-height: 30px !important; /* Align text vertically within cells */
              padding: 4px; /* Optional: Adjust cell padding */
            }  
            .MuiDataGrid-root .MuiDataGrid-columnHeaders {
              max-height: 40px !important; /* Adjust the maximum header row height */
              min-height: 40px !important; /* Adjust the minimum header row height */
            }
            .MuiDataGrid-root .MuiDataGrid-columnHeader {
              height: 40px !important; /* Adjust the header cell height */
              line-height: 40px !important; /* Align text vertically within header cells */
              padding: 8px; /* Optional: Adjust header cell padding */
              font-size: 14px; /* Optional: Adjust font size in header */
            }
              
            `,
          }} />
        <GridToolbarQuickFilter
          quickFilterProps={{
            debounceMs: 500, // Delay in ms before filtering starts
          }}
        />
      </GridToolbarContainer>
    );
  }
};



export default ClientPage;




