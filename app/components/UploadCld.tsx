// UploadPage.tsx
'use client';
import React, { useState } from 'react';
import { CldUploadWidget, CldImage } from 'next-cloudinary';

interface CloudinaryResult {
    url: string;
}

interface UploadPageProps {
    onPublicIdChange: (id: string) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onPublicIdChange }) => {

    const [publicId, setPublicId] = useState<string>('');

    const handleSuccess = (result: any, widget: any) => {
      if (!result.event) return;
      const info = result.info as CloudinaryResult;
      setPublicId(info.url);
      onPublicIdChange(info.url); 
    };

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>, open: () => void) => {
        event.preventDefault();
        open(); 
    };

    return (
        <>
            <CldUploadWidget
                options={{
                    sources: ['local'],
                    multiple: false,
                }}
                onSuccess={handleSuccess}
                uploadPreset="fd7sncbd"
            >
                {({ open }: { open: () => void }) => (
                    <button
                        className='btn btn-outline btn-sm'
                        onClick={(event) => handleButtonClick(event, open)}
                    >
                        Upload an Image
                    </button>
                )}
            </CldUploadWidget>
        </>
    );
};

export default UploadPage;
