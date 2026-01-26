
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';

interface lotTransactionProps {
    id?: number;
    lotTransactionId: number;
    amount: number;
    bank: string;
    paymentDate?: string;
    paymentEndDate?: string;
    remarks?: string;
}

interface ClientFormProps {
    transactionId: number | null;
    paymentId: number | null;
}

const MultiplePaymentForm: React.FC<ClientFormProps> = ({ transactionId, paymentId }) => {
    const router = useRouter();
    const [payment, setPayment] = useState<any>('');
    const [form, setForm] = useState<lotTransactionProps>({
        id: undefined,
        lotTransactionId: 0,
        amount: 0.0,
        bank: '',
        paymentDate: '',
        paymentEndDate: '',
        remarks: '',
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: (type === 'number') ? parseFloat(value) : value,
        }));
    };

    const fetchPaymentDetails = async () => {
        try {
            const response = await fetch(`/api/payment/${paymentId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setForm(result);

            result.paymentDate = moment(result.paymentDate).format('YYYY-MM-DD');
            console.log(result)

            setPayment(result);
            setForm(prevForm => ({
                ...prevForm,
                id: Number(result.id),
                lotTransactionId: Number(result.lotTransactionId),
            }));

        } catch (error: any) {
            console.error('Error fetching data:', error);
        }
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission
        let url, method, message;

        form.amount = Number(form.amount);
        console.log(JSON.stringify(form))

        url = `/api/payment/newMultiple`;
        method = 'POST';
        message = 'Payment Added Successfully';

        try {
            // Update an existing client
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                toast.success(message);

                setTimeout(() => {
                    router.push('/admin/lot-transactions');
                }, 1000);
            } else {
                toast.error(response.statusText);
                console.error('Error submitting form:', response.statusText);
            }


        } catch (error) {
            console.error('An error occurred:', error);
        }
    };


    useEffect(() => {
        // fetchClients();
        if (transactionId) {
            setForm(prevForm => ({
                ...prevForm,
                lotTransactionId: Number(transactionId),
                amount: Number(prevForm.amount),
            }));
        }

        if (paymentId) {
            fetchPaymentDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-8">
                    <div className="divider col-span-3 uppercase font-bold">Multiple Payment details</div>
                    <input
                        type="hidden"
                        id="id"
                        name="id"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        value={form.id || ''}
                        onChange={handleChange}
                    />

                    <input
                        type="hidden"
                        id="lotTransactionId"
                        name="lotTransactionId"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        value={form.lotTransactionId || ''}
                        onChange={handleChange}
                    />

                    <div>
                        <label htmlFor="amount" className="block text-sm text-gray-700 mb-2 font-bold">
                            Payment Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={form.amount || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="bank" className="block text-sm text-gray-700 mb-2 font-bold">
                            Bank
                        </label>
                        <input
                            type="text"
                            id="bank"
                            name="bank"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={form.bank || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                    </div>

                    <div>
                        <label htmlFor="paymentDate" className="block text-sm text-gray-700 mb-2 font-bold">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="paymentDate"
                            name="paymentDate"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={form.paymentDate || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="paymentEndDate" className="block text-sm text-gray-700 mb-2 font-bold">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="paymentEndDate"
                            name="paymentEndDate"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={form.paymentEndDate || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-span-1 md:col-span-3">
                        <label htmlFor="remarks" className="block text-sm text-gray-700 mb-2 font-bold">
                            Remarks
                        </label>
                        <input
                            type="text"
                            id="remarks"
                            name="remarks"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={form.remarks || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='pt-8'>
                    <button type="submit"
                        className={`btn btn-md 
                                    ${(!form.id) ? 'btn-outline' : 'btn-neutral'}
                                    mt-4 px-4 py-2  font-semibold
                                    rounded-md shadow-sm focus:outline-none focus:ring-2
                                    focus:ring-opacity-50 mx-auto block w-full `}
                    >
                        {(!form.id) ? "ADD PAYMENTS" : "UPDATE PAYMENT"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default MultiplePaymentForm