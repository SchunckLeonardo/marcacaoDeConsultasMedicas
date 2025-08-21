/**
 * Serviço de consultas médicas (esqueleto)
 * Este arquivo centralizará operações relacionadas a consultas: criação, listagem e cancelamento.
 * Metodologia de comentários: cada bloco de execução possui comentário explicativo.
 */

import { Appointment } from '../types/appointments';

// Bloco: estado em memória simulando uma base de dados local de consultas
let appointmentsStore: Appointment[] = [];

export const appointmentsService = {
    /**
     * Lista todas as consultas registradas
     */
    async listAll(): Promise<Appointment[]> {
        // Bloco: retorno imediato do estado em memória
        return appointmentsStore;
    },

    /**
     * Cria uma nova consulta
     * @param data Dados parciais da consulta (exceto id)
     */
    async create(data: Omit<Appointment, 'id'>): Promise<Appointment> {
        // Bloco: geração de id simples e inserção no "banco" em memória
        const newAppointment: Appointment = {
            id: `apt-${appointmentsStore.length + 1}`,
            ...data,
        };
        appointmentsStore.push(newAppointment);
        return newAppointment;
    },

    /**
     * Cancela uma consulta pelo id
     */
    async cancel(id: string): Promise<Appointment | null> {
        // Bloco: busca por id e atualização do status
        const idx = appointmentsStore.findIndex((apt) => apt.id === id);
        if (idx === -1) return null;
        appointmentsStore[idx] = { ...appointmentsStore[idx], status: 'cancelled' };
        return appointmentsStore[idx];
    },
};


