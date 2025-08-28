/**
 * Painel do Administrador (modularizado)
 */
import React, { useState } from 'react';
import { ScrollView, ViewStyle, TextStyle } from 'react-native';
import { Button, ListItem, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { getAllAppointments, getAllUsers, updateAppointmentStatus } from './services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList } from '../../types/navigation';
import theme from '../../styles/theme';
import Header from '../../components/Header';
import {
  Container,
  Title,
  SectionTitle,
  AppointmentCard,
  LoadingText,
  EmptyText,
  StatusBadge,
  StatusText,
  ButtonContainer,
} from './styles';

type AdminDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AdminDashboard'>;
};

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
}

const AdminDashboardScreen: React.FC = () => {
  const { signOut } = useAuth();
  const navigation = useNavigation<AdminDashboardScreenProps['navigation']>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [apts, users] = await Promise.all([
        getAllAppointments(),
        getAllUsers(),
      ]);
      setAppointments(apts);
      setUsers(users);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const handleUpdateStatus = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      loadData();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const styles = {
    scrollContent: { padding: 20 },
    button: { marginBottom: 20, width: '100%' },
    buttonStyle: { backgroundColor: theme.colors.primary, paddingVertical: 12 },
    logoutButton: { backgroundColor: theme.colors.error, paddingVertical: 12 },
    actionButton: { marginTop: 8, width: '48%' },
    confirmButton: { backgroundColor: theme.colors.success, paddingVertical: 8 },
    cancelButton: { backgroundColor: theme.colors.error, paddingVertical: 8 },
    doctorName: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
    specialty: { fontSize: 14, color: theme.colors.text, marginTop: 4 },
    dateTime: { fontSize: 14, color: theme.colors.text, marginTop: 4 },
  };

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Painel Administrativo</Title>

        <Button
          title="Gerenciar Usuários"
          onPress={() => navigation.navigate('UserManagement')}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        <Button
          title="Meu Perfil"
          onPress={() => navigation.navigate('Profile')}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        <SectionTitle>Últimas Consultas</SectionTitle>
        {loading ? (
          <LoadingText>Carregando dados...</LoadingText>
        ) : appointments.length === 0 ? (
          <EmptyText>Nenhuma consulta agendada</EmptyText>
        ) : (
          appointments.map((appointment) => (
            <AppointmentCard key={appointment.id}>
              <ListItem.Content>
                <ListItem.Title style={styles.doctorName as TextStyle}>
                  {appointment.doctorName}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.specialty as TextStyle}>
                  {appointment.specialty}
                </ListItem.Subtitle>
                <Text style={styles.dateTime as TextStyle}>
                  {appointment.date} às {appointment.time}
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

export default AdminDashboardScreen;


