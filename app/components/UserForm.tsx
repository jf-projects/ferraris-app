import React, { useEffect, useState } from 'react';
import { UserProps } from '../interfaces/UserProps';
import { toast } from 'react-toastify';

interface UserFormProps {
    form: UserProps;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    resetUserForm: () => void;
    fetchData: () => void;
    setUserID: React.Dispatch<React.SetStateAction<string>>;
}
const UserForm: React.FC<UserFormProps> = ({ form, handleChange, resetUserForm, fetchData, setUserID }) => {
    const [newPassword, setNewPassword] = useState('');


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission

        let api_url;
        let method;

        let message, type;
        if (!form.id) {
            api_url = '/api/user';
            method = 'POST';
            message = "User added successfully";
            type = 'adding';
        } else {
            api_url = `/api/user/${form.id}`;
            method = 'PUT';
            message = "User updated successfully"
            type = 'updating';
        }

        const payload = {
            ...form,
        };
        
        if (newPassword) {
            payload.password = newPassword; // Add password if newPassword is truthy
        } else {
            delete payload.password; // Remove password if newPassword is falsy
        }

        console.log(JSON.stringify(payload))

        try {
            // Update an existing client
            const response = await fetch(api_url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            console.log(response)

            if (response.ok) {
                const data = await response.json();
                toast.success(message);
                fetchData();
                resetUserForm();
                setNewPassword('')
            } else {
                const data = await response.json();
                toast.error(`Error ${type} client. ${data[0].message}`);
                console.error('Error submitting form:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }

    };


    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-8">
                <div>
                    <label htmlFor="id" className="block text-sm text-gray-700 mb-2 font-bold">
                        ID
                    </label>
                    <input
                        type="text"
                        id="id"
                        name="id"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        value={form.id ?? ''}
                        readOnly
                    />
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm text-gray-700 mb-2 font-bold">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm text-gray-700 mb-2 font-bold">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm text-gray-700 mb-2 font-bold">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required={!form.id} 
                    />
                </div>

                <div>
                    <label htmlFor="type" className="block text-sm text-gray-700 mb-2 font-bold">
                        User Type
                    </label>
                    <select
                        id="type"
                        name="type"
                        className="select mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        value={form.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="normal">Normal</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>


            </div>
            <button type="submit"
                className={`btn btn-md 
                ${(!form.id) ? 'btn-outline' : 'btn-neutral'}
                mt-4 px-4 py-2  font-semibold
                rounded-md shadow-sm focus:outline-none focus:ring-2
                focus:ring-opacity-50 mx-auto block w-full`}
            >
                {(!form.id) ? "ADD USER" : "UPDATE USER"}
            </button>
        </form>
    );
};

export default UserForm;
