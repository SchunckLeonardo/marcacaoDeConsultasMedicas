/**
 * Gerenciamento de Usuários (modularizado)
 */
import React, { useState } from 'react';
import { ScrollView, ViewStyle, TextStyle } from 'react-native';
import { Button, ListItem, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList } from '../../types/navigation';
import theme from '../../styles/theme';
import Header from '../../components/Header';
import {
  Container,
  Title,
  UserCard,
  LoadingText,
  EmptyText,
  RoleBadge,
  RoleText,
  ButtonContainer,
} from './styles';

type UserManagementScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'UserManagement'>;
};

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
}

const UserManagementScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<UserManagementScreenProps['navigation']>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('@MedicalApp:users');
      if (storedUsers) {
        const allUsers: User[] = JSON.parse(storedUsers);
        const filteredUsers = allUsers.filter(u => u.id !== user?.id);
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const storedUsers = await AsyncStorage.getItem('@MedicalApp:users');
      if (storedUsers) {
        const allUsers: User[] = JSON.parse(storedUsers);
        const updatedUsers = allUsers.filter(u => u.id !== userId);
        await AsyncStorage.setItem('@MedicalApp:users', JSON.stringify(updatedUsers));
        loadUsers();
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadUsers();
    }, [])
  );

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'doctor':
        return 'Médico';
      case 'patient':
        return 'Paciente';
      default:
        return role;
    }
  };

  const styles = {
    scrollContent: { padding: 20 },
    button: { marginBottom: 20, width: '100%' },
    buttonStyle: { backgroundColor: theme.colors.primary, paddingVertical: 12 },
    backButton: { backgroundColor: theme.colors.secondary, paddingVertical: 12 },
    actionButton: { marginTop: 8, width: '48%' },
    editButton: { backgroundColor: theme.colors.primary, paddingVertical: 8 },
    deleteButton: { backgroundColor: theme.colors.error, paddingVertical: 8 },
    userName: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
    userEmail: { fontSize: 14, color: theme.colors.text, marginTop: 4 },
  };

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Gerenciar Usuários</Title>

        <Button
          title="Adicionar Novo Usuário"
          onPress={() => {}}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {loading ? (
          <LoadingText>Carregando usuários...</LoadingText>
        ) : users.length === 0 ? (
          <EmptyText>Nenhum usuário cadastrado</EmptyText>
        ) : (
          users.map((user) => (
            <UserCard key={user.id}>
              <ListItem.Content>
                <ListItem.Title style={styles.userName as TextStyle}>
                  {user.name}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.userEmail as TextStyle}>
                  {user.email}
                </ListItem.Subtitle>
                <RoleBadge role={user.role}>
                  <RoleText role={user.role}>
                    {getRoleText(user.role)}
                  </RoleText>
                </RoleBadge>
                <ButtonContainer>
                  <Button
                    title="Editar"
                    onPress={() => {}}
                    containerStyle={styles.actionButton as ViewStyle}
                    buttonStyle={styles.editButton}
                  />
                  <Button
                    title="Excluir"
                    onPress={() => handleDeleteUser(user.id)}
                    containerStyle={styles.actionButton as ViewStyle}
                    buttonStyle={styles.deleteButton}
                  />
                </ButtonContainer>
              </ListItem.Content>
            </UserCard>
          ))
        )}

        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.backButton}
        />
      </ScrollView>
    </Container>
  );
};

export default UserManagementScreen;


