import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';

interface lotTransactionProps {
    id?: number;
    clientId?: number | null;
    propertyUnit?: string;
    totalPropertySize?: number | null;
    type?: string;
    unitBlock?: string;
    unitLot?: string;
    propertyUnitAddress?: string;
    propertyTotalAmount?: number | null;
    downpayment?: number | null;
    paymentTerms?: string;
    incrementValues?: string;
    dueDate?: string | null;
    interest?: number | null;
    sqm?: number | null;
    incrementAmount?: number | null;
    transactionDate?: string; // ISO 8601 string format
    autocompute: number;
    deletedAt?: string | null; // ISO 8601 string format or null
}

interface ClientFormProps {
    setSelectedClient: React.Dispatch<React.SetStateAction<string>>;
    transactionId: number | null;
}

const TransactionForm: React.FC<ClientFormProps> = ({ setSelectedClient, transactionId }) => {
    const router = useRouter();
    const [inputValues, setInputValues] = useState<number[]>([]);
    const [numInputs, setNumInputs] = useState(0);
    const [isChecked, setIsChecked] = useState(false);
    const [clients, setClients] = useState<any[]>([]);
    const [form, setForm] = useState<lotTransactionProps>({
        id: undefined,
        clientId: null,
        propertyUnit: '',
        totalPropertySize: null,
        type: '',
        unitBlock: '',
        unitLot: '',
        propertyUnitAddress: '',
        propertyTotalAmount: 0,
        downpayment: 0,
        paymentTerms: '',
        incrementValues: '',
        dueDate: new Date().toISOString().split('T')[0],
        interest: null,
        sqm: null,
        incrementAmount: null,
        transactionDate: new Date().toISOString().split('T')[0],
        autocompute: 0,
        deletedAt: null,
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (name === 'clientId') {
            const item = clients.find(client => client.id === Number(value));
            setSelectedClient(item);
        }

        if (name === 'paymentTerms') {
            if (Number(value) >= 5) {
                setNumInputs(Number(value) / 5);
            } else {
                setNumInputs(0);
                setInputValues([]);
            }
        }

        if (name === 'autocompute') {
            setIsChecked((e.target as HTMLInputElement).checked);
            if ((e.target as HTMLInputElement).checked) {
                setForm(prevForm => ({
                    ...prevForm,
                    [name]: 1,
                }));
            } else {
                setForm(prevForm => ({
                    ...prevForm,
                    [name]: 0
                }));
            }
        } else {
            setForm(prevForm => ({
                ...prevForm,
                [name]: (type === 'number' || name === 'clientId') ? parseFloat(value) : value,
            }));
        }

    };


    const fetchClients = async () => {
        try {
            const response = await fetch('/api/client');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setClients(result);
        } catch (error: any) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchTransactionDetails = async () => {
        try {
            const response = await fetch(`/api/lot-transactions/${transactionId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setForm(result);

            result.transactionDate = moment(result.transactionDate).format('YYYY-MM-DD');
            result.dueDate = moment(result.dueDate).format('YYYY-MM-DD');
            console.log(result)

            if (result.autocompute) {
                setIsChecked(true);
            }

            setSelectedClient(result.client);
            setNumInputs(result.paymentTerms / 5);
            if (result.incrementValues.length) {
                setInputValues(JSON.parse(result.incrementValues))
            }
        } catch (error: any) {
            console.error('Error fetching data:', error);
        }
    };

    const computeIncrementArray = async () => {
        const terms = Number(form.paymentTerms) || 0;
        const propertyTotalAmount = Number(form.propertyTotalAmount) || 0;
        const incrementAmount = Number(form.incrementAmount) || 0;
        const downpayment = Number(form.downpayment) || 0;
        const totalAmount = propertyTotalAmount - downpayment;
        const incrementsArr = [];

        if (terms > 2 && form.autocompute) {
            const incrementFrequency = 5;
            const numberOfIncreases = Math.ceil(terms / incrementFrequency);
            let totalIncrease = 0;

            // Calculate total increase amount
            for (let i = 2; i <= numberOfIncreases; i++) {
                totalIncrease += incrementAmount * 60 * (i - 1);
            }

            const remainingAmount = totalAmount - totalIncrease;
            const monthlyBase = remainingAmount / (terms * 12);
            let totalDecimal = 0;
            let totalWhole = 0;

            // Calculate monthly dues and accumulate totals
            for (let i = 1; i <= numberOfIncreases; i++) {
                const monthlyDue = i === 1 ? monthlyBase : monthlyBase + incrementAmount * (i - 1);
                const roundedDue = Math.round(monthlyDue * 10) / 10;
                const wholePart = Math.floor(roundedDue);
                const decimalPart = roundedDue - wholePart;
                totalDecimal += decimalPart * 60;
                totalWhole += wholePart * 60;
                incrementsArr.push(wholePart);
            }

            // Adjust the last increment value
            const additional = totalDecimal / 60;
            incrementsArr[incrementsArr.length - 1] += Math.round(additional * 100) / 100;
            let increment_string = JSON.stringify(incrementsArr);

            setInputValues(incrementsArr);
            setForm(prevForm => ({
                ...prevForm,
                incrementValues: increment_string,
            }));
        } else if (terms < 5) {
            setForm(prevForm => ({
                ...prevForm,
                incrementValues: '',
            }));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission
        console.log(JSON.stringify(form))
        let url, method, message;
        if (transactionId) {
            url = `/api/lot-transactions/${transactionId}`;
            method = 'PUT';
            message = 'Transaction Updated Successfully';
        } else {
            url = `/api/lot-transactions`;
            method = 'POST';
            message = 'Transaction Added Successfully';
        }

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
                toast.error(message);
                console.error('Error submitting form:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }

    };

    useEffect(() => {
        computeIncrementArray();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.autocompute, form.paymentTerms, form.downpayment, form.propertyTotalAmount, form.incrementAmount]);


    useEffect(() => {
        fetchClients();
        if (transactionId) {
            fetchTransactionDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleInputChange = (index: number, value: string) => {
        const updatedValues = [...inputValues];
        updatedValues[index] = Number(value);
        console.log(updatedValues);

        const sum = updatedValues.map(num => num * 60).reduce((acc, curr) => acc + curr, 0) + form.downpayment!;

        setInputValues(updatedValues);
        setForm(prevForm => ({
            ...prevForm,
            incrementValues: JSON.stringify(updatedValues),
            propertyTotalAmount: sum
        }));
    };

    return (
        <div>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-8">
                    <div className="divider col-span-3 uppercase font-bold">Property details</div>
                    <input
                        type="hidden"
                        id="id"
                        name="id"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        value={form.id || ''}
                        onChange={handleChange}
                    />
                    <div>
                        <label htmlFor="clientId" className="block text-sm text-gray-700 mb-2 font-bold">
                            Client
                        </label>

                        <select
                            id="clientId"
                            name="clientId"
                            className="select  mt-1 block w-full border-gray-300 rounded-md shadow-sm 
                            focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 capitalize appearance-none"
                            value={form.clientId || ''}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled hidden>
                                Please select a Client
                            </option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id} >
                                    {client.firstName} {client.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="propertyUnit" className="block text-sm text-gray-700 mb-2 font-bold">
                            Property Unit
                        </label>
                        <input
                            type="text"
                            id="propertyUnit"
                            name="propertyUnit"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={form.propertyUnit || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="totalPropertySize" className="block text-sm text-gray-700 mb-2 font-bold">
                            Total Property Size
                        </label>
                        <input
                            type="number"
                            id="totalPropertySize"
                            name="totalPropertySize"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={form.totalPropertySize || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm text-gray-700 mb-2 font-bold">
                            Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            className="select  mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={form.type || ''}
                            onChange={handleChange}
                            required
                        >
                            <option value="vacant">Vacant Lot</option>
                            <option value="with_property">With Property</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="unitBlock" className="block text-sm text-gray-700 mb-2 font-bold">
                            Unit Block
                        </label>
                        <input
                            type="text"
                            id="unitBlock"
                            name="unitBlock"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={form.unitBlock || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="unitLot" className="block text-sm text-gray-700 mb-2 font-bold">
                            Unit Lot
                        </label>
                        <input
                            type="text"
                            id="unitLot"
                            name="unitLot"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={form.unitLot || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className='md:col-span-3'>
                        <label htmlFor="propertyUnitAddress" className="block text-sm text-gray-700 mb-2 font-bold">
                            Property Unit Address
                        </label>
                        <input
                            type="text"
                            id="propertyUnitAddress"
                            name="propertyUnitAddress"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={form.propertyUnitAddress || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>



                    <div>
                        <label htmlFor="sqm" className="block text-sm text-gray-700 mb-2 font-bold">
                            Price per Square Meters
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            id="sqm"
                            name="sqm"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={form.sqm || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="transactionDate" className="block text-sm text-gray-700 mb-2 font-bold">
                            Transaction Date
                        </label>
                        <input
                            type="date"
                            id="transactionDate"
                            name="transactionDate"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={form.transactionDate || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="dueDate" className="block text-sm text-gray-700 mb-2 font-bold">
                            Due Date
                        </label>
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={form.dueDate || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="divider col-span-3 uppercase font-bold">Payment details</div>

                    <div>
                        <label htmlFor="propertyTotalAmount" className="block text-sm text-gray-700 mb-2 font-bold">
                            Property Total Amount
                        </label>
                        <input
                            type="number"
                            id="propertyTotalAmount"
                            name="propertyTotalAmount"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={form.propertyTotalAmount || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="downpayment" className="block text-sm text-gray-700 mb-2 font-bold">
                            Downpayment
                        </label>
                        <input
                            type="number"
                            id="downpayment"
                            name="downpayment"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={form.downpayment || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="paymentTerms" className="block text-sm text-gray-700 mb-2 font-bold">
                            Payment Terms
                        </label>
                        <select
                            id="paymentTerms"
                            name="paymentTerms"
                            className="select  mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={form.paymentTerms || ''}
                            onChange={handleChange}
                            required
                        >
                            <option value="cash">Cash</option>
                            <option value="2">2 Years</option>
                            <option value="5">5 Years</option>
                            <option value="10">10 Years</option>
                            <option value="15">15 Years</option>
                            <option value="20">20 Years</option>
                            <option value="25">25 Years</option>
                        </select>
                    </div>


                    <input
                        type="hidden"
                        id="incrementValues"
                        name="incrementValues"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        value={form.incrementValues}
                        onChange={handleChange}
                    />



                    <div>
                        <label htmlFor="interest" className="block text-sm text-gray-700 mb-2 font-bold">
                            Interest
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            id="interest"
                            name="interest"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={form.interest || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>



                    <div>
                        <label htmlFor="incrementAmount" className="block text-sm text-gray-700 mb-2 font-bold">
                            Increment Amount
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            id="incrementAmount"
                            name="incrementAmount"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={form.incrementAmount || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="autocompute" className="block text-sm text-gray-700 mb-2 font-bold">
                            Auto Compute
                        </label>
                        <input
                            type="checkbox"
                            className="toggle m-2"
                            name="autocompute"
                            id="autocompute"
                            onChange={handleChange}
                            checked={isChecked}
                        />

                        {Array.from({ length: numInputs }, (_, index) => (

                            <input
                                key={index}
                                type="number"
                                placeholder={`${((index + 1) * 5) - 5} - ${(index + 1) * 5} Years`}
                                value={inputValues[index] || ''}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                disabled={isChecked}
                            />
                        ))}

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
                        {(!form.id) ? "ADD TRANSACTION" : "UPDATE TRANSACTION"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default TransactionForm