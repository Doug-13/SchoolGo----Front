import React, {
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
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

import {
  useRouter,
} from 'expo-router';

import { api } from '../../../src/services/api';

type FormData = {
  name: string;
  schoolName: string;
  grade: string;
  pickupAddress: string;
  pickupComplement: string;
  notes: string;
};

type FormErrors = {
  name?: string;
  schoolName?: string;
  pickupAddress?: string;
};

const INITIAL_FORM: FormData = {
  name: '',
  schoolName: '',
  grade: '',
  pickupAddress: '',
  pickupComplement: '',
  notes: '',
};

export default function CreateStudent() {
  const router = useRouter();

  const [
    form,
    setForm,
  ] = useState<FormData>(
    INITIAL_FORM,
  );

  const [
    errors,
    setErrors,
  ] = useState<FormErrors>(
    {},
  );

  const [
    saving,
    setSaving,
  ] = useState(false);

  const canSubmit =
    useMemo(() => {
      return (
        form.name.trim().length >= 2 &&
        form.schoolName.trim()
          .length >= 2 &&
        form.pickupAddress.trim()
          .length >= 5 &&
        !saving
      );
    }, [
      form,
      saving,
    ]);

  function updateField(
    field: keyof FormData,
    value: string,
  ) {
    setForm(current => ({
      ...current,
      [field]: value,
    }));

    if (
      field === 'name' ||
      field === 'schoolName' ||
      field === 'pickupAddress'
    ) {
      setErrors(current => ({
        ...current,
        [field]: undefined,
      }));
    }
  }

  function validate() {
    const newErrors: FormErrors =
      {};

    if (
      form.name.trim().length <
      2
    ) {
      newErrors.name =
        'Informe o nome completo do seu filho.';
    }

    if (
      form.schoolName.trim()
        .length < 2
    ) {
      newErrors.schoolName =
        'Informe a escola.';
    }

    if (
      form.pickupAddress.trim()
        .length < 5
    ) {
      newErrors.pickupAddress =
        'Informe o endereço onde a van buscará seu filho.';
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  }

  async function handleSubmit() {
    if (!validate()) {
      Alert.alert(
        'Verifique os dados',
        'Preencha os campos obrigatórios antes de continuar.',
      );

      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),

        schoolName:
          form.schoolName.trim(),

        grade:
          form.grade.trim() ||
          undefined,

        pickupAddress:
          form.pickupAddress.trim(),

        pickupComplement:
          form.pickupComplement.trim() ||
          undefined,

        notes:
          form.notes.trim() ||
          undefined,
      };

      console.log(
        '[CreateStudent] Cadastrando aluno:',
        payload,
      );

      await api.post(
        '/students',
        payload,
      );

      Alert.alert(
        'Filho cadastrado!',
        `${form.name.trim()} foi adicionado à sua conta.`,
        [
          {
            text: 'Continuar',
            onPress: () => {
              router.back();
            },
          },
        ],
      );
    } catch (error: any) {
      console.error(
        '[CreateStudent] Erro ao cadastrar aluno:',
        error?.response?.data ??
          error?.message,
      );

      Alert.alert(
        'Não foi possível cadastrar',
        getErrorMessage(error),
      );
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (
      !hasFormChanges(form)
    ) {
      router.back();

      return;
    }

    Alert.alert(
      'Descartar cadastro?',
      'Os dados preenchidos serão perdidos.',
      [
        {
          text: 'Continuar editando',
          style: 'cancel',
        },
        {
          text: 'Descartar',
          style: 'destructive',
          onPress: () => {
            router.back();
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView
      style={s.safeArea}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          COLORS.primary
        }
      />

      <KeyboardAvoidingView
        style={s.keyboardView}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          style={s.page}
          contentContainerStyle={
            s.scrollContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          {/* HEADER */}

          <View style={s.header}>
            <View
              style={s.circleOne}
            />

            <View
              style={s.circleTwo}
            />

            <Pressable
              onPress={
                handleCancel
              }
              style={({
                pressed,
              }) => [
                s.backButton,

                pressed &&
                  s.backButtonPressed,
              ]}
            >
              <Text
                style={
                  s.backButtonIcon
                }
              >
                ‹
              </Text>
            </Pressable>

            <View
              style={
                s.headerContent
              }
            >
              <View
                style={
                  s.headerIconBox
                }
              >
                <Text
                  style={
                    s.headerIcon
                  }
                >
                  👦
                </Text>
              </View>

              <Text
                style={
                  s.headerTitle
                }
              >
                Cadastrar meu filho
              </Text>

              <Text
                style={
                  s.headerDescription
                }
              >
                Adicione as
                informações necessárias
                para começar a
                acompanhar o transporte
                escolar.
              </Text>
            </View>
          </View>

          {/* CONTENT */}

          <View style={s.content}>
            {/* PROGRESSO */}

            <View
              style={
                s.progressCard
              }
            >
              <View
                style={
                  s.progressHeader
                }
              >
                <View>
                  <Text
                    style={
                      s.progressLabel
                    }
                  >
                    ETAPA 1 DE 2
                  </Text>

                  <Text
                    style={
                      s.progressTitle
                    }
                  >
                    Dados do seu filho
                  </Text>
                </View>

                <Text
                  style={
                    s.progressNumber
                  }
                >
                  50%
                </Text>
              </View>

              <View
                style={
                  s.progressBackground
                }
              >
                <View
                  style={
                    s.progressFill
                  }
                />
              </View>

              <Text
                style={
                  s.progressDescription
                }
              >
                Depois do cadastro,
                você poderá vinculá-lo
                à van do motorista.
              </Text>
            </View>

            {/* DADOS PESSOAIS */}

            <SectionTitle
              icon="👤"
              title="Dados pessoais"
              description="Informações básicas do seu filho."
            />

            <View
              style={
                s.formCard
              }
            >
              <FieldLabel
                label="Nome completo"
                required
              />

              <TextInput
                value={form.name}
                onChangeText={value =>
                  updateField(
                    'name',
                    value,
                  )
                }
                placeholder="Ex.: João Pedro de Mello"
                placeholderTextColor={
                  COLORS.placeholder
                }
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                style={[
                  s.input,

                  errors.name &&
                    s.inputError,
                ]}
              />

              {errors.name && (
                <ErrorText
                  message={
                    errors.name
                  }
                />
              )}

              <View
                style={
                  s.fieldSpacing
                }
              />

              <FieldLabel
                label="Escola"
                required
              />

              <TextInput
                value={
                  form.schoolName
                }
                onChangeText={value =>
                  updateField(
                    'schoolName',
                    value,
                  )
                }
                placeholder="Ex.: Colégio São José"
                placeholderTextColor={
                  COLORS.placeholder
                }
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                style={[
                  s.input,

                  errors.schoolName &&
                    s.inputError,
                ]}
              />

              {errors.schoolName && (
                <ErrorText
                  message={
                    errors.schoolName
                  }
                />
              )}

              <View
                style={
                  s.fieldSpacing
                }
              />

              <FieldLabel
                label="Série / Turma"
              />

              <TextInput
                value={form.grade}
                onChangeText={value =>
                  updateField(
                    'grade',
                    value,
                  )
                }
                placeholder="Ex.: 4º Ano A"
                placeholderTextColor={
                  COLORS.placeholder
                }
                autoCapitalize="words"
                returnKeyType="next"
                style={s.input}
              />

              <HelperText>
                Opcional. Essa
                informação ajuda na
                identificação do aluno.
              </HelperText>
            </View>

            {/* EMBARQUE */}

            <SectionTitle
              icon="📍"
              title="Local de embarque"
              description="Informe onde a van buscará seu filho."
            />

            <View
              style={
                s.formCard
              }
            >
              <FieldLabel
                label="Endereço"
                required
              />

              <TextInput
                value={
                  form.pickupAddress
                }
                onChangeText={value =>
                  updateField(
                    'pickupAddress',
                    value,
                  )
                }
                placeholder="Ex.: Rua das Flores, 120"
                placeholderTextColor={
                  COLORS.placeholder
                }
                autoCapitalize="words"
                returnKeyType="next"
                style={[
                  s.input,

                  errors.pickupAddress &&
                    s.inputError,
                ]}
              />

              {errors.pickupAddress && (
                <ErrorText
                  message={
                    errors.pickupAddress
                  }
                />
              )}

              <View
                style={
                  s.fieldSpacing
                }
              />

              <FieldLabel
                label="Complemento"
              />

              <TextInput
                value={
                  form.pickupComplement
                }
                onChangeText={value =>
                  updateField(
                    'pickupComplement',
                    value,
                  )
                }
                placeholder="Ex.: Casa, Bloco B, Apto 21"
                placeholderTextColor={
                  COLORS.placeholder
                }
                autoCapitalize="sentences"
                returnKeyType="next"
                style={s.input}
              />

              <HelperText>
                Informe algum ponto de
                referência caso seja
                necessário.
              </HelperText>

              <View
                style={
                  s.addressInfoCard
                }
              >
                <View
                  style={
                    s.addressInfoIcon
                  }
                >
                  <Text>
                    🗺️
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Text
                    style={
                      s.addressInfoTitle
                    }
                  >
                    Localização da rota
                  </Text>

                  <Text
                    style={
                      s.addressInfoText
                    }
                  >
                    Esse endereço será
                    usado futuramente
                    pelo motorista para
                    organizar a ordem de
                    embarque e calcular
                    a rota.
                  </Text>
                </View>
              </View>
            </View>

            {/* OBSERVAÇÕES */}

            <SectionTitle
              icon="📝"
              title="Observações"
              description="Informações adicionais para o transporte."
            />

            <View
              style={
                s.formCard
              }
            >
              <FieldLabel
                label="Observações para o motorista"
              />

              <TextInput
                value={
                  form.notes
                }
                onChangeText={value =>
                  updateField(
                    'notes',
                    value,
                  )
                }
                placeholder={
                  'Ex.: Buscar no portão lateral, interfone 12...'
                }
                placeholderTextColor={
                  COLORS.placeholder
                }
                autoCapitalize="sentences"
                multiline
                numberOfLines={5}
                maxLength={400}
                textAlignVertical="top"
                style={[
                  s.input,
                  s.textArea,
                ]}
              />

              <View
                style={
                  s.charactersRow
                }
              >
                <Text
                  style={
                    s.optionalText
                  }
                >
                  Opcional
                </Text>

                <Text
                  style={
                    s.characterCount
                  }
                >
                  {form.notes.length}/400
                </Text>
              </View>
            </View>

            {/* PRÓXIMA ETAPA */}

            <View
              style={
                s.nextStepCard
              }
            >
              <View
                style={
                  s.nextStepIconBox
                }
              >
                <Text
                  style={
                    s.nextStepIcon
                  }
                >
                  🚌
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={
                    s.nextStepLabel
                  }
                >
                  PRÓXIMA ETAPA
                </Text>

                <Text
                  style={
                    s.nextStepTitle
                  }
                >
                  Vincular à Van
                </Text>

                <Text
                  style={
                    s.nextStepDescription
                  }
                >
                  Depois de cadastrar
                  seu filho, você poderá
                  informar o código
                  fornecido pelo
                  motorista para
                  solicitar o vínculo.
                </Text>
              </View>
            </View>

            {/* SALVAR */}

            <Pressable
              disabled={
                !canSubmit
              }
              onPress={
                handleSubmit
              }
              style={({
                pressed,
              }) => [
                s.submitButton,

                pressed &&
                  canSubmit &&
                  s.submitButtonPressed,

                !canSubmit &&
                  s.submitButtonDisabled,
              ]}
            >
              {saving ? (
                <ActivityIndicator
                  size="small"
                  color={
                    COLORS.white
                  }
                />
              ) : (
                <>
                  <Text
                    style={
                      s.submitButtonText
                    }
                  >
                    Cadastrar meu filho
                  </Text>

                  <Text
                    style={
                      s.submitButtonArrow
                    }
                  >
                    →
                  </Text>
                </>
              )}
            </Pressable>

            <Pressable
              disabled={saving}
              onPress={
                handleCancel
              }
              style={({
                pressed,
              }) => [
                s.cancelButton,

                pressed &&
                  s.cancelButtonPressed,
              ]}
            >
              <Text
                style={
                  s.cancelButtonText
                }
              >
                Cancelar
              </Text>
            </Pressable>

            <Text
              style={s.footer}
            >
              SchoolGo • Segurança em
              cada trajeto
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type SectionTitleProps = {
  icon: string;
  title: string;
  description: string;
};

function SectionTitle({
  icon,
  title,
  description,
}: SectionTitleProps) {
  return (
    <View
      style={
        s.sectionTitleContainer
      }
    >
      <View
        style={
          s.sectionIconBox
        }
      >
        <Text
          style={
            s.sectionIcon
          }
        >
          {icon}
        </Text>
      </View>

      <View
        style={{
          flex: 1,
        }}
      >
        <Text
          style={
            s.sectionTitle
          }
        >
          {title}
        </Text>

        <Text
          style={
            s.sectionDescription
          }
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

type FieldLabelProps = {
  label: string;
  required?: boolean;
};

function FieldLabel({
  label,
  required = false,
}: FieldLabelProps) {
  return (
    <Text
      style={s.fieldLabel}
    >
      {label}

      {required && (
        <Text
          style={
            s.requiredMark
          }
        >
          {' '}
          *
        </Text>
      )}
    </Text>
  );
}

function HelperText({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Text
      style={s.helperText}
    >
      {children}
    </Text>
  );
}

function ErrorText({
  message,
}: {
  message: string;
}) {
  return (
    <View
      style={
        s.errorContainer
      }
    >
      <Text
        style={
          s.errorIcon
        }
      >
        !
      </Text>

      <Text
        style={
          s.errorText
        }
      >
        {message}
      </Text>
    </View>
  );
}

function hasFormChanges(
  form: FormData,
) {
  return (
    form.name.trim() !== '' ||
    form.schoolName.trim() !==
      '' ||
    form.grade.trim() !== '' ||
    form.pickupAddress.trim() !==
      '' ||
    form.pickupComplement.trim() !==
      '' ||
    form.notes.trim() !== ''
  );
}

function getErrorMessage(
  error: any,
): string {
  const status =
    error?.response?.status;

  const message =
    error?.response?.data
      ?.message;

  if (!error?.response) {
    return (
      'Não foi possível conectar ao servidor do SchoolGo. ' +
      'Verifique sua conexão e tente novamente.'
    );
  }

  if (status === 400) {
    if (
      Array.isArray(message)
    ) {
      return message.join(
        '\n',
      );
    }

    return (
      message ||
      'Alguns dados informados são inválidos.'
    );
  }

  if (status === 401) {
    return (
      'Sua sessão expirou. Entre novamente.'
    );
  }

  if (status === 403) {
    return (
      'Você não possui permissão para cadastrar um aluno.'
    );
  }

  if (status === 409) {
    return (
      message ||
      'Este aluno já está cadastrado.'
    );
  }

  if (status >= 500) {
    return (
      'O servidor encontrou um problema. Tente novamente em alguns instantes.'
    );
  }

  if (
    Array.isArray(message)
  ) {
    return message.join(
      '\n',
    );
  }

  return (
    message ||
    error?.message ||
    'Ocorreu um erro inesperado.'
  );
}

const COLORS = {
  primary: '#246BFD',

  primaryDark:
    '#1756D8',

  primaryLight:
    '#EAF2FF',

  background:
    '#F6F8FC',

  surface:
    '#FFFFFF',

  text:
    '#172B4D',

  textSecondary:
    '#667085',

  textMuted:
    '#98A2B3',

  border:
    '#E4E9F2',

  placeholder:
    '#98A2B3',

  danger:
    '#D92D20',

  dangerLight:
    '#FEF3F2',

  success:
    '#12B76A',

  white:
    '#FFFFFF',
};

const s =
  StyleSheet.create({
    safeArea: {
      flex: 1,

      backgroundColor:
        COLORS.primary,
    },

    keyboardView: {
      flex: 1,
    },

    page: {
      flex: 1,

      backgroundColor:
        COLORS.background,
    },

    scrollContent: {
      flexGrow: 1,
    },

    /* HEADER */

    header: {
      minHeight: 260,

      paddingHorizontal: 20,

      paddingTop: 18,

      paddingBottom: 28,

      backgroundColor:
        COLORS.primary,

      overflow:
        'hidden',
    },

    circleOne: {
      position:
        'absolute',

      width: 240,

      height: 240,

      borderRadius: 120,

      right: -105,

      top: -100,

      backgroundColor:
        'rgba(255,255,255,0.07)',
    },

    circleTwo: {
      position:
        'absolute',

      width: 180,

      height: 180,

      borderRadius: 90,

      left: -100,

      bottom: -100,

      backgroundColor:
        'rgba(255,255,255,0.05)',
    },

    backButton: {
      width: 42,

      height: 42,

      borderRadius: 14,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        'rgba(255,255,255,0.16)',

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.20)',
    },

    backButtonPressed: {
      backgroundColor:
        'rgba(255,255,255,0.25)',
    },

    backButtonIcon: {
      marginTop: -3,

      fontSize: 34,

      lineHeight: 36,

      fontWeight: '300',

      color:
        COLORS.white,
    },

    headerContent: {
      marginTop: 20,
    },

    headerIconBox: {
      width: 48,

      height: 48,

      marginBottom: 12,

      borderRadius: 16,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        'rgba(255,255,255,0.16)',
    },

    headerIcon: {
      fontSize: 23,
    },

    headerTitle: {
      fontSize: 27,

      fontWeight: '900',

      letterSpacing:
        -0.5,

      color:
        COLORS.white,
    },

    headerDescription: {
      maxWidth: 330,

      marginTop: 8,

      fontSize: 13,

      lineHeight: 19,

      color:
        'rgba(255,255,255,0.78)',
    },

    /* CONTENT */

    content: {
      marginTop: -12,

      paddingHorizontal: 20,

      paddingBottom: 35,
    },

    /* PROGRESS */

    progressCard: {
      padding: 17,

      borderRadius: 20,

      backgroundColor:
        COLORS.white,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      shadowColor:
        '#101828',

      shadowOpacity: 0.07,

      shadowRadius: 14,

      shadowOffset: {
        width: 0,
        height: 5,
      },

      elevation: 3,
    },

    progressHeader: {
      flexDirection:
        'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',
    },

    progressLabel: {
      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 0.6,

      color:
        COLORS.primary,
    },

    progressTitle: {
      marginTop: 3,

      fontSize: 15,

      fontWeight: '900',

      color:
        COLORS.text,
    },

    progressNumber: {
      fontSize: 13,

      fontWeight: '900',

      color:
        COLORS.primary,
    },

    progressBackground: {
      height: 6,

      marginTop: 14,

      borderRadius: 20,

      overflow:
        'hidden',

      backgroundColor:
        '#EAF0FA',
    },

    progressFill: {
      width: '50%',

      height: '100%',

      borderRadius: 20,

      backgroundColor:
        COLORS.primary,
    },

    progressDescription: {
      marginTop: 10,

      fontSize: 10.5,

      lineHeight: 15,

      color:
        COLORS.textSecondary,
    },

    /* SECTIONS */

    sectionTitleContainer: {
      marginTop: 24,

      marginBottom: 10,

      flexDirection:
        'row',

      alignItems:
        'center',
    },

    sectionIconBox: {
      width: 39,

      height: 39,

      marginRight: 10,

      borderRadius: 12,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        COLORS.primaryLight,
    },

    sectionIcon: {
      fontSize: 18,
    },

    sectionTitle: {
      fontSize: 16,

      fontWeight: '900',

      color:
        COLORS.text,
    },

    sectionDescription: {
      marginTop: 2,

      fontSize: 10,

      color:
        COLORS.textSecondary,
    },

    /* FORM */

    formCard: {
      padding: 17,

      borderRadius: 20,

      backgroundColor:
        COLORS.white,

      borderWidth: 1,

      borderColor:
        COLORS.border,
    },

    fieldLabel: {
      marginBottom: 7,

      fontSize: 11,

      fontWeight: '800',

      color:
        COLORS.text,
    },

    requiredMark: {
      color:
        COLORS.danger,
    },

    input: {
      minHeight: 52,

      paddingHorizontal: 14,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      borderRadius: 14,

      fontSize: 13,

      color:
        COLORS.text,

      backgroundColor:
        '#FBFCFE',
    },

    inputError: {
      borderColor:
        '#FDA29B',

      backgroundColor:
        '#FFFBFA',
    },

    textArea: {
      height: 110,

      paddingTop: 14,

      paddingBottom: 14,
    },

    fieldSpacing: {
      height: 17,
    },

    helperText: {
      marginTop: 6,

      fontSize: 9.5,

      lineHeight: 14,

      color:
        COLORS.textMuted,
    },

    errorContainer: {
      marginTop: 6,

      flexDirection:
        'row',

      alignItems:
        'center',
    },

    errorIcon: {
      width: 16,

      height: 16,

      marginRight: 5,

      borderRadius: 8,

      textAlign:
        'center',

      lineHeight: 16,

      fontSize: 10,

      fontWeight: '900',

      color:
        COLORS.white,

      backgroundColor:
        COLORS.danger,
    },

    errorText: {
      flex: 1,

      fontSize: 9.5,

      color:
        COLORS.danger,
    },

    charactersRow: {
      marginTop: 7,

      flexDirection:
        'row',

      justifyContent:
        'space-between',
    },

    optionalText: {
      fontSize: 9,

      color:
        COLORS.textMuted,
    },

    characterCount: {
      fontSize: 9,

      color:
        COLORS.textMuted,
    },

    /* ADDRESS INFO */

    addressInfoCard: {
      marginTop: 17,

      padding: 12,

      flexDirection:
        'row',

      borderRadius: 15,

      borderWidth: 1,

      borderColor:
        '#D6E4FF',

      backgroundColor:
        '#F5F8FF',
    },

    addressInfoIcon: {
      width: 36,

      height: 36,

      marginRight: 10,

      borderRadius: 11,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        COLORS.primaryLight,
    },

    addressInfoTitle: {
      fontSize: 11,

      fontWeight: '800',

      color:
        COLORS.text,
    },

    addressInfoText: {
      marginTop: 3,

      fontSize: 9.5,

      lineHeight: 14,

      color:
        COLORS.textSecondary,
    },

    /* NEXT STEP */

    nextStepCard: {
      marginTop: 24,

      padding: 16,

      flexDirection:
        'row',

      borderRadius: 20,

      borderWidth: 1,

      borderColor:
        '#D6E4FF',

      backgroundColor:
        '#F5F8FF',
    },

    nextStepIconBox: {
      width: 46,

      height: 46,

      marginRight: 12,

      borderRadius: 15,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        COLORS.primaryLight,
    },

    nextStepIcon: {
      fontSize: 21,
    },

    nextStepLabel: {
      fontSize: 8.5,

      fontWeight: '900',

      letterSpacing: 0.5,

      color:
        COLORS.primary,
    },

    nextStepTitle: {
      marginTop: 2,

      fontSize: 13,

      fontWeight: '900',

      color:
        COLORS.text,
    },

    nextStepDescription: {
      marginTop: 4,

      fontSize: 9.5,

      lineHeight: 14,

      color:
        COLORS.textSecondary,
    },

    /* BUTTONS */

    submitButton: {
      height: 55,

      marginTop: 22,

      paddingHorizontal: 18,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      borderRadius: 16,

      backgroundColor:
        COLORS.primary,

      shadowColor:
        COLORS.primary,

      shadowOpacity: 0.18,

      shadowRadius: 10,

      shadowOffset: {
        width: 0,
        height: 5,
      },

      elevation: 3,
    },

    submitButtonPressed: {
      backgroundColor:
        COLORS.primaryDark,
    },

    submitButtonDisabled: {
      opacity: 0.45,

      shadowOpacity: 0,

      elevation: 0,
    },

    submitButtonText: {
      fontSize: 13,

      fontWeight: '900',

      color:
        COLORS.white,
    },

    submitButtonArrow: {
      position:
        'absolute',

      right: 18,

      fontSize: 20,

      fontWeight: '700',

      color:
        COLORS.white,
    },

    cancelButton: {
      height: 48,

      marginTop: 10,

      alignItems:
        'center',

      justifyContent:
        'center',

      borderRadius: 15,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      backgroundColor:
        COLORS.white,
    },

    cancelButtonPressed: {
      backgroundColor:
        '#F2F4F7',
    },

    cancelButtonText: {
      fontSize: 12,

      fontWeight: '800',

      color:
        COLORS.textSecondary,
    },

    footer: {
      marginTop: 24,

      textAlign:
        'center',

      fontSize: 10,

      color:
        COLORS.textMuted,
    },
  });