import { useState, useEffect } from 'react';
import { appointmentApi } from '../lib/api';
import { toast } from 'sonner';
import { Appointment } from '../lib/types';

export function useAppointments(businessId?: number) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (businessId) {
        response = await appointmentApi.getBusinessAppointments(businessId);
      } else {
        response = await appointmentApi.getUserAppointments();
      }

      if (response.success) {
        setAppointments(response.data);
      } else {
        setError(response.message || 'Failed to fetch appointments');
        toast.error(response.message || 'Failed to fetch appointments');
      }
    } catch (err) {
      setError('An error occurred while fetching appointments');
      toast.error('An error occurred while fetching appointments');
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await appointmentApi.createAppointment(appointmentData);
      if (response.success) {
        toast.success('Appointment created successfully');
        await fetchAppointments();
        return response.data;
      } else {
        toast.error(response.message || 'Failed to create appointment');
        throw new Error(response.message || 'Failed to create appointment');
      }
    } catch (err) {
      toast.error('An error occurred while creating appointment');
      throw err;
    }
  };

  const updateAppointment = async (appointmentId: number, appointmentData: Partial<Appointment>) => {
    try {
      const response = await appointmentApi.updateAppointment(appointmentId, appointmentData);
      if (response.success) {
        toast.success('Appointment updated successfully');
        await fetchAppointments();
        return response.data;
      } else {
        toast.error(response.message || 'Failed to update appointment');
        throw new Error(response.message || 'Failed to update appointment');
      }
    } catch (err) {
      toast.error('An error occurred while updating appointment');
      throw err;
    }
  };

  const deleteAppointment = async (appointmentId: number) => {
    try {
      const response = await appointmentApi.deleteAppointment(appointmentId);
      if (response.success) {
        toast.success('Appointment deleted successfully');
        await fetchAppointments();
      } else {
        toast.error(response.message || 'Failed to delete appointment');
        throw new Error(response.message || 'Failed to delete appointment');
      }
    } catch (err) {
      toast.error('An error occurred while deleting appointment');
      throw err;
    }
  };

  const updateStatus = async (appointmentId: number, status: Appointment['status']) => {
    try {
      const response = await appointmentApi.updateAppointmentStatus(appointmentId, status);
      if (response.success) {
        toast.success('Appointment status updated successfully');
        await fetchAppointments();
        return response.data;
      } else {
        toast.error(response.message || 'Failed to update appointment status');
        throw new Error(response.message || 'Failed to update appointment status');
      }
    } catch (err) {
      toast.error('An error occurred while updating appointment status');
      throw err;
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [businessId]);

  return {
    appointments,
    loading,
    error,
    refresh: fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    updateStatus
  };
} 