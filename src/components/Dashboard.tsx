// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { getApplications, createApplication, updateApplication, deleteApplication } from '../api/index';
import { Alert, AlertDescription } from './ui/alert';
import { Navbar } from './Navbar';
import { ApplicationGrid } from './ApplicationGrid';
import { ApplicationForm } from './ApplicationForm';
import { JobApplication } from '../types';
const Dashboard: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getApplications();
        setApplications(data);
      } catch (err) {
        setError('Failed to fetch applications. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleNewApplication = () => {
    setEditingApplication(null);
    setShowForm(true);
  };

  const handleSave = async (applicationData: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingApplication) {
        const updatedData = {
          ...applicationData,
          createdAt: editingApplication.createdAt || new Date(),
          updatedAt: new Date(),
          userId: editingApplication.userId || 'default-user-id'
        };
        const updated = await updateApplication(editingApplication.id, updatedData);
        setApplications(applications.map(app =>
          app.id === editingApplication.id ? updated : app
        ));
      } else {
        const newData = {
          ...applicationData,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'default-user-id'
        };
        const created = await createApplication(newData);
        setApplications([created, ...applications]);
      }
      setShowForm(false);
      setEditingApplication(null);
    } catch (err) {
      throw err;
    }
  };

  const handleEdit = (application: JobApplication) => {
    setEditingApplication(application);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApplication(id);
      setApplications(applications.filter(app => app.id !== id));
    } catch (err) {
      setError('Failed to delete application. Please try again.');
    }
  };

  const handleStatusChange = async (id: string, field: 'applied' | 'interview' | 'offer', value: boolean) => {
    try {
      const application = applications.find(app => app.id === id);
      if (!application) return;

      const updatedData = {
        ...application,
        [field]: value,
        createdAt: application.createdAt || new Date(),
        updatedAt: new Date(),
        userId: application.userId || 'default-user-id'
      };

      const updated = await updateApplication(id, updatedData);
      setApplications(applications.map(app =>
        app.id === id ? updated : app
      ));
    } catch (err) {
      setError(`Failed to update ${field} status. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onNewApplication={handleNewApplication} />
      {error && (
        <div className="container mx-auto mt-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      <ApplicationGrid
        applications={applications}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
      {showForm && (
        <ApplicationForm
          application={editingApplication || undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingApplication(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;