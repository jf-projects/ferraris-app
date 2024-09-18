import React, { useEffect, useState } from 'react';
import UploadCld from './UploadCld';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface ClientFormProps {
    form: {
        id?: number;
        firstName: string;
        lastName: string;
        address: string;
        gender: string;
        civilStatus: string;
        email: string;
        bday?: string;
        spouseFirstName: string;
        spouseLastName: string;
        spouseMiddleName: string;
        clientNumber: string;
        middleName: string;
        image: string;
        client_id: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    resetClientForm: () => void;
    fetchData: () => void;
    url: string;
    setUrl: React.Dispatch<React.SetStateAction<string>>;
    client_id: string;
    setClientID: React.Dispatch<React.SetStateAction<string>>;
}
const ClientForm: React.FC<ClientFormProps> = ({ form, handleChange, resetClientForm, fetchData, url, setUrl, client_id, setClientID }) => {
    // const [url, setUrl] = useState<string>();
    // const [client_id, setClientID] = useState<string>();

    useEffect(() => {
        console.log('Value client_id:', client_id);
        console.log('Value url', url);
    }, [client_id, url]);

    const handlePublicIdChange = (id: string) => {
        setUrl(id);
    };
    const handleClientIdChange = (id: string) => {
        setClientID(id);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission

        let api_url;
        let method;
        form.image = url;
        form.client_id = client_id;
        const data_json = JSON.stringify(form);
        console.log(data_json)
        let message, type;
        if (!form.id) {
            api_url = '/api/client';
            method = 'POST';
            message = "Client added successfully";
            type = 'adding';
        } else {
            api_url = `/api/client/${form.id}`;
            method = 'PUT';
            message = "Client updated successfully"
            type = 'updating';
        }

        try {
            // Update an existing client
            const response = await fetch(api_url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data_json,
            });

            if (response.ok) {
                const data = await response.json();
                toast.success(message);
                fetchData();
                resetClientForm();
                setUrl('');
                setClientID('');
            } else {
                toast.error(`Error ${type} client `);
                console.error('Error submitting form:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }

    };


    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-8">
                <div>
                    <label htmlFor="id" className="block text-sm text-gray-700 mb-2 font-bold">
                        ID
                    </label>
                    <input
                        type="text"
                        id="id"
                        name="id"
                        className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md"
                        value={form.id ?? ''}
                        readOnly
                    />
                </div>
                <div className="col-span-1 md:col-span-1">
                    <label htmlFor="fileUpload" className="block text-sm text-gray-700 mb-2 font-bold">
                        Upload Client Picture
                    </label>
                    <div className='flex flex-col space-y-2'>
                        {url &&
                            <div className="avatar border border-gray-500 rounded-md">
                                <div className="w-full rounded">
                                    <Image
                                        src={url}
                                        alt="Uploaded"
                                        layout="fill" // or "responsive", "fixed", depending on your needs
                                    />
                                </div>
                            </div>
                        }
                        <UploadCld onPublicIdChange={handlePublicIdChange} />
                        <input
                            type="hidden"
                            id="image"
                            name="image"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={url}
                        />
                    </div>
                </div>

                <div className="col-span-1 md:col-span-1">
                    <label htmlFor="fileUpload" className="block text-sm text-gray-700 mb-2 font-bold">
                        Upload Client ID
                    </label>
                    <div className='flex flex-col space-y-2'>
                        {client_id && (
                            <div className="avatar border border-gray-500 rounded-md">
                                <div className="w-full rounded">
                                    <Image
                                        src={client_id}
                                        alt="Uploaded"
                                        layout="fill" // or "responsive", "fixed", depending on your needs
                                    />
                                </div>
                            </div>
                        )}
                        <UploadCld onPublicIdChange={handleClientIdChange} />
                        <input
                            type="hidden"
                            id="client_id"
                            name="client_id"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={client_id}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="firstName" className="block text-sm text-gray-700 mb-2 font-bold">
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
                    <label htmlFor="middleName" className="block text-sm text-gray-700 mb-2 font-bold">
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
                    <label htmlFor="lastName" className="block text-sm text-gray-700 mb-2 font-bold">
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="bday" className="block text-sm text-gray-700 mb-2 font-bold">
                        Birthday
                    </label>
                    <input
                        type="date"
                        id="bday"
                        name="bday"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        value={form.bday}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="gender" className="block text-sm text-gray-700 mb-2 font-bold">
                        Gender
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        className="select mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        value={form.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="civilStatus" className="block text-sm text-gray-700 mb-2 font-bold">
                        Civil Status
                    </label>

                    <select
                        id="civilStatus"
                        name="civilStatus"
                        className="select mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        value={form.civilStatus}
                        onChange={handleChange}
                        required
                    >
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                    </select>
                </div>
                <div className="col-span-1 md:col-span-3">
                    <label htmlFor="address" className="block text-sm text-gray-700 mb-2 font-bold">
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
                <div className="md:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="clientNumber" className="block text-sm text-gray-700 mb-2 font-bold">
                                Client Number
                            </label>
                            <input
                                type="text"
                                id="clientNumber"
                                name="clientNumber"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                value={form.clientNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm text-gray-700 mb-2 font-bold">
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
                    </div>
                </div>
                <div>
                    <label htmlFor="spouseFirstName" className="block text-sm text-gray-700 mb-2 font-bold">
                        Spouse First Name
                    </label>
                    <input
                        type="text"
                        id="spouseFirstName"
                        name="spouseFirstName"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        value={form.spouseFirstName}
                        onChange={handleChange}

                    />
                </div>
                <div>
                    <label htmlFor="spouseMiddleName" className="block text-sm text-gray-700 mb-2 font-bold">
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
                    <label htmlFor="spouseLastName" className="block text-sm text-gray-700 mb-2 font-bold">
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
            <button type="submit"
                className={`btn btn-md 
                ${(!form.id) ? 'btn-outline' : 'btn-neutral'}
                mt-4 px-4 py-2  font-semibold
                rounded-md shadow-sm focus:outline-none focus:ring-2
                focus:ring-opacity-50 mx-auto block w-full`}
            >
                {(!form.id) ? "ADD CLIENT" : "UPDATE CLIENT"}
            </button>
        </form>
    );
};

export default ClientForm;
