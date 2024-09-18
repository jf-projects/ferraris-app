'use client';

import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

// Register Chart.js components for pie chart
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);


interface Props {
    year: number;
}
const PieChart: React.FC<Props> = ({ year }) => {
    const [graphdata, setData] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/lot-transactions/report?year=${year}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();

            // result.paymentDate = moment(result.paymentDate).format('YYYY-MM-DD');
            // console.log(result)
            console.log(result)
            setData(result);
        } catch (error: any) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year]);

    // Define the data for the chart
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
            {
                label: 'Colors',
                data: graphdata,
                backgroundColor: [
                    '#FF5733', // Vibrant Red-Orange
                    '#33FF57', // Bright Green
                    '#3357FF', // Electric Blue
                    '#F1C40F', // Sun Yellow
                    '#8E44AD', // Deep Purple
                    '#E67E22', // Tangerine
                    '#1ABC9C', // Turquoise
                    '#2ECC71', // Fresh Green
                    '#3498DB', // Sky Blue
                    '#9B59B6', // Lavender
                    '#F39C12', // Goldenrod
                    '#D35400', // Burnt Orange
                ],
                borderColor: [
                    '#FF5733', // Vibrant Red-Orange
                    '#33FF57', // Bright Green
                    '#3357FF', // Electric Blue
                    '#F1C40F', // Sun Yellow
                    '#8E44AD', // Deep Purple
                    '#E67E22', // Tangerine
                    '#1ABC9C', // Turquoise
                    '#2ECC71', // Fresh Green
                    '#3498DB', // Sky Blue
                    '#9B59B6', // Lavender
                    '#F39C12', // Goldenrod
                    '#D35400', // Burnt Orange
                ],
                borderWidth: 1,
            },
        ],
    };

    // Define chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const, // Ensure 'top' is correctly typed
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `${context.label}: ${context.raw}`,
                },
            },
        },
    };

    return <Pie data={data} options={options} />;
};

export default PieChart;
