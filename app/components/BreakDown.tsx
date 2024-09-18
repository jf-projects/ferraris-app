import React, { forwardRef, useEffect, useState } from 'react';
import ReactToPrint from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import moment from 'moment';

interface ClientFormProps {
    transactionId: number | null;
    paymentId: number | null;
}

interface breakdownProps {
    transactionId: number | null;
    breakdown: bdProps[] | null;
    transaction: any;
}

interface bdProps {
    months: number;
    date: number;
    base_amount_due: number;
    month_interest: number;
    total_amount_due: number;
    amount_paid: number;
    balance: number;
    color: string;
}

// Create a component to be printed
const PrintableBreakDown = forwardRef<HTMLDivElement, breakdownProps>(({ breakdown, transaction }, ref) => {
    return (
        <div ref={ref} className='print-div'>
            <div className='flex flex-col items-center p-4'>
                <h1 className="text-4xl font-bold">Ferraris & Engineers Ville</h1>
                <h3>Cutud, Angeles City</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 pb-3">
                <div className="bg-slate-100 p-4">
                    <div className="flex">
                        <label className="font-semibold text-gray-700 w-1/2 text-sm">Client:</label>
                        <span className="text-gray-900 text-sm capitalize">
                            {transaction.client ? `${transaction.client.firstName} ${transaction.client.lastName}` : ""}
                        </span>
                    </div>
                    <div className="flex">
                        <label className="font-semibold text-gray-700 w-1/2 text-sm">Property: </label>
                        <span className="text-gray-900 text-sm capitalize">{transaction.propertyUnit}</span>
                    </div>

                    <div className="flex">
                        <label className="font-semibold text-gray-700 w-1/2 text-sm">Property Size: </label>
                        <span className="text-gray-900 text-sm capitalize">{transaction.totalPropertySize} sqr.mt</span>
                    </div>

                    <div className="flex">
                        <label className="font-semibold text-gray-700 w-1/2 text-sm">Payment Terms: </label>
                        <span className="text-gray-900 text-sm capitalize">{transaction.paymentTerms} Years</span>
                    </div>
                    <div className="flex">
                        <label className="font-semibold text-gray-700 w-1/2 text-sm">Transaction Date: </label>
                        <span className="text-gray-900 text-sm capitalize">{moment(transaction.transactionDate).format('MM-DD-YYYY')}</span>
                    </div>
                </div>

                <div className="bg-slate-100 p-4">
                    <div className="flex">
                        <label className="font-semibold text-gray-700 w-1/2 text-sm">Total Price: </label>
                        <span className="text-gray-900 text-sm capitalize">{
                            transaction.propertyTotalAmount ?
                                (transaction.propertyTotalAmount).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) :
                                0
                        }
                        </span>
                    </div>

                    <div className="flex">
                        <label className="font-semibold text-gray-700 w-1/2 text-sm">Total Amount Paid: </label>
                        <span className="text-gray-900 text-sm capitalize">{
                            breakdown ?
                                breakdown.reduce((sum, item) => sum + item.amount_paid, 0).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
                                : 0
                        }
                        </span>
                    </div>

                    <div className="flex">
                        <label className="font-semibold text-gray-700 w-1/2 text-sm">Balance: </label>
                        <span className="text-gray-900 text-sm capitalize">{
                            transaction.propertyTotalAmount && breakdown ?
                                (transaction.propertyTotalAmount - breakdown.reduce((sum, item) => sum + item.amount_paid, 0)).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) :
                                0
                        }
                        </span>
                    </div>
                </div>

            </div>
            <div className="max-h-[30rem] overflow-y-auto print:max-h-full print:overflow-y-visible">
                <table className="table table-xs table-pin-rows table-pin-cols ">
                    <thead>
                        <tr>
                            <td>Terms</td>
                            <td>Date</td>
                            <td>Principal</td>
                            <td>Interest</td>
                            <td>Total Amount Due</td>
                            <th>Amount Paid</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {breakdown!.map((item) => (
                            <tr key={item.months} className={item.color}>
                                <th>{item.months}</th>
                                <th>{item.date}</th>
                                <td>{
                                    item.base_amount_due ? item.base_amount_due.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : 0
                                }</td>
                                <td>{
                                    item.month_interest ? item.month_interest.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : 0
                                }</td>
                                <td>{
                                    item.total_amount_due ? item.total_amount_due.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : 0
                                }</td>
                                <td>{
                                    item.amount_paid ? item.amount_paid.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : 0
                                }</td>
                                <td>{
                                    item.balance ? item.balance.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : 0
                                }</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
});

const BreakDown: React.FC<ClientFormProps> = ({ transactionId }) => {
    const componentRef = React.useRef<HTMLDivElement>(null);
    const [breakdown, setBreakdown] = useState<bdProps[]>([]);
    const [transaction, setTransaction] = useState([]);


    const exportToPdf = async () => {
        if (componentRef.current) {
            // Capture the HTML content as a canvas
            const canvas = await html2canvas(componentRef.current, {
                scale: 2, // Increases resolution for better quality
                useCORS: true, // Handle cross-origin images
                allowTaint: true, // Allow cross-origin data tainting
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Calculate height in pdf units
            const imgWidth = 210; // A4 size width in mm
            const pageHeight = 297; // A4 size height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            // Add the image into PDF
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // If the content is larger than one page, add additional pages
            while (heightLeft > 0) {
                position = heightLeft - imgHeight; // Move to next page
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // Save the PDF
            pdf.save('breakdown.pdf');
        }
    };

    const fetchBreakdown = async () => {
        try {
            const response = await fetch(`/api/payment/history/${transactionId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            console.log(result)
            setBreakdown(result);
        } catch (error: any) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchTransaction = async () => {
        try {
            const response = await fetch(`/api/lot-transactions/${transactionId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            console.log(result)
            setTransaction(result);
        } catch (error: any) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchBreakdown();
        fetchTransaction();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <div className='flex justify-end mb-4'>
                <ReactToPrint
                    trigger={() => <button className='btn btn-neutral btn-xs'>Print</button>}
                    content={() => componentRef.current}
                />
            </div>

            {/* <button onClick={exportToPdf} className='btn btn-neutral btn-xs ml-2'>Export to PDF</button> */}
            <PrintableBreakDown ref={componentRef} transactionId={transactionId} breakdown={breakdown} transaction={transaction} />
        </div>
    );
};

// Set display name for the component
PrintableBreakDown.displayName = 'PrintableBreakDown';

export default BreakDown;
