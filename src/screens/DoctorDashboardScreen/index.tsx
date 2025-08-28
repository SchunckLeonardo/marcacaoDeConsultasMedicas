/**
 * Painel do Médico (modularizado)
 */
import React, { useState } from 'react';
import { ScrollView, ViewStyle, TextStyle } from 'react-native';
import { Button, ListItem, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { getAppointmentsForDoctor, updateAppointmentStatus } from './services/doctorService';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList } from '../../types/navigation';
import theme from '../../styles/theme';
import Header from '../../components/Header';
import {
  Container,
  Title,
  AppointmentCard,
  LoadingText,
  EmptyText,
  StatusBadge,
  StatusText,
  ButtonContainer,
} from './styles';

type DoctorDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DoctorDashboard'>;
};

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const DoctorDashboardScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<DoctorDashboardScreenProps['navigation']>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const doctorAppointments = await getAppointmentsForDoctor(user?.id || '');
      setAppointments(doctorAppointments);
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      loadAppointments();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadAppointments();
    }, [])
  );

  const styles = {
    scrollContent: { padding: 20 },
    patientName: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
    specialty: { fontSize: 14, fontWeight: '500', color: theme.colors.text },
    button: { marginBottom: 20, width: '100%' },
    buttonStyle: { backgroundColor: theme.colors.primary, paddingVertical: 12 },
    logoutButton: { backgroundColor: theme.colors.error, paddingVertical: 12 },
    actionButton: { marginTop: 8, width: '48%' },
    confirmButton: { backgroundColor: theme.colors.success, paddingVertical: 8 },
    cancelButton: { backgroundColor: theme.colors.error, paddingVertical: 8 },
    dateTime: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  };

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Minhas Consultas</Title>

        <Button
          title="Meu Perfil"
          onPress={() => navigation.navigate('Profile')}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {loading ? (
          <LoadingText>Carregando consultas...</LoadingText>
        ) : appointments.length === 0 ? (
          <EmptyText>Nenhuma consulta agendada</EmptyText>
        ) : (
          appointments.map((appointment) => (
            <AppointmentCard key={appointment.id}>
              <ListItem.Content>
                <ListItem.Title style={styles.patientName as TextStyle}>
                  Paciente: {appointment.patientName || 'Nome não disponível'}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.dateTime as TextStyle}>
                  {appointment.date} às {appointment.time}
                </ListItem.Subtitle>
                <Text style={styles.specialty as TextStyle}>
                  {appointment.specialty}
                </Text>
                <StatusBadge status={appointment.status}>
                  <StatusText status={appointment.status}>
                    {appointment.status === 'confirmed' ? 'Confirmada' : appointment.status === 'cancelled' ? 'Cancelada' : 'Pendente'}
                  </StatusText>
                </StatusBadge>
                {appointment.status === 'pending' && (
                  <ButtonContainer>
                    <Button
                      title="Confirmar"
                      onPress={() => handleUpdateStatus(appointment.id, 'confirmed')}
                      containerStyle={styles.actionButton as ViewStyle}
                      buttonStyle={styles.confirmButton}
                    />
                    <Button
                      title="Cancelar"
                      onPress={() => handleUpdateStatus(appointment.id, 'cancelled')}
                      containerStyle={styles.actionButton as ViewStyle}
                      buttonStyle={styles.cancelButton}
                    />
                  </ButtonContainer>
                )}
              </ListItem.Content>
            </AppointmentCard>
          ))
        )}

        <Button
          title="Sair"
          onPress={signOut}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.logoutButton}
        />
      </ScrollView>
    </Container>
  );
};

export default DoctorDashboardScreen;


