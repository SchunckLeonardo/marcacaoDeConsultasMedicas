/**
 * Tela de criação de consulta (modularizada)
 */
import React, { useState } from 'react';
import { ScrollView, ViewStyle } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { saveAppointment } from './services/appointmentService';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList } from '../../types/navigation';
import theme from '../../styles/theme';
import Header from '../../components/Header';
import DoctorList from '../../components/DoctorList';
import TimeSlotList from '../../components/TimeSlotList';
import { Container, Title, SectionTitle, ErrorText } from './styles';

type CreateAppointmentScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateAppointment'>;
};

import { NewAppointment, Doctor } from './models/appointment';

const availableDoctors: Doctor[] = [
  { id: '1', name: 'Dr. João Silva', specialty: 'Cardiologia', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', name: 'Dra. Maria Santos', specialty: 'Pediatria', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: '3', name: 'Dr. Pedro Oliveira', specialty: 'Ortopedia', image: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { id: '4', name: 'Dra. Ana Costa', specialty: 'Dermatologia', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: '5', name: 'Dr. Carlos Mendes', specialty: 'Oftalmologia', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
];

const CreateAppointmentScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<CreateAppointmentScreenProps['navigation']>();
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateAppointment = async () => {
    try {
      setLoading(true);
      setError('');

      if (!date || !selectedTime || !selectedDoctor) {
        setError('Por favor, preencha a data e selecione um médico e horário');
        return;
      }

      const newAppointment: NewAppointment = {
        id: Date.now().toString(),
        patientId: user?.id || '',
        patientName: user?.name || '',
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date,
        time: selectedTime,
        specialty: selectedDoctor.specialty,
        status: 'pending',
      };

      await saveAppointment(newAppointment);

      alert('Consulta agendada com sucesso!');
      navigation.goBack();
    } catch (err) {
      setError('Erro ao agendar consulta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    scrollContent: { padding: 20 },
    input: { marginBottom: 15 },
    button: { marginTop: 10, width: '100%' },
    buttonStyle: { backgroundColor: theme.colors.primary, paddingVertical: 12 },
    cancelButton: { backgroundColor: theme.colors.secondary, paddingVertical: 12 },
  };

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Agendar Consulta</Title>

        <Input
          placeholder="Data (DD/MM/AAAA)"
          value={date}
          onChangeText={setDate}
          containerStyle={styles.input}
          keyboardType="numeric"
        />

        <SectionTitle>Selecione um Horário</SectionTitle>
        <TimeSlotList onSelectTime={setSelectedTime} selectedTime={selectedTime} />

        <SectionTitle>Selecione um Médico</SectionTitle>
        <DoctorList doctors={availableDoctors} onSelectDoctor={setSelectedDoctor} selectedDoctorId={selectedDoctor?.id} />

        {error ? <ErrorText>{error}</ErrorText> : null}

        <Button
          title="Agendar"
          onPress={handleCreateAppointment}
          loading={loading}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.cancelButton}
        />
      </ScrollView>
    </Container>
  );
};

export default CreateAppointmentScreen;


