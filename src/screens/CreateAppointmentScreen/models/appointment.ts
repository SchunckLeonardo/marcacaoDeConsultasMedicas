export type NewAppointment = {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  image: string;
};


