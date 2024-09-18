// pages/not-authorized.tsx
import { FC } from 'react';

const NotAuthorized: FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg">You do not have permission to view this page.</p>
      </div>
    </div>
  );
};

export default NotAuthorized;
