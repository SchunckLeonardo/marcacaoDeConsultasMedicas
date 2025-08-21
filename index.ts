/**
 * Bootstrap do aplicativo
 * Registra o componente raiz para ambiente Expo ou build nativo.
 */
import { registerRootComponent } from 'expo';

import App from './App';

// Bloco: registro do componente raiz e garantia de setup do ambiente Expo/Nativo
registerRootComponent(App);
