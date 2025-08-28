import AsyncStorage from '@react-native-async-storage/async-storage';
import { PatientAppointment } from '../models/appointment';

const APPOINTMENTS_KEY = '@MedicalApp:appointments';

export async function getAppointmentsForPatient(patientId: string): Promise<PatientAppointment[]> {
  const stored = await AsyncStorage.getItem(APPOINTMENTS_KEY);
  const all = stored ? (JSON.parse(stored) as PatientAppointment[]) : [];
  return all.filter((a) => a.patientId === patientId);
}


