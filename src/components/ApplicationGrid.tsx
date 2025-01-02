import React from 'react';
import { JobApplication } from '../types';
import { useState, useEffect } from 'react';
import { getApplications, updateApplication } from '../api/index';
interface ApplicationGridProps {
  applications: JobApplication[];
  onEdit: (application: JobApplication) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, field: 'applied' | 'interview' | 'offer', value: boolean) => void;
}
export const ApplicationGrid: React.FC<ApplicationGridProps> = ({ applications: initialApplications, onEdit, onDelete, onStatusChange }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [applications, setApplications] = useState(initialApplications);

    useEffect(() => {
        setApplications(initialApplications);
    }, [initialApplications]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await getApplications();
                setApplications(data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const handleStatusChange = async (id: string, field: 'applied' | 'interview' | 'offer', value: boolean) => {
        try {
            const application = applications.find(app => app.id === id);
            if (!application) return;
            
            const { id: _, ...applicationWithoutId } = application;
            const updatedApplication = {
                ...applicationWithoutId,
                [field]: value,
                createdAt: applicationWithoutId.createdAt || new Date(),
                updatedAt: new Date(),
                userId: applicationWithoutId.userId || 'default-user-id'
            };
            
            await updateApplication(id, updatedApplication);
            
            setApplications(applications.map(app =>
                app.id === id ? { ...app, [field]: value } : app
            ));
        } catch (error) {
            console.error('Error updating application:', error);
        }
    };

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="container mx-auto mt-8">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {applications.map((app) => (
          <div key={app.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{app.jobTitle}</h3>
                <p className="text-gray-600">{app.company}</p>
                <p className="text-gray-600">{app.salary}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(app)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(app.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={app.applied}
                  onChange={(e) => onStatusChange(app.id, 'applied', e.target.checked)}
                  className="rounded"
                />
                <span>Applied</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={app.interview}
                  onChange={(e) => onStatusChange(app.id, 'interview', e.target.checked)}
                  className="rounded"
                />
                <span>Interview</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={app.offer}
                  onChange={(e) => onStatusChange(app.id, 'offer', e.target.checked)}
                  className="rounded"
                />
                <span>Offer</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
            )}
        </div>
    );
};
