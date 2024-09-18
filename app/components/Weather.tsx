'use client';

import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FaSun, FaCloudRain, FaCloud, FaSnowflake, FaSmog, FaWind, FaQuestionCircle } from 'react-icons/fa'; // Import Font Awesome Icons

const WeatherComponent = () => {
    const [city, setCity] = useState<string>('Angeles City');
    const [weatherCondition, setWeatherCondition] = useState<string>('');
    const [temperature, setTemperature] = useState<string>('');
    const [windSpeed, setWindSpeed] = useState<string>('');
    const [error, setError] = useState<string>('');

    const fetchWeather = async () => {
        try {
            const response = await fetch(`https://wttr.in/${city}?format=%C+%t+%w`);
            if (!response.ok) {
                throw new Error('Unable to fetch weather data');
            }
            const result = await response.text();

            // Example result: "Partly cloudy +31°C ↑15km/h"
            const parts = result.split(' ');
            let condition: string = '', temp: string = '', wind: string = '';
            let count = parts.length;
            let i = 0;

            while (i <= count-3) {
                condition += parts[i] + ' ';
                i++;
            }
            temp = parts[count - 2];
            wind = parts[count - 1];


            setWeatherCondition(condition); // Combine the first two words for "Partly cloudy"
            setTemperature(temp);
            setWindSpeed(wind);
            setError('');
        } catch (error: any) {
            setError(error.message);
            setWeatherCondition('');
            setTemperature('');
            setWindSpeed('');
        }
    };

    // Function to map weather conditions to icons
    const getWeatherIcon = (condition: string) => {
        const lowerCaseCondition = condition.toLowerCase(); // Convert condition to lowercase for case-insensitive comparison

        if (lowerCaseCondition.includes('sunny') || lowerCaseCondition.includes('clear')) {
            return <FaSun className="text-yellow-500 text-7xl" />;
        } else if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('showers') || lowerCaseCondition.includes('drizzle')) {
            return <FaCloudRain className="text-blue-500 text-7xl" />;
        } else if (lowerCaseCondition.includes('cloudy') || lowerCaseCondition.includes('partly')) {
            return <FaCloud className="text-gray-500 text-7xl" />;
        } else if (lowerCaseCondition.includes('snow')) {
            return <FaSnowflake className="text-blue-300 text-7xl" />;
        } else if (lowerCaseCondition.includes('fog') || lowerCaseCondition.includes('haze') || lowerCaseCondition.includes('mist')) {
            return <FaSmog className="text-gray-400 text-7xl" />;
        } else if (lowerCaseCondition.includes('wind')) {
            return <FaWind className="text-gray-600 text-7xl" />;
        } else {
            return <FaQuestionCircle className="text-yellow-500 text-7xl" />; // Default to sun icon
        }
    };


    useEffect(() => {
        fetchWeather();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-center">Weather Information</h1>
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {weatherCondition && temperature && windSpeed && (
                <div className="mt-4 p-4 border-t border-gray-200 space-y-2">
                    <h2 className="text-xl font-semibold mb-2 text-center">Current Weather in {city}</h2>
                    <div className="flex justify-center items-center p-4">
                        {getWeatherIcon(weatherCondition)} {/* Display weather icon */}
                    </div>

                    <p className="text-left"><span className='font-semibold'>Date: </span>{moment(new Date()).format('MMM D, YYYY')}</p>
                    <p className="text-left"><span className='font-semibold'> Condition: </span> {weatherCondition}</p>
                    <p className="text-left"><span className='font-semibold'> Temperature: </span> {temperature}</p>
                    <p className="text-left"><span className='font-semibold'>Wind:</span> {windSpeed}</p>
                </div>
            )}
        </div>

    );
};

export default WeatherComponent;
