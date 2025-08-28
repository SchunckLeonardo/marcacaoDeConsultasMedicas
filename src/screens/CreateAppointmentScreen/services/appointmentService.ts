import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewAppointment } from '../models/appointment';

const APPOINTMENTS_KEY = '@MedicalApp:appointments';

export async function getAllAppointments(): Promise<NewAppointment[]> {
  const stored = await AsyncStorage.getItem(APPOINTMENTS_KEY);
  return stored ? (JSON.parse(stored) as NewAppointment[]) : [];
}

export async function saveAppointment(newAppointment: NewAppointment): Promise<void> {
  const all = await getAllAppointments();
  all.push(newAppointment);
  await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(all));
}


