"use client";

import React from 'react';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
// import templateFile from './template.docx'; // Import your DOCX template file

interface DocxDownloaderProps {
    params: any; // You can replace 'any' with a more specific type based on your data structure
}

const DocxDownloader: React.FC<DocxDownloaderProps> = ({ params }) => {
    function convertNumberToWords(number: number): string {
        if (number === 0) return 'ZERO';

        const units = [
            '', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE',
            'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'
        ];

        const tens = [
            '', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'
        ];

        const scales = ['', 'THOUSAND', 'MILLION'];

        const getBelowHundred = (n: number): string => {
            if (n < 20) {
                return units[n];
            } else {
                const unit = n % 10;
                return tens[Math.floor(n / 10)] + (unit ? ` ${units[unit]}` : '');
            }
        };

        const getBelowThousand = (n: number): string => {
            const hundred = Math.floor(n / 100);
            const remainder = n % 100;
            const hundredText = hundred ? `${units[hundred]} HUNDRED` : '';
            const remainderText = remainder ? ` ${getBelowHundred(remainder)}` : '';
            return hundredText + remainderText;
        };

        const result = [];
        let scaleIndex = 0;

        while (number > 0) {
            const chunk = number % 1000;
            if (chunk) {
                const chunkText = getBelowThousand(chunk);
                result.unshift(chunkText + (scales[scaleIndex] ? ` ${scales[scaleIndex]}` : ''));
            }
            number = Math.floor(number / 1000);
            scaleIndex++;
        }

        return result.join(' ').trim();
    }

    // Usage example:


    const downloadDocx = async () => {
        // Fetch the DOCX template file
        const response = await fetch('/template.docx');
        const templateArrayBuffer = await response.arrayBuffer();

        // Load the DOCX template with PizZip
        const zip = new PizZip(templateArrayBuffer);

        // Create a Docxtemplater instance and load the template
        const doc = new Docxtemplater(zip);

        // Set the template variables
        const per_sqm = Math.round(params.propertyTotalAmount / params.sqm);

        doc.setData({
            client_name: `${params.client.firstName} ${params.client.lastName}`.toUpperCase(),
            client_address: params.client.address.toUpperCase(),
            property_size_total: convertNumberToWords(params.totalPropertySize),
            property_size_number: params.totalPropertySize,
            property_amount_total: convertNumberToWords(params.propertyTotalAmount),
            property_amount_number: params.propertyTotalAmount,
            amount_increment: params.incrementAmount,
            interest_word: convertNumberToWords(params.interest),
            amount_interest: params.interest,
            price_sqm: convertNumberToWords(per_sqm),
            sqm_number: (per_sqm),
            payment_terms_years: params.paymentTerms,
        });

        try {
            // Render the DOCX with the injected data
            doc.render();
        } catch (error) {
            console.error('Error rendering document:', error);
        }

        // Generate the final DOCX file
        const blob = doc.getZip().generate({ type: 'blob' });

        // Save the generated DOCX file
        saveAs(blob, `${params.client.firstName} ${params.client.lastName}.docx`);
    };

    return (
        <button className='btn btn-xs btn-info text-white px-2 py-1 rounded hover:bg-blue-600 tooltip tooltip-right'  title="Download Contract Template" onClick={downloadDocx}>Contract</button>
    );
};

export default DocxDownloader;
