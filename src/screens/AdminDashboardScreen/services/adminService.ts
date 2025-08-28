import AsyncStorage from '@react-native-async-storage/async-storage';
import { AdminAppointment } from '../models/appointment';
import { AdminUser } from '../models/user';

const APPOINTMENTS_KEY = '@MedicalApp:appointments';
const USERS_KEY = '@MedicalApp:users';

export async function getAllAppointments(): Promise<AdminAppointment[]> {
  const stored = await AsyncStorage.getItem(APPOINTMENTS_KEY);
  return stored ? (JSON.parse(stored) as AdminAppointment[]) : [];
}

export async function getAllUsers(): Promise<AdminUser[]> {
  const stored = await AsyncStorage.getItem(USERS_KEY);
  return stored ? (JSON.parse(stored) as AdminUser[]) : [];
}

export async function updateAppointmentStatus(
  appointmentId: string,
  newStatus: 'confirmed' | 'cancelled'
): Promise<void> {
  const all = await getAllAppointments();
  const updated = all.map((a) => (a.id === appointmentId ? { ...a, status: newStatus } : a));
  await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
}


