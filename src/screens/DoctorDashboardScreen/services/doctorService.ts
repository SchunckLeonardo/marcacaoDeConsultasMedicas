import AsyncStorage from '@react-native-async-storage/async-storage';
import { DoctorAppointment } from '../models/appointment';

const APPOINTMENTS_KEY = '@MedicalApp:appointments';

export async function getAppointmentsForDoctor(doctorId: string): Promise<DoctorAppointment[]> {
  const stored = await AsyncStorage.getItem(APPOINTMENTS_KEY);
  const all = stored ? (JSON.parse(stored) as DoctorAppointment[]) : [];
  return all.filter((a) => a.doctorId === doctorId);
}

export async function updateAppointmentStatus(
  appointmentId: string,
  newStatus: 'confirmed' | 'cancelled'
): Promise<void> {
  const stored = await AsyncStorage.getItem(APPOINTMENTS_KEY);
  const all = stored ? (JSON.parse(stored) as DoctorAppointment[]) : [];
  const updated = all.map((a) => (a.id === appointmentId ? { ...a, status: newStatus } : a));
  await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
}


