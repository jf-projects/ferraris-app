'use client';

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register Chart.js components for bar chart
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);


interface Props {
    year: number;
}
const BartChart: React.FC<Props> = ({ year }) => {

    const [graphdata, setData] = useState<number[]>([]);

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/payment/annual?year=${year}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            console.log(result);
            setData(result);
        } catch (error: any) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year]);

    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
            {
                label: `${year} Payments`,
                data: graphdata,
                backgroundColor: [
                    '#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD',
                    '#E67E22', '#1ABC9C', '#2ECC71', '#3498DB', '#9B59B6',
                    '#F39C12', '#D35400',
                ],
                borderColor: [
                    '#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD',
                    '#E67E22', '#1ABC9C', '#2ECC71', '#3498DB', '#9B59B6',
                    '#F39C12', '#D35400',
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
                position: 'bottom' as const, // Ensure 'bottom' is correctly typed
                labels: {
                    boxWidth: 20,
                }
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `${context.dataset.label}: ${context.raw}`,
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Bar data={data} options={options} />;
};

export default BartChart;
