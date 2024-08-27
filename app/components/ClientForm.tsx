import React, { useState } from 'react'

const ClientForm = () => {
    const [form, setForm] = useState<{
        id?: number; firstName: string;
        lastName: string;
        address: string;
        gender: string;
        civilStatus: string;
        email: string;
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
        middleName: '',
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    return (
        <div> <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
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
            </form></div>
    )
}

export default ClientForm