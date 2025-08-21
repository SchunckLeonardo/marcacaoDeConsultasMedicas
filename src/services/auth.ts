/**
 * Serviço de autenticação
 * Responsável por: login, registro, persistência e recuperação de usuário, e utilidades do admin.
 * Metodologia de comentários: cada bloco de execução é antecedido por um comentário explicativo.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

// Bloco: Definição das chaves utilizadas no AsyncStorage para persistência local
const STORAGE_KEYS = {
    USER: '@MedicalApp:user',
    TOKEN: '@MedicalApp:token',
    REGISTERED_USERS: '@MedicalApp:registeredUsers',
};

// Bloco: Lista mockada de médicos com credenciais simplificadas (senha padrão em signIn)
const mockDoctors = [
    {
        id: '1',
        name: 'Dr. João Silva',
        email: 'joao@example.com',
        role: 'doctor' as const,
        specialty: 'Cardiologia',
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
        id: '2',
        name: 'Dra. Maria Santos',
        email: 'maria@example.com',
        role: 'doctor' as const,
        specialty: 'Pediatria',
        image: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
        id: '3',
        name: 'Dr. Pedro Oliveira',
        email: 'pedro@example.com',
        role: 'doctor' as const,
        specialty: 'Ortopedia',
        image: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
];

// Bloco: Usuário admin mockado com permissões elevadas
const mockAdmin = {
    id: 'admin',
    name: 'Administrador',
    email: 'admin@example.com',
    role: 'admin' as const,
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
};

// Bloco: Estado em memória para usuários cadastrados (pacientes)
let registeredUsers: User[] = [];

export const authService = {
    /**
     * Realiza autenticação do usuário (admin, médico ou paciente)
     * - Fluxo: verifica admin -> verifica médico -> verifica paciente
     * @param credentials Credenciais de login (email, password)
     * @returns Objeto com usuário autenticado e token correspondente
     * @throws Error caso email/senha não correspondam a um usuário válido
     */
    async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
        // Bloco: verificação de credenciais do admin
        if (credentials.email === mockAdmin.email && credentials.password === '123456') {
            return {
                user: mockAdmin,
                token: 'admin-token',
            };
        }

        // Bloco: verificação de credenciais de médico
        const doctor = mockDoctors.find(
            (d) => d.email === credentials.email && credentials.password === '123456'
        );
        if (doctor) {
            return {
                user: doctor,
                token: `doctor-token-${doctor.id}`,
            };
        }

        // Bloco: verificação de credenciais de paciente registrado
        const patient = registeredUsers.find(
            (p) => p.email === credentials.email
        );
        if (patient) {
            // Bloco: validação de senha para paciente (senha padrão)
            if (credentials.password === '123456') {
                return {
                    user: patient,
                    token: `patient-token-${patient.id}`,
                };
            }
        }

        throw new Error('Email ou senha inválidos');
    },

    /**
     * Registra um novo paciente no sistema
     * - Fluxo: valida duplicidade de email -> cria paciente -> persiste em AsyncStorage
     * @param data Dados de cadastro (name, email)
     * @returns Objeto com novo usuário paciente e token gerado
     * @throws Error caso o email já esteja em uso
     */
    async register(data: RegisterData): Promise<AuthResponse> {
        // Bloco: validação de e-mail único (checa em médicos, admin e pacientes já registrados)
        if (
            mockDoctors.some((d) => d.email === data.email) ||
            mockAdmin.email === data.email ||
            registeredUsers.some((u) => u.email === data.email)
        ) {
            throw new Error('Email já está em uso');
        }

        // Bloco: criação do objeto de paciente
        const newPatient: User = {
            id: `patient-${registeredUsers.length + 1}`,
            name: data.name,
            email: data.email,
            role: 'patient' as const,
            image: `https://randomuser.me/api/portraits/${registeredUsers.length % 2 === 0 ? 'men' : 'women'}/${registeredUsers.length + 1
                }.jpg`,
        };

        registeredUsers.push(newPatient);

        // Bloco: persistência da lista atualizada de pacientes
        await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registeredUsers));

        return {
            user: newPatient,
            token: `patient-token-${newPatient.id}`,
        };
    },

    /**
     * Efetua logout limpando dados persistidos do usuário e token
     */
    async signOut(): Promise<void> {
        // Bloco: remoção de chaves relacionadas ao usuário autenticado
        await AsyncStorage.removeItem(STORAGE_KEYS.USER);
        await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    },

    /**
     * Obtém o usuário armazenado no AsyncStorage (se houver)
     * @returns Usuário persistido ou null em caso de ausência/erro
     */
    async getStoredUser(): Promise<User | null> {
        try {
            // Bloco: leitura e desserialização do usuário persistido
            const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
            if (userJson) {
                return JSON.parse(userJson);
            }
            return null;
        } catch (error) {
            console.error('Erro ao obter usuário armazenado:', error);
            return null;
        }
    },

    // Bloco: Funções auxiliares para o admin acompanhar usuários e médicos
    /**
     * Retorna a lista de todos os usuários (médicos mockados + pacientes registrados)
     */
    async getAllUsers(): Promise<User[]> {
        return [...mockDoctors, ...registeredUsers];
    },

    /**
     * Retorna a lista de médicos mockados
     */
    async getAllDoctors(): Promise<User[]> {
        return mockDoctors;
    },

    /**
     * Retorna somente os pacientes registrados
     */
    async getPatients(): Promise<User[]> {
        return registeredUsers;
    },

    /**
     * Carrega a lista de pacientes registrados a partir do AsyncStorage
     * Recomenda-se chamar este método durante a inicialização do app
     */
    async loadRegisteredUsers(): Promise<void> {
        try {
            // Bloco: leitura e restauração do estado em memória
            const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
            if (usersJson) {
                registeredUsers = JSON.parse(usersJson);
            }
        } catch (error) {
            console.error('Erro ao carregar usuários registrados:', error);
        }
    },
};