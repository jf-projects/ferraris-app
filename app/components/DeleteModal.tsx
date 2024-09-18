import React from 'react'

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onDelete })  => {
    if (!isOpen) return null;
    
    return (
        <div>
            if (!isOpen) return null;

            return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-96">
                    <div className="px-6 py-4">
                        <h2 className="text-xl font-semibold text-gray-800">Delete Confirmation</h2>
                        <p className="mt-2 text-gray-600">Are you sure you want to delete this item? This action cannot be undone.</p>
                    </div>
                    <div className="flex justify-end px-6 py-4 space-x-2 border-t">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onDelete}
                            className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            );
        </div>
    )
}

export default DeleteModal