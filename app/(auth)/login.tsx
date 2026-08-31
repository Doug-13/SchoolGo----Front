import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '../../src/contexts/AuthContext';

type LoginStatusType =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

function getLoginErrorMessage(error: any): string {
  const status = error?.response?.status;
  const serverMessage =
    error?.response?.data?.message;

  console.log(
    '[Login] HTTP status:',
    status ?? 'sem resposta HTTP',
  );

  console.log(
    '[Login] Resposta do servidor:',
    error?.response?.data ?? 'sem resposta',
  );

  if (!error?.response) {
    if (error?.code === 'ECONNABORTED') {
      return (
        'O servidor demorou demais para responder. ' +
        'Verifique sua conexão e tente novamente.'
      );
    }

    if (error?.code === 'ERR_NETWORK') {
      return (
        'Não foi possível conectar ao servidor do SchoolGo. ' +
        'Verifique se o Back está rodando e se o endereço da API está correto.'
      );
    }

    return (
      'Não foi possível conectar ao servidor do SchoolGo. ' +
      'Verifique sua conexão e tente novamente.'
    );
  }

  if (status === 400) {
    if (Array.isArray(serverMessage)) {
      return serverMessage.join('\n');
    }

    return (
      serverMessage ||
      'Os dados informados são inválidos.'
    );
  }

  if (status === 401) {
    return 'E-mail ou senha incorretos.';
  }

  if (status === 403) {
    return (
      'Sua conta não possui permissão para acessar o SchoolGo.'
    );
  }

  if (status === 404) {
    return (
      'A rota de login não foi encontrada no servidor. ' +
      'Verifique a configuração da API.'
    );
  }

  if (status >= 500) {
    return (
      'O servidor encontrou um problema interno. ' +
      'Tente novamente em alguns instantes.'
    );
  }

  if (Array.isArray(serverMessage)) {
    return serverMessage.join('\n');
  }

  if (
    typeof serverMessage === 'string'
  ) {
    return serverMessage;
  }

  return (
    error?.message ||
    'Não foi possível realizar o login.'
  );
}

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [busy, setBusy] =
    useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    emailFocused,
    setEmailFocused,
  ] = useState(false);

  const [
    passwordFocused,
    setPasswordFocused,
  ] = useState(false);

  const [
    statusMessage,
    setStatusMessage,
  ] = useState('');

  const [
    statusType,
    setStatusType,
  ] = useState<LoginStatusType>(
    'idle',
  );

  async function go() {
    const normalizedEmail =
      email.trim().toLowerCase();

    console.log(
      '================================',
    );

    console.log(
      '[Login] Botão Entrar pressionado',
    );

    console.log(
      '[Login] E-mail:',
      normalizedEmail ||
        '(não informado)',
    );

    if (
      !normalizedEmail ||
      !password.trim()
    ) {
      console.warn(
        '[Login] E-mail ou senha não preenchidos.',
      );

      setStatusType('error');

      setStatusMessage(
        'Informe seu e-mail e senha.',
      );

      Alert.alert(
        'Dados incompletos',
        'Informe seu e-mail e senha.',
      );

      return;
    }

    try {
      setBusy(true);

      setStatusType('loading');

      setStatusMessage(
        'Conectando ao SchoolGo...',
      );

      console.log(
        '[Login] Iniciando autenticação...',
      );

      const startedAt = Date.now();

      await login(
        normalizedEmail,
        password,
      );

      const elapsed =
        Date.now() - startedAt;

      console.log(
        `[Login] Login realizado com sucesso em ${elapsed}ms.`,
      );

      setStatusType('success');

      setStatusMessage(
        'Login realizado com sucesso. Entrando...',
      );
    } catch (error: any) {
      console.error(
        '[Login] Falha durante autenticação:',
        error,
      );

      console.error(
        '[Login] Código:',
        error?.code,
      );

      console.error(
        '[Login] Status HTTP:',
        error?.response?.status,
      );

      console.error(
        '[Login] URL:',
        error?.config?.baseURL &&
          error?.config?.url
          ? `${error.config.baseURL}${error.config.url}`
          : 'não identificada',
      );

      const message =
        getLoginErrorMessage(error);

      console.error(
        '[Login] Mensagem apresentada:',
        message,
      );

      setStatusType('error');

      setStatusMessage(message);

      Alert.alert(
        'Não foi possível entrar',
        message,
        [
          {
            text: 'OK',
          },
        ],
      );
    } finally {
      console.log(
        '[Login] Finalizando tentativa.',
      );

      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#246BFD"
      />

      <KeyboardAvoidingView
        style={s.container}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            s.scrollContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          <View style={s.header}>
            <View style={s.circleOne} />
            <View style={s.circleTwo} />

            <View style={s.brand}>
              <View style={s.logo}>
                <Text
                  style={s.logoEmoji}
                >
                  🚌
                </Text>

                <View
                  style={s.logoBadge}
                >
                  <View
                    style={
                      s.logoBadgeDot
                    }
                  />
                </View>
              </View>

              <Text style={s.brandName}>
                SchoolGo
              </Text>

              <Text style={s.tagline}>
                Segurança em cada trajeto.
              </Text>

              <Text
                style={s.description}
              >
                Acompanhe o transporte
                escolar do embarque até a
                chegada.
              </Text>
            </View>
          </View>

          <View style={s.content}>
            <View style={s.card}>
              <View
                style={s.cardHeader}
              >
                <Text
                  style={s.welcome}
                >
                  Bem-vindo 👋
                </Text>

                <Text
                  style={
                    s.welcomeDescription
                  }
                >
                  Entre na sua conta para
                  acompanhar o transporte
                  escolar.
                </Text>
              </View>

              <View style={s.field}>
                <Text style={s.label}>
                  E-mail
                </Text>

                <View
                  style={[
                    s.inputWrapper,
                    emailFocused &&
                      s.inputWrapperFocused,
                  ]}
                >
                  <View
                    style={s.iconBox}
                  >
                    <Text
                      style={s.emailIcon}
                    >
                      @
                    </Text>
                  </View>

                  <TextInput
                    style={s.input}
                    placeholder="seu@email.com"
                    placeholderTextColor="#98A2B3"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    value={email}
                    editable={!busy}
                    onChangeText={
                      setEmail
                    }
                    onFocus={() =>
                      setEmailFocused(true)
                    }
                    onBlur={() =>
                      setEmailFocused(false)
                    }
                    returnKeyType="next"
                  />
                </View>
              </View>

              <View style={s.field}>
                <View
                  style={s.passwordHeader}
                >
                  <Text style={s.label}>
                    Senha
                  </Text>

                  <Pressable
                    disabled={busy}
                    hitSlop={10}
                  >
                    <Text
                      style={s.forgot}
                    >
                      Esqueci minha senha
                    </Text>
                  </Pressable>
                </View>

                <View
                  style={[
                    s.inputWrapper,
                    passwordFocused &&
                      s.inputWrapperFocused,
                  ]}
                >
                  <View
                    style={s.iconBox}
                  >
                    <Text
                      style={
                        s.passwordIcon
                      }
                    >
                      ●
                    </Text>
                  </View>

                  <TextInput
                    style={s.input}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#98A2B3"
                    secureTextEntry={
                      !showPassword
                    }
                    value={password}
                    editable={!busy}
                    onChangeText={
                      setPassword
                    }
                    onFocus={() =>
                      setPasswordFocused(
                        true,
                      )
                    }
                    onBlur={() =>
                      setPasswordFocused(
                        false,
                      )
                    }
                    returnKeyType="done"
                    onSubmitEditing={go}
                  />

                  <Pressable
                    style={
                      s.showPassword
                    }
                    onPress={() =>
                      setShowPassword(
                        previous =>
                          !previous,
                      )
                    }
                    disabled={busy}
                  >
                    <Text
                      style={
                        s.showPasswordText
                      }
                    >
                      {showPassword
                        ? 'Ocultar'
                        : 'Mostrar'}
                    </Text>
                  </Pressable>
                </View>
              </View>

              <Pressable
                disabled={busy}
                onPress={go}
                style={({ pressed }) => [
                  s.loginButton,
                  pressed &&
                    !busy &&
                    s.loginButtonPressed,
                  busy &&
                    s.loginButtonDisabled,
                ]}
              >
                <Text
                  style={
                    s.loginButtonText
                  }
                >
                  {busy
                    ? 'Entrando...'
                    : 'Entrar'}
                </Text>

                {!busy && (
                  <Text
                    style={
                      s.loginButtonArrow
                    }
                  >
                    →
                  </Text>
                )}
              </Pressable>

              {!!statusMessage && (
                <View
                  style={[
                    s.statusBox,

                    statusType ===
                      'loading' &&
                      s.statusLoading,

                    statusType ===
                      'success' &&
                      s.statusSuccess,

                    statusType ===
                      'error' &&
                      s.statusError,
                  ]}
                >
                  <Text
                    style={[
                      s.statusText,

                      statusType ===
                        'loading' &&
                        s.statusTextLoading,

                      statusType ===
                        'success' &&
                        s.statusTextSuccess,

                      statusType ===
                        'error' &&
                        s.statusTextError,
                    ]}
                  >
                    {statusType ===
                      'loading' &&
                      '⏳ '}

                    {statusType ===
                      'success' &&
                      '✓ '}

                    {statusType ===
                      'error' &&
                      '⚠ '}

                    {statusMessage}
                  </Text>
                </View>
              )}

              <View
                style={s.registerRow}
              >
                <Text
                  style={s.registerText}
                >
                  Ainda não possui uma
                  conta?
                </Text>

                <Link
                  href="/(auth)/register"
                  style={s.registerLink}
                >
                  Criar conta
                </Link>
              </View>
            </View>

            <View
              style={s.benefitsCard}
            >
              <View style={s.benefit}>
                <View
                  style={s.benefitIcon}
                >
                  <Text
                    style={s.benefitEmoji}
                  >
                    📍
                  </Text>
                </View>

                <View
                  style={s.benefitInfo}
                >
                  <Text
                    style={s.benefitTitle}
                  >
                    Acompanhe
                  </Text>

                  <Text
                    style={
                      s.benefitDescription
                    }
                  >
                    Localização da van em
                    tempo real.
                  </Text>
                </View>
              </View>

              <View
                style={s.divider}
              />

              <View style={s.benefit}>
                <View
                  style={s.benefitIcon}
                >
                  <Text
                    style={s.benefitEmoji}
                  >
                    🔔
                  </Text>
                </View>

                <View
                  style={s.benefitInfo}
                >
                  <Text
                    style={s.benefitTitle}
                  >
                    Tranquilidade
                  </Text>

                  <Text
                    style={
                      s.benefitDescription
                    }
                  >
                    Receba avisos durante
                    o trajeto.
                  </Text>
                </View>
              </View>
            </View>

            <Text style={s.footer}>
              SchoolGo • Transporte
              escolar conectado
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const COLORS = {
  primary: '#246BFD',
  primaryPressed: '#1756D8',

  primaryLight: '#EAF2FF',

  background: '#F6F8FC',
  surface: '#FFFFFF',

  text: '#172B4D',
  textSecondary: '#667085',
  textMuted: '#98A2B3',

  border: '#E4E9F2',

  warning: '#F5B942',

  white: '#FFFFFF',
};

const s = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  container: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    backgroundColor:
      COLORS.background,
  },

  header: {
    height: 310,

    backgroundColor:
      COLORS.primary,

    paddingTop: 34,
    paddingHorizontal: 24,

    overflow: 'hidden',
  },

  circleOne: {
    position: 'absolute',

    width: 220,
    height: 220,

    borderRadius: 110,

    right: -80,
    top: -100,

    backgroundColor:
      'rgba(255,255,255,0.07)',
  },

  circleTwo: {
    position: 'absolute',

    width: 170,
    height: 170,

    borderRadius: 85,

    left: -85,
    bottom: -60,

    backgroundColor:
      'rgba(255,255,255,0.05)',
  },

  brand: {
    alignItems: 'center',
  },

  logo: {
    width: 82,
    height: 82,

    borderRadius: 25,

    backgroundColor:
      COLORS.white,

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 15,

    shadowColor: '#000000',

    shadowOpacity: 0.14,

    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 5,
  },

  logoEmoji: {
    fontSize: 42,
  },

  logoBadge: {
    position: 'absolute',

    top: -5,
    right: -5,

    width: 23,
    height: 23,

    borderRadius: 12,

    borderWidth: 3,
    borderColor: COLORS.white,

    backgroundColor:
      COLORS.warning,

    alignItems: 'center',
    justifyContent: 'center',
  },

  logoBadgeDot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    backgroundColor:
      COLORS.white,
  },

  brandName: {
    fontSize: 32,

    fontWeight: '900',

    letterSpacing: -0.8,

    color: COLORS.white,
  },

  tagline: {
    marginTop: 5,

    fontSize: 17,

    fontWeight: '700',

    color: COLORS.white,
  },

  description: {
    marginTop: 7,

    maxWidth: 300,

    textAlign: 'center',

    fontSize: 13,

    lineHeight: 19,

    color:
      'rgba(255,255,255,0.78)',
  },

  content: {
    flex: 1,

    marginTop: -38,

    paddingHorizontal: 20,

    paddingBottom: 26,
  },

  card: {
    backgroundColor:
      COLORS.surface,

    borderRadius: 25,

    padding: 22,

    borderWidth: 1,

    borderColor: '#EDF0F5',

    shadowColor: '#101828',

    shadowOpacity: 0.08,

    shadowRadius: 18,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 5,
  },

  cardHeader: {
    marginBottom: 22,
  },

  welcome: {
    fontSize: 23,

    fontWeight: '900',

    letterSpacing: -0.4,

    color: COLORS.text,
  },

  welcomeDescription: {
    marginTop: 6,

    fontSize: 14,

    lineHeight: 20,

    color:
      COLORS.textSecondary,
  },

  field: {
    marginBottom: 16,
  },

  label: {
    marginBottom: 7,

    fontSize: 13,

    fontWeight: '700',

    color: COLORS.text,
  },

  passwordHeader: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'center',
  },

  forgot: {
    marginBottom: 7,

    fontSize: 12,

    fontWeight: '700',

    color: COLORS.primary,
  },

  inputWrapper: {
    height: 56,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 14,

    borderRadius: 16,

    borderWidth: 1.5,

    borderColor: COLORS.border,

    backgroundColor: '#FAFBFC',
  },

  inputWrapperFocused: {
    borderColor:
      COLORS.primary,

    backgroundColor:
      COLORS.white,
  },

  iconBox: {
    width: 29,

    alignItems: 'flex-start',

    justifyContent: 'center',
  },

  emailIcon: {
    fontSize: 18,

    fontWeight: '800',

    color: COLORS.textMuted,
  },

  passwordIcon: {
    fontSize: 9,

    color: COLORS.textMuted,
  },

  input: {
    flex: 1,

    height: '100%',

    paddingVertical: 0,

    fontSize: 15,

    color: COLORS.text,
  },

  showPassword: {
    paddingLeft: 8,

    paddingVertical: 8,
  },

  showPasswordText: {
    fontSize: 12,

    fontWeight: '700',

    color: COLORS.primary,
  },

  loginButton: {
    height: 56,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius: 16,

    marginTop: 4,

    backgroundColor:
      COLORS.primary,

    shadowColor:
      COLORS.primary,

    shadowOpacity: 0.25,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 4,
  },

  loginButtonPressed: {
    backgroundColor:
      COLORS.primaryPressed,

    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  loginButtonDisabled: {
    opacity: 0.6,
  },

  loginButtonText: {
    fontSize: 16,

    fontWeight: '800',

    color: COLORS.white,
  },

  loginButtonArrow: {
    position: 'absolute',

    right: 20,

    fontSize: 22,

    color: COLORS.white,
  },

  statusBox: {
    marginTop: 14,

    paddingVertical: 11,
    paddingHorizontal: 13,

    borderRadius: 12,

    borderWidth: 1,
  },

  statusLoading: {
    backgroundColor: '#EEF4FF',

    borderColor: '#B9D0FF',
  },

  statusSuccess: {
    backgroundColor: '#ECFDF3',

    borderColor: '#ABEFC6',
  },

  statusError: {
    backgroundColor: '#FEF3F2',

    borderColor: '#FECDCA',
  },

  statusText: {
    fontSize: 12,

    lineHeight: 17,

    fontWeight: '600',
  },

  statusTextLoading: {
    color: '#175CD3',
  },

  statusTextSuccess: {
    color: '#067647',
  },

  statusTextError: {
    color: '#B42318',
  },

  registerRow: {
    marginTop: 22,

    flexDirection: 'row',

    justifyContent: 'center',

    alignItems: 'center',

    flexWrap: 'wrap',
  },

  registerText: {
    marginRight: 5,

    fontSize: 13,

    color:
      COLORS.textSecondary,
  },

  registerLink: {
    fontSize: 13,

    fontWeight: '800',

    color: COLORS.primary,
  },

  benefitsCard: {
    marginTop: 16,

    padding: 14,

    flexDirection: 'row',

    alignItems: 'center',

    borderRadius: 18,

    borderWidth: 1,

    borderColor: COLORS.border,

    backgroundColor:
      COLORS.white,
  },

  benefit: {
    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',
  },

  benefitIcon: {
    width: 38,
    height: 38,

    marginRight: 9,

    borderRadius: 12,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor:
      COLORS.primaryLight,
  },

  benefitEmoji: {
    fontSize: 17,
  },

  benefitInfo: {
    flex: 1,
  },

  benefitTitle: {
    fontSize: 11,

    fontWeight: '800',

    color: COLORS.text,
  },

  benefitDescription: {
    marginTop: 2,
    fontSize: 9.5,
    lineHeight: 13,
    color:
      COLORS.textSecondary,
  },

  divider: {
    width: 1,
    height: 38,
    marginHorizontal: 10,
    backgroundColor:
      COLORS.border,
  },

  footer: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 11,
    color: COLORS.textMuted,
  },
});