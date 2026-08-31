import * as SecureStore from 'expo-secure-store';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { api } from '../services/api';
import { Role, User } from '../types';

type RegisterData = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

type AuthValue = {
  user: User | null;

  loading: boolean;

  login: (
    email: string,
    password: string,
  ) => Promise<void>;

  register: (
    data: RegisterData,
  ) => Promise<void>;

  logout: () => Promise<void>;
};

const AuthContext =
  createContext<AuthValue | undefined>(
    undefined,
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      console.log(
        '[Auth] Verificando sessão salva...',
      );

      try {
        const token =
          await SecureStore.getItemAsync(
            'schoolgo_token',
          );

        console.log(
          '[Auth] Token encontrado:',
          token ? 'SIM' : 'NÃO',
        );

        if (!token) {
          if (mounted) {
            setUser(null);
          }

          return;
        }

        try {
          console.log(
            '[Auth] Consultando /users/me...',
          );

          const response =
            await api.get('/users/me');

          console.log(
            '[Auth] /users/me respondeu:',
            response.status,
          );

          console.log(
            '[Auth] Usuário restaurado:',
            response.data?.email,
          );

          console.log(
            '[Auth] Perfil restaurado:',
            response.data?.role,
          );

          if (mounted) {
            setUser(response.data);
          }
        } catch (error: any) {
          console.error(
            '[Auth] Falha ao restaurar usuário.',
          );

          console.error(
            '[Auth] Status:',
            error?.response?.status,
          );

          console.error(
            '[Auth] Resposta:',
            error?.response?.data,
          );

          console.log(
            '[Auth] Limpando token salvo...',
          );

          await SecureStore.deleteItemAsync(
            'schoolgo_token',
          );

          if (mounted) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error(
          '[Auth] Erro ao acessar SecureStore:',
          error,
        );

        if (mounted) {
          setUser(null);
        }
      } finally {
        console.log(
          '[Auth] Carregamento inicial concluído.',
        );

        if (mounted) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  async function login(
    email: string,
    password: string,
  ) {
    console.log(
      '--------------------------------',
    );

    console.log(
      '[Auth] Iniciando login...',
    );

    console.log(
      '[Auth] E-mail:',
      email,
    );

    try {
      console.log(
        '[Auth] Enviando POST /auth/login...',
      );

      const startedAt = Date.now();

      const response = await api.post(
        '/auth/login',
        {
          email,
          password,
        },
      );

      const elapsed =
        Date.now() - startedAt;

      console.log(
        `[Auth] Resposta recebida em ${elapsed}ms.`,
      );

      console.log(
        '[Auth] HTTP status:',
        response.status,
      );

      console.log(
        '[Auth] Resposta contém usuário:',
        response.data?.user
          ? 'SIM'
          : 'NÃO',
      );

      console.log(
        '[Auth] Resposta contém accessToken:',
        response.data?.accessToken
          ? 'SIM'
          : 'NÃO',
      );

      const {
        accessToken,
        user: loggedUser,
      } = response.data;

      if (!accessToken) {
        console.error(
          '[Auth] ERRO: accessToken não retornado.',
        );

        throw new Error(
          'O servidor não retornou o token de acesso.',
        );
      }

      if (!loggedUser) {
        console.error(
          '[Auth] ERRO: usuário não retornado.',
        );

        throw new Error(
          'O servidor não retornou os dados do usuário.',
        );
      }

      console.log(
        '[Auth] Usuário autenticado:',
        loggedUser.email,
      );

      console.log(
        '[Auth] Perfil:',
        loggedUser.role,
      );

      console.log(
        '[Auth] Salvando token no SecureStore...',
      );

      await SecureStore.setItemAsync(
        'schoolgo_token',
        accessToken,
      );

      console.log(
        '[Auth] Token salvo com sucesso.',
      );

      console.log(
        '[Auth] Atualizando usuário no contexto...',
      );

      setUser(loggedUser);

      console.log(
        '[Auth] Login concluído com sucesso.',
      );
    } catch (error: any) {
      console.error(
        '================================',
      );

      console.error(
        '[Auth] LOGIN FALHOU',
      );

      console.error(
        '[Auth] Código:',
        error?.code ??
          'não informado',
      );

      console.error(
        '[Auth] Status HTTP:',
        error?.response?.status ??
          'sem resposta',
      );

      console.error(
        '[Auth] Status text:',
        error?.response?.statusText ??
          'não informado',
      );

      console.error(
        '[Auth] Resposta do servidor:',
        error?.response?.data ??
          'sem resposta',
      );

      console.error(
        '[Auth] Método:',
        error?.config?.method ??
          'não identificado',
      );

      console.error(
        '[Auth] Base URL:',
        error?.config?.baseURL ??
          'não identificada',
      );

      console.error(
        '[Auth] Endpoint:',
        error?.config?.url ??
          'não identificado',
      );

      if (
        error?.config?.baseURL &&
        error?.config?.url
      ) {
        console.error(
          '[Auth] URL FINAL:',
          `${error.config.baseURL}${error.config.url}`,
        );
      }

      console.error(
        '[Auth] Mensagem:',
        error?.message,
      );

      console.error(
        '================================',
      );

      throw error;
    }
  }

  async function register(
    data: RegisterData,
  ) {
    console.log(
      '--------------------------------',
    );

    console.log(
      '[Auth] Iniciando cadastro...',
    );

    console.log(
      '[Auth] E-mail:',
      data.email,
    );

    console.log(
      '[Auth] Perfil:',
      data.role,
    );

    try {
      console.log(
        '[Auth] Enviando POST /auth/register...',
      );

      const response = await api.post(
        '/auth/register',
        data,
      );

      console.log(
        '[Auth] HTTP status:',
        response.status,
      );

      const {
        accessToken,
        user: registeredUser,
      } = response.data;

      if (!accessToken) {
        throw new Error(
          'O servidor não retornou o token de acesso.',
        );
      }

      if (!registeredUser) {
        throw new Error(
          'O servidor não retornou os dados do usuário.',
        );
      }

      await SecureStore.setItemAsync(
        'schoolgo_token',
        accessToken,
      );

      setUser(registeredUser);

      console.log(
        '[Auth] Cadastro concluído com sucesso.',
      );
    } catch (error: any) {
      console.error(
        '[Auth] CADASTRO FALHOU',
      );

      console.error(
        '[Auth] Status:',
        error?.response?.status,
      );

      console.error(
        '[Auth] Resposta:',
        error?.response?.data,
      );

      console.error(
        '[Auth] Mensagem:',
        error?.message,
      );

      throw error;
    }
  }

  async function logout() {
    console.log(
      '[Auth] Iniciando logout...',
    );

    try {
      await SecureStore.deleteItemAsync(
        'schoolgo_token',
      );

      setUser(null);

      console.log(
        '[Auth] Logout realizado.',
      );
    } catch (error) {
      console.error(
        '[Auth] Erro ao realizar logout:',
        error,
      );

      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth deve ser utilizado dentro de AuthProvider.',
    );
  }

  return context;
}