/**
 * Contexto de autenticação
 * Centraliza estado do usuário e operações de login/registro/logout.
 * Metodologia: cada bloco de execução possui comentário descritivo.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/auth';
import { User, LoginCredentials, RegisterData, AuthContextData } from '../types/auth';

// Bloco: chaves utilizadas no AsyncStorage para persistência do usuário/autenticação
const STORAGE_KEYS = {
    USER: '@MedicalApp:user',
    TOKEN: '@MedicalApp:token',
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Bloco: estados do contexto (usuário autenticado e indicador de carregamento)
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Bloco: rotina inicial de carregamento dos dados persistidos
        loadStoredUser();
        loadRegisteredUsers();
    }, []);

    // Bloco: carrega usuário previamente armazenado para manter sessão
    const loadStoredUser = async () => {
        try {
            const storedUser = await authService.getStoredUser();
            if (storedUser) {
                setUser(storedUser);
            }
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
        } finally {
            setLoading(false);
        }
    };

    // Bloco: carrega pacientes registrados do armazenamento (suporte a login de paciente)
    const loadRegisteredUsers = async () => {
        try {
            await authService.loadRegisteredUsers();
        } catch (error) {
            console.error('Erro ao carregar usuários registrados:', error);
        }
    };

    // Bloco: efetua login e persiste usuário + token
    const signIn = async (credentials: LoginCredentials) => {
        try {
            const response = await authService.signIn(credentials);
            setUser(response.user);
            await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
            await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
        } catch (error) {
            throw error;
        }
    };

    // Bloco: registra novo paciente, define como usuário atual e persiste dados
    const register = async (data: RegisterData) => {
        try {
            const response = await authService.register(data);
            setUser(response.user);
            await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
            await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
        } catch (error) {
            throw error;
        }
    };

    // Bloco: finaliza a sessão e limpa dados persistidos
    const signOut = async () => {
        try {
            await authService.signOut();
            setUser(null);
            await AsyncStorage.removeItem(STORAGE_KEYS.USER);
            await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        // Bloco: provê estado e ações de autenticação para a árvore de componentes
        <AuthContext.Provider value={{ user, loading, signIn, register, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};