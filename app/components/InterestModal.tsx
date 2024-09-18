import React from 'react'

interface InterestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    changeInterest: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    interestDate: string;
}

const InterestModal: React.FC<InterestModalProps> = ({ isOpen, onClose, onSave, changeInterest,interestDate }) => {
    if (!isOpen) return null;

    return (
        <div>
            if (!isOpen) return null;

            return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-96">

                    <div className="px-6 py-4">
                        <h2 className="text-xl font-semibold text-gray-800 pb-6">Set Interest Implementation</h2>
                        <label htmlFor="interestDate" className="block text-sm text-gray-700 mb-2 font-bold">
                            Interest Implementation Date
                        </label>
                        <input
                            type="date"
                            id="interestDate"
                            name="interestDate"
                            onChange={changeInterest}
                            value={interestDate}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        />
                    </div>

                    <div className="flex justify-end px-6 py-4 space-x-2 border-t">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSave}
                            className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
            );
        </div>
    )
}

export default InterestModal