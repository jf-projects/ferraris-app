'use client';

import { useState } from 'react';
import DashboardLayout from './dashboard/layout';
import PaymentGraph from './components/PaymentGraph';
import PieChart from './components/SoldPieChart';
import WeatherComponent from './components/Weather';

export default function HomePage() {
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i); // Create an array of the last 30 years

  return (
    <DashboardLayout>
      <div className="mb-4">
        <label htmlFor="year" className="font-bold mr-2">Select Year:</label>
        <select
          id="year"
          value={selectedYear}
          onChange={handleYearChange}
          className="p-2 border border-gray-300 rounded"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-slate-50 p-4 col-span-2 min-h-[25rem]">
          <h2 className="text-2xl font-bold pb-3">Monthly Payment</h2>
          <PaymentGraph year={selectedYear} />
        </div>
        <div className="bg-slate-50 p-4">
          <h2 className="text-2xl font-bold  pb-3">Units Sold</h2>
          <PieChart year={selectedYear} />
        </div>
        <div className="bg-slate-50 p-4">
          <WeatherComponent />
        </div>
      </div>
    </DashboardLayout>
  );
}
