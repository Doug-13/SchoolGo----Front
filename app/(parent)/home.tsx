import {
  useFocusEffect,
  useRouter,
} from 'expo-router';

import React, {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAuth } from '../../src/contexts/AuthContext';
import { api } from '../../src/services/api';

import {
  Student,
  Trip,
} from '../../src/types';

type TripStatusInfo = {
  label: string;
  background: string;
  color: string;
};

type StudentStatusInfo = {
  label: string;
  background: string;
  color: string;
  icon: string;
};

export default function ParentHome() {
  const router = useRouter();

  const {
    user,
    logout,
  } = useAuth();

  const [
    students,
    setStudents,
  ] = useState<Student[]>([]);

  const [
    trips,
    setTrips,
  ] = useState<
    Record<string, Trip | null>
  >({});

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    absentStudentId,
    setAbsentStudentId,
  ] = useState<string | null>(
    null,
  );

  const load = useCallback(
    async () => {
      try {
        console.log(
          '[ParentHome] Carregando alunos...',
        );

        const response =
          await api.get(
            '/students/mine',
          );

        const studentList: Student[] =
          Array.isArray(
            response.data,
          )
            ? response.data
            : [];

        setStudents(
          studentList,
        );

        console.log(
          '[ParentHome] Alunos encontrados:',
          studentList.length,
        );

        const entries =
          await Promise.all(
            studentList.map(
              async student => {
                try {
                  const tripResponse =
                    await api.get(
                      `/trips/student/${student.id}/active`,
                    );

                  const trip =
                    tripResponse.data ??
                    null;

                  console.log(
                    `[ParentHome] Viagem ativa de ${student.name}:`,
                    trip,
                  );

                  return [
                    student.id,
                    trip,
                  ] as const;
                } catch (
                  error: any
                ) {
                  if (
                    error
                      ?.response
                      ?.status !== 404
                  ) {
                    console.warn(
                      `[ParentHome] Erro ao buscar viagem do aluno ${student.name}:`,
                      error
                        ?.response
                        ?.data ??
                        error
                          ?.message,
                    );
                  }

                  return [
                    student.id,
                    null,
                  ] as const;
                }
              },
            ),
          );

        setTrips(
          Object.fromEntries(
            entries,
          ),
        );
      } catch (
        error: any
      ) {
        console.error(
          '[ParentHome] Falha ao carregar dados:',
          error?.response
            ?.data ??
            error?.message,
        );

        Alert.alert(
          'Não foi possível carregar',
          getErrorMessage(
            error,
          ),
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function refresh() {
    try {
      setRefreshing(true);

      await load();
    } finally {
      setRefreshing(false);
    }
  }

  function handleAddStudent() {
    router.push(
      '/(parent)/student/create',
    );
  }

  function handleLinkVehicle(
    student: Student,
  ) {
    router.push({
      pathname:
        '/(parent)/student/[id]/vehicle',

      params: {
        id:
          student.id,

        studentName:
          student.name,
      },
    });
  }

  function handleEditStudent(
    student: Student,
  ) {
    router.push({
      pathname:
        '/(parent)/student/[id]/edit',

      params: {
        id:
          student.id,
      },
    });
  }

  async function absent(
    student: Student,
    trip: Trip,
  ) {
    Alert.alert(
      'Confirmar ausência',
      `${student.name} não irá utilizar a van hoje?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          style:
            'destructive',

          onPress:
            async () => {
              try {
                setAbsentStudentId(
                  student.id,
                );

                console.log(
                  '[ParentHome] Informando ausência:',
                  student.name,
                );

                await api.patch(
                  `/trips/${trip.id}/students/${student.id}/absent`,
                  {},
                );

                Alert.alert(
                  'Ausência informada',
                  `O motorista será informado de que ${student.name} não irá hoje.`,
                );

                await load();
              } catch (
                error: any
              ) {
                console.error(
                  '[ParentHome] Erro ao informar ausência:',
                  error
                    ?.response
                    ?.data ??
                    error
                      ?.message,
                );

                Alert.alert(
                  'Não foi possível informar',
                  getErrorMessage(
                    error,
                  ),
                );
              } finally {
                setAbsentStudentId(
                  null,
                );
              }
            },
        },
      ],
    );
  }

  function handleLogout() {
    Alert.alert(
      'Sair do SchoolGo',
      'Deseja realmente sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style:
            'destructive',
          onPress: logout,
        },
      ],
    );
  }

  const firstName =
    user?.name
      ?.split(' ')[0] ||
    'Responsável';

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

      <ScrollView
        style={s.page}
        contentContainerStyle={
          s.scrollContent
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              refresh
            }
            tintColor={
              COLORS.primary
            }
            colors={[
              COLORS.primary,
            ]}
          />
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* HEADER */}

        <View
          style={s.header}
        >
          <View
            style={s.circleOne}
          />

          <View
            style={s.circleTwo}
          />

          <View
            style={s.headerTop}
          >
            <View>
              <Text
                style={
                  s.greetingLabel
                }
              >
                Olá,
              </Text>

              <Text
                style={
                  s.greetingName
                }
              >
                {firstName} 👋
              </Text>
            </View>

            <View
              style={s.avatar}
            >
              <Text
                style={
                  s.avatarText
                }
              >
                {getInitials(
                  user?.name,
                )}
              </Text>
            </View>
          </View>

          <Text
            style={
              s.headerDescription
            }
          >
            Acompanhe seus filhos
            e o transporte escolar
            em tempo real.
          </Text>

          <View
            style={
              s.summaryCard
            }
          >
            <View
              style={
                s.summaryItem
              }
            >
              <View
                style={
                  s.summaryIconBox
                }
              >
                <Text
                  style={
                    s.summaryIcon
                  }
                >
                  👨‍👩‍👧
                </Text>
              </View>

              <View>
                <Text
                  style={
                    s.summaryNumber
                  }
                >
                  {
                    students.length
                  }
                </Text>

                <Text
                  style={
                    s.summaryLabel
                  }
                >
                  {students.length ===
                  1
                    ? 'Filho'
                    : 'Filhos'}
                </Text>
              </View>
            </View>

            <View
              style={
                s.summaryDivider
              }
            />

            <View
              style={
                s.summaryItem
              }
            >
              <View
                style={
                  s.summaryIconBox
                }
              >
                <Text
                  style={
                    s.summaryIcon
                  }
                >
                  🚌
                </Text>
              </View>

              <View>
                <Text
                  style={
                    s.summaryNumber
                  }
                >
                  {
                    Object.values(
                      trips,
                    ).filter(
                      Boolean,
                    ).length
                  }
                </Text>

                <Text
                  style={
                    s.summaryLabel
                  }
                >
                  Em trajeto
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* CONTEÚDO */}

        <View
          style={s.content}
        >
          <View
            style={
              s.sectionHeader
            }
          >
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
                Seus filhos
              </Text>

              <Text
                style={
                  s.sectionSubtitle
                }
              >
                Status do
                transporte de hoje
              </Text>
            </View>

            {students.length >
              0 &&
              !loading && (
                <Pressable
                  onPress={
                    handleAddStudent
                  }
                  style={({
                    pressed,
                  }) => [
                    s.addSmallButton,

                    pressed &&
                      s.addSmallButtonPressed,
                  ]}
                >
                  <Text
                    style={
                      s.addSmallButtonIcon
                    }
                  >
                    +
                  </Text>

                  <Text
                    style={
                      s.addSmallButtonText
                    }
                  >
                    Adicionar
                  </Text>
                </Pressable>
              )}

            {refreshing && (
              <ActivityIndicator
                style={{
                  marginLeft: 10,
                }}
                color={
                  COLORS.primary
                }
              />
            )}
          </View>

          {/* LOADING */}

          {loading &&
          students.length ===
            0 ? (
            <View
              style={
                s.loadingCard
              }
            >
              <ActivityIndicator
                size="large"
                color={
                  COLORS.primary
                }
              />

              <Text
                style={
                  s.loadingText
                }
              >
                Carregando
                informações...
              </Text>
            </View>
          ) : null}

          {/* SEM FILHOS */}

          {!loading &&
            students.length ===
              0 && (
              <View
                style={
                  s.emptyCard
                }
              >
                <View
                  style={
                    s.emptyIconBox
                  }
                >
                  <Text
                    style={
                      s.emptyIcon
                    }
                  >
                    👦
                  </Text>
                </View>

                <Text
                  style={
                    s.emptyTitle
                  }
                >
                  Nenhum filho
                  cadastrado
                </Text>

                <Text
                  style={
                    s.emptyDescription
                  }
                >
                  Cadastre seu filho
                  para acompanhar a
                  van, receber avisos
                  e visualizar todo
                  o trajeto escolar.
                </Text>

                <Pressable
                  onPress={
                    handleAddStudent
                  }
                  style={({
                    pressed,
                  }) => [
                    s.addStudentButton,

                    pressed &&
                      s.addStudentButtonPressed,
                  ]}
                >
                  <View
                    style={
                      s.addStudentIconBox
                    }
                  >
                    <Text
                      style={
                        s.addStudentIcon
                      }
                    >
                      +
                    </Text>
                  </View>

                  <Text
                    style={
                      s.addStudentButtonText
                    }
                  >
                    Cadastrar meu
                    filho
                  </Text>
                </Pressable>

                <Text
                  style={
                    s.emptyHelperText
                  }
                >
                  Depois você poderá
                  vinculá-lo à van
                  do motorista.
                </Text>
              </View>
            )}

          {/* FILHOS */}

          {students.map(
            student => {
              const trip =
                trips[
                  student.id
                ] ?? null;

              const tripStudents =
                Array.isArray(
                  trip?.students,
                )
                  ? trip.students
                  : [];

              const tripStudent =
                tripStudents.find(
                  item =>
                    item
                      ?.student
                      ?.id ===
                    student.id,
                );

              const tripStatus =
                getTripStatusInfo(
                  trip?.status,
                );

              const studentStatus =
                getStudentStatusInfo(
                  tripStudent
                    ?.status,
                );

              const isAbsentLoading =
                absentStudentId ===
                student.id;

              return (
                <View
                  key={
                    student.id
                  }
                  style={
                    s.studentCard
                  }
                >
                  {/* CABEÇALHO ALUNO */}

                  <View
                    style={
                      s.studentHeader
                    }
                  >
                    <View
                      style={
                        s.studentAvatar
                      }
                    >
                      <Text
                        style={
                          s.studentAvatarText
                        }
                      >
                        {student.name
                          ?.charAt(
                            0,
                          )
                          ?.toUpperCase() ||
                          'A'}
                      </Text>
                    </View>

                    <View
                      style={
                        s.studentTitleArea
                      }
                    >
                      <Text
                        style={
                          s.studentName
                        }
                      >
                        {
                          student.name
                        }
                      </Text>

                      <Text
                        style={
                          s.schoolName
                        }
                      >
                        {student.schoolName ||
                          'Escola não informada'}
                      </Text>
                    </View>

                    {trip && (
                      <View
                        style={[
                          s.statusBadge,
                          {
                            backgroundColor:
                              tripStatus.background,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            s.statusBadgeText,
                            {
                              color:
                                tripStatus.color,
                            },
                          ]}
                        >
                          {
                            tripStatus.label
                          }
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* TRANSPORTE */}

                  <View
                    style={
                      s.infoCard
                    }
                  >
                    <View
                      style={
                        s.infoIconBox
                      }
                    >
                      <Text
                        style={
                          s.infoIcon
                        }
                      >
                        🚌
                      </Text>
                    </View>

                    <View
                      style={
                        s.infoContent
                      }
                    >
                      <Text
                        style={
                          s.infoLabel
                        }
                      >
                        Transporte
                      </Text>

                      <Text
                        style={
                          s.infoValue
                        }
                      >
                        {student
                          ?.vehicle
                          ?.name ||
                          'Van ainda não vinculada'}
                      </Text>
                    </View>
                  </View>

                  {/* SEM VAN */}

                  {!student
                    ?.vehicle && (
                    <>
                      <View
                        style={
                          s.noVehicleCard
                        }
                      >
                        <View
                          style={
                            s.noVehicleIconBox
                          }
                        >
                          <Text
                            style={
                              s.noVehicleIcon
                            }
                          >
                            🔗
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 1,
                          }}
                        >
                          <Text
                            style={
                              s.noVehicleTitle
                            }
                          >
                            Transporte
                            não vinculado
                          </Text>

                          <Text
                            style={
                              s.noVehicleDescription
                            }
                          >
                            Vincule seu
                            filho à van
                            do motorista
                            para
                            acompanhar
                            os trajetos.
                          </Text>
                        </View>
                      </View>

                      {/* AÇÕES */}

                      <View
                        style={
                          s.studentActions
                        }
                      >
                        <Pressable
                          onPress={() =>
                            handleLinkVehicle(
                              student,
                            )
                          }
                          style={({
                            pressed,
                          }) => [
                            s.vehicleButton,

                            pressed &&
                              s.vehicleButtonPressed,
                          ]}
                        >
                          <Text
                            style={
                              s.vehicleButtonIcon
                            }
                          >
                            +
                          </Text>

                          <Text
                            style={
                              s.vehicleButtonText
                            }
                          >
                            Adicionar Van
                          </Text>
                        </Pressable>

                        <Pressable
                          onPress={() =>
                            handleEditStudent(
                              student,
                            )
                          }
                          style={({
                            pressed,
                          }) => [
                            s.editButton,

                            pressed &&
                              s.editButtonPressed,
                          ]}
                        >
                          <Text
                            style={
                              s.editButtonIcon
                            }
                          >
                            ✎
                          </Text>

                          <Text
                            style={
                              s.editButtonText
                            }
                          >
                            Editar dados
                          </Text>
                        </Pressable>
                      </View>
                    </>
                  )}

                  {/* COM VAN */}

                  {student
                    ?.vehicle && (
                    <View
                      style={
                        s.studentActions
                      }
                    >
                      <Pressable
                        onPress={() =>
                          handleLinkVehicle(
                            student,
                          )
                        }
                        style={({
                          pressed,
                        }) => [
                          s.changeVehicleButton,

                          pressed &&
                            s.editButtonPressed,
                        ]}
                      >
                        <Text
                          style={
                            s.changeVehicleIcon
                          }
                        >
                          🚌
                        </Text>

                        <Text
                          style={
                            s.changeVehicleText
                          }
                        >
                          Trocar Van
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() =>
                          handleEditStudent(
                            student,
                          )
                        }
                        style={({
                          pressed,
                        }) => [
                          s.editButton,

                          pressed &&
                            s.editButtonPressed,
                        ]}
                      >
                        <Text
                          style={
                            s.editButtonIcon
                          }
                        >
                          ✎
                        </Text>

                        <Text
                          style={
                            s.editButtonText
                          }
                        >
                          Editar dados
                        </Text>
                      </Pressable>
                    </View>
                  )}

                  {/* VIAGEM */}

                  {trip ? (
                    <>
                      <View
                        style={
                          s.studentStatusCard
                        }
                      >
                        <View
                          style={[
                            s.studentStatusIcon,
                            {
                              backgroundColor:
                                studentStatus.background,
                            },
                          ]}
                        >
                          <Text
                            style={
                              s.studentStatusEmoji
                            }
                          >
                            {
                              studentStatus.icon
                            }
                          </Text>
                        </View>

                        <View
                          style={
                            s.studentStatusContent
                          }
                        >
                          <Text
                            style={
                              s.infoLabel
                            }
                          >
                            Status de{' '}
                            {
                              student.name
                            }
                          </Text>

                          <Text
                            style={[
                              s.studentStatusText,
                              {
                                color:
                                  studentStatus.color,
                              },
                            ]}
                          >
                            {
                              studentStatus.label
                            }
                          </Text>
                        </View>
                      </View>

                      {/* LOCALIZAÇÃO */}

                      {trip.currentLatitude !=
                        null &&
                        trip.currentLongitude !=
                          null && (
                          <View
                            style={
                              s.locationCard
                            }
                          >
                            <View
                              style={
                                s.locationHeader
                              }
                            >
                              <View
                                style={
                                  s.locationIconBox
                                }
                              >
                                <Text>
                                  📍
                                </Text>
                              </View>

                              <View
                                style={{
                                  flex: 1,
                                }}
                              >
                                <Text
                                  style={
                                    s.locationTitle
                                  }
                                >
                                  Van em
                                  movimento
                                </Text>

                                <Text
                                  style={
                                    s.locationDescription
                                  }
                                >
                                  Última
                                  localização
                                  recebida
                                </Text>
                              </View>

                              <View
                                style={
                                  s.liveBadge
                                }
                              >
                                <View
                                  style={
                                    s.liveDot
                                  }
                                />

                                <Text
                                  style={
                                    s.liveText
                                  }
                                >
                                  AO VIVO
                                </Text>
                              </View>
                            </View>

                            <Text
                              style={
                                s.coordinates
                              }
                            >
                              {Number(
                                trip.currentLatitude,
                              ).toFixed(
                                5,
                              )}

                              {'  •  '}

                              {Number(
                                trip.currentLongitude,
                              ).toFixed(
                                5,
                              )}
                            </Text>
                          </View>
                        )}

                      {/* AUSÊNCIA */}

                      {tripStudent?.status ===
                        'WAITING' && (
                        <Pressable
                          disabled={
                            isAbsentLoading
                          }
                          onPress={() =>
                            absent(
                              student,
                              trip,
                            )
                          }
                          style={({
                            pressed,
                          }) => [
                            s.absentButton,

                            pressed &&
                              !isAbsentLoading &&
                              s.absentButtonPressed,

                            isAbsentLoading &&
                              s.buttonDisabled,
                          ]}
                        >
                          {isAbsentLoading ? (
                            <ActivityIndicator
                              size="small"
                              color="#B42318"
                            />
                          ) : (
                            <Text
                              style={
                                s.absentButtonIcon
                              }
                            >
                              ✕
                            </Text>
                          )}

                          <Text
                            style={
                              s.absentButtonText
                            }
                          >
                            {isAbsentLoading
                              ? 'Informando ausência...'
                              : 'Meu filho não vai hoje'}
                          </Text>
                        </Pressable>
                      )}

                      {tripStudent?.status ===
                        'ABSENT' && (
                        <View
                          style={
                            s.absentConfirmation
                          }
                        >
                          <Text
                            style={
                              s.absentConfirmationIcon
                            }
                          >
                            ✓
                          </Text>

                          <View
                            style={{
                              flex: 1,
                            }}
                          >
                            <Text
                              style={
                                s.absentConfirmationTitle
                              }
                            >
                              Ausência
                              informada
                            </Text>

                            <Text
                              style={
                                s.absentConfirmationText
                              }
                            >
                              O motorista
                              já pode
                              ajustar a
                              rota de
                              hoje.
                            </Text>
                          </View>
                        </View>
                      )}
                    </>
                  ) : (
                    <View
                      style={
                        s.noTripCard
                      }
                    >
                      <View
                        style={
                          s.noTripIcon
                        }
                      >
                        <Text>
                          🕐
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                        }}
                      >
                        <Text
                          style={
                            s.noTripTitle
                          }
                        >
                          Nenhuma
                          viagem ativa
                        </Text>

                        <Text
                          style={
                            s.noTripDescription
                          }
                        >
                          Quando a van
                          iniciar o
                          trajeto, as
                          informações
                          aparecerão
                          aqui.
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              );
            },
          )}

          {/* ACESSO RÁPIDO */}

          <Text
            style={
              s.quickActionsTitle
            }
          >
            Acesso rápido
          </Text>

          <View
            style={
              s.quickActions
            }
          >
            <View
              style={
                s.quickActionCard
              }
            >
              <View
                style={
                  s.quickActionIcon
                }
              >
                <Text
                  style={
                    s.quickActionEmoji
                  }
                >
                  🔔
                </Text>
              </View>

              <Text
                style={
                  s.quickActionTitle
                }
              >
                Avisos
              </Text>

              <Text
                style={
                  s.quickActionDescription
                }
              >
                Acompanhe
                atualizações do
                trajeto.
              </Text>
            </View>

            <View
              style={
                s.quickActionCard
              }
            >
              <View
                style={
                  s.quickActionIcon
                }
              >
                <Text
                  style={
                    s.quickActionEmoji
                  }
                >
                  📍
                </Text>
              </View>

              <Text
                style={
                  s.quickActionTitle
                }
              >
                Localização
              </Text>

              <Text
                style={
                  s.quickActionDescription
                }
              >
                Veja onde a van
                está.
              </Text>
            </View>
          </View>

          {/* SAIR */}

          <Pressable
            onPress={
              handleLogout
            }
            style={({
              pressed,
            }) => [
              s.logoutButton,

              pressed &&
                s.logoutButtonPressed,
            ]}
          >
            <Text
              style={
                s.logoutIcon
              }
            >
              ↪
            </Text>

            <Text
              style={
                s.logoutButtonText
              }
            >
              Sair da conta
            </Text>
          </Pressable>

          <Text
            style={s.footer}
          >
            SchoolGo • Segurança
            em cada trajeto
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getTripStatusInfo(
  status?: string,
): TripStatusInfo {
  switch (status) {
    case 'SCHEDULED':
      return {
        label:
          'Agendada',
        background:
          '#F2F4F7',
        color:
          '#475467',
      };

    case 'STARTED':

    case 'IN_PROGRESS':
      return {
        label:
          'Em trajeto',
        background:
          '#EAF2FF',
        color:
          '#175CD3',
      };

    case 'ARRIVED_SCHOOL':
      return {
        label:
          'Na escola',
        background:
          '#ECFDF3',
        color:
          '#067647',
      };

    case 'RETURNING':
      return {
        label:
          'Retornando',
        background:
          '#FFF6ED',
        color:
          '#C4320A',
      };

    case 'FINISHED':
      return {
        label:
          'Finalizada',
        background:
          '#ECFDF3',
        color:
          '#067647',
      };

    case 'CANCELLED':
      return {
        label:
          'Cancelada',
        background:
          '#FEF3F2',
        color:
          '#B42318',
      };

    default:
      return {
        label:
          status ||
          'Ativa',
        background:
          '#EAF2FF',
        color:
          '#175CD3',
      };
  }
}

function getStudentStatusInfo(
  status?: string,
): StudentStatusInfo {
  switch (status) {
    case 'WAITING':
      return {
        label:
          'Aguardando a van',
        background:
          '#FFF6ED',
        color:
          '#C4320A',
        icon:
          '🕐',
      };

    case 'ON_BOARD':
      return {
        label:
          'Na van',
        background:
          '#EAF2FF',
        color:
          '#175CD3',
        icon:
          '🚌',
      };

    case 'AT_SCHOOL':
      return {
        label:
          'Chegou à escola',
        background:
          '#ECFDF3',
        color:
          '#067647',
        icon:
          '🏫',
      };

    case 'DROPPED_OFF':
      return {
        label:
          'Chegou em casa',
        background:
          '#ECFDF3',
        color:
          '#067647',
        icon:
          '🏠',
      };

    case 'ABSENT':
      return {
        label:
          'Não irá hoje',
        background:
          '#FEF3F2',
        color:
          '#B42318',
        icon:
          '✕',
      };

    default:
      return {
        label:
          'Aguardando informações',
        background:
          '#F2F4F7',
        color:
          '#475467',
        icon:
          '•',
      };
  }
}

function getInitials(
  name?: string,
): string {
  if (!name) {
    return 'SG';
  }

  const parts =
    name
      .trim()
      .split(' ')
      .filter(Boolean);

  if (
    parts.length === 1
  ) {
    return parts[0]
      .substring(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[
      parts.length - 1
    ][0]
  ).toUpperCase();
}

function getErrorMessage(
  error: any,
): string {
  const status =
    error?.response
      ?.status;

  const message =
    error?.response
      ?.data?.message;

  if (
    !error?.response
  ) {
    return (
      'Não foi possível conectar ao servidor do SchoolGo. ' +
      'Verifique sua conexão e tente novamente.'
    );
  }

  if (
    status === 401
  ) {
    return (
      'Sua sessão expirou. Entre novamente.'
    );
  }

  if (
    status === 403
  ) {
    return (
      'Você não possui permissão para realizar esta ação.'
    );
  }

  if (
    status >= 500
  ) {
    return (
      'O servidor encontrou um problema. Tente novamente em alguns instantes.'
    );
  }

  if (
    Array.isArray(
      message,
    )
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
  primary:
    '#246BFD',

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

  success:
    '#12B76A',

  danger:
    '#D92D20',

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

    page: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },

    scrollContent: {
      flexGrow: 1,
    },

    header: {
      minHeight: 255,
      paddingTop: 30,
      paddingHorizontal: 20,
      backgroundColor:
        COLORS.primary,
      overflow:
        'hidden',
    },

    circleOne: {
      position:
        'absolute',
      width: 230,
      height: 230,
      borderRadius: 115,
      right: -90,
      top: -95,
      backgroundColor:
        'rgba(255,255,255,0.07)',
    },

    circleTwo: {
      position:
        'absolute',
      width: 170,
      height: 170,
      borderRadius: 85,
      left: -95,
      bottom: -85,
      backgroundColor:
        'rgba(255,255,255,0.05)',
    },

    headerTop: {
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'space-between',
    },

    greetingLabel: {
      fontSize: 14,
      color:
        'rgba(255,255,255,0.78)',
    },

    greetingName: {
      marginTop: 2,
      fontSize: 27,
      fontWeight:
        '900',
      color:
        COLORS.white,
      letterSpacing:
        -0.5,
    },

    avatar: {
      width: 52,
      height: 52,
      borderRadius: 18,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        'rgba(255,255,255,0.18)',
      borderWidth: 1,
      borderColor:
        'rgba(255,255,255,0.25)',
    },

    avatarText: {
      fontSize: 17,
      fontWeight:
        '900',
      color:
        COLORS.white,
    },

    headerDescription: {
      maxWidth: 310,
      marginTop: 12,
      fontSize: 13,
      lineHeight: 19,
      color:
        'rgba(255,255,255,0.78)',
    },

    summaryCard: {
      height: 82,
      marginTop: 20,
      flexDirection:
        'row',
      alignItems:
        'center',
      paddingHorizontal: 14,
      borderRadius: 20,
      backgroundColor:
        COLORS.white,
      shadowColor:
        '#101828',
      shadowOpacity:
        0.12,
      shadowRadius: 14,
      shadowOffset: {
        width: 0,
        height: 5,
      },
      elevation: 5,
    },

    summaryItem: {
      flex: 1,
      flexDirection:
        'row',
      alignItems:
        'center',
    },

    summaryIconBox: {
      width: 42,
      height: 42,
      marginRight: 10,
      borderRadius: 13,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        COLORS.primaryLight,
    },

    summaryIcon: {
      fontSize: 19,
    },

    summaryNumber: {
      fontSize: 20,
      fontWeight:
        '900',
      color:
        COLORS.text,
    },

    summaryLabel: {
      marginTop: 1,
      fontSize: 11,
      color:
        COLORS.textSecondary,
    },

    summaryDivider: {
      width: 1,
      height: 40,
      marginHorizontal: 14,
      backgroundColor:
        COLORS.border,
    },

    content: {
      marginTop: 24,
      paddingHorizontal: 20,
      paddingBottom: 32,
    },

    sectionHeader: {
      marginBottom: 14,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'space-between',
    },

    sectionTitle: {
      fontSize: 21,
      fontWeight:
        '900',
      color:
        COLORS.text,
      letterSpacing:
        -0.3,
    },

    sectionSubtitle: {
      marginTop: 3,
      fontSize: 12,
      color:
        COLORS.textSecondary,
    },

    addSmallButton: {
      flexDirection:
        'row',
      alignItems:
        'center',
      paddingVertical: 8,
      paddingHorizontal: 11,
      borderRadius: 12,
      backgroundColor:
        COLORS.primaryLight,
    },

    addSmallButtonPressed: {
      opacity: 0.75,
    },

    addSmallButtonIcon: {
      marginRight: 4,
      fontSize: 17,
      fontWeight:
        '900',
      color:
        COLORS.primary,
    },

    addSmallButtonText: {
      fontSize: 11,
      fontWeight:
        '800',
      color:
        COLORS.primary,
    },

    loadingCard: {
      paddingVertical: 40,
      alignItems:
        'center',
      borderRadius: 22,
      backgroundColor:
        COLORS.white,
      borderWidth: 1,
      borderColor:
        COLORS.border,
    },

    loadingText: {
      marginTop: 12,
      fontSize: 13,
      color:
        COLORS.textSecondary,
    },

    emptyCard: {
      padding: 26,
      alignItems:
        'center',
      borderRadius: 24,
      backgroundColor:
        COLORS.white,
      borderWidth: 1,
      borderColor:
        COLORS.border,
    },

    emptyIconBox: {
      width: 66,
      height: 66,
      marginBottom: 14,
      borderRadius: 22,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        COLORS.primaryLight,
    },

    emptyIcon: {
      fontSize: 30,
    },

    emptyTitle: {
      fontSize: 18,
      fontWeight:
        '900',
      color:
        COLORS.text,
    },

    emptyDescription: {
      maxWidth: 290,
      marginTop: 8,
      textAlign:
        'center',
      fontSize: 12,
      lineHeight: 18,
      color:
        COLORS.textSecondary,
    },

    addStudentButton: {
      width: '100%',
      height: 54,
      marginTop: 22,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'center',
      borderRadius: 16,
      backgroundColor:
        COLORS.primary,
    },

    addStudentButtonPressed: {
      backgroundColor:
        COLORS.primaryDark,
    },

    addStudentIconBox: {
      width: 28,
      height: 28,
      marginRight: 9,
      borderRadius: 9,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        'rgba(255,255,255,0.18)',
    },

    addStudentIcon: {
      fontSize: 20,
      lineHeight: 22,
      fontWeight:
        '700',
      color:
        COLORS.white,
    },

    addStudentButtonText: {
      fontSize: 13,
      fontWeight:
        '900',
      color:
        COLORS.white,
    },

    emptyHelperText: {
      marginTop: 10,
      fontSize: 10,
      textAlign:
        'center',
      color:
        COLORS.textMuted,
    },

    studentCard: {
      marginBottom: 16,
      padding: 18,
      borderRadius: 24,
      backgroundColor:
        COLORS.white,
      borderWidth: 1,
      borderColor:
        '#EDF0F5',
      shadowColor:
        '#101828',
      shadowOpacity:
        0.06,
      shadowRadius: 15,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      elevation: 3,
    },

    studentHeader: {
      flexDirection:
        'row',
      alignItems:
        'center',
      marginBottom: 17,
    },

    studentAvatar: {
      width: 48,
      height: 48,
      marginRight: 12,
      borderRadius: 16,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        COLORS.primaryLight,
    },

    studentAvatarText: {
      fontSize: 20,
      fontWeight:
        '900',
      color:
        COLORS.primary,
    },

    studentTitleArea: {
      flex: 1,
    },

    studentName: {
      fontSize: 18,
      fontWeight:
        '900',
      color:
        COLORS.text,
    },

    schoolName: {
      marginTop: 2,
      fontSize: 11,
      color:
        COLORS.textSecondary,
    },

    statusBadge: {
      paddingVertical: 6,
      paddingHorizontal: 9,
      borderRadius: 20,
    },

    statusBadgeText: {
      fontSize: 9.5,
      fontWeight:
        '800',
    },

    infoCard: {
      flexDirection:
        'row',
      alignItems:
        'center',
      paddingVertical: 12,
      paddingHorizontal: 13,
      borderRadius: 16,
      backgroundColor:
        '#F8FAFC',
    },

    infoIconBox: {
      width: 38,
      height: 38,
      marginRight: 10,
      borderRadius: 12,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        COLORS.primaryLight,
    },

    infoIcon: {
      fontSize: 18,
    },

    infoContent: {
      flex: 1,
    },

    infoLabel: {
      fontSize: 10.5,
      color:
        COLORS.textSecondary,
    },

    infoValue: {
      marginTop: 2,
      fontSize: 14,
      fontWeight:
        '800',
      color:
        COLORS.text,
    },

    noVehicleCard: {
      marginTop: 10,
      flexDirection:
        'row',
      alignItems:
        'center',
      padding: 13,
      borderRadius: 16,
      borderWidth: 1,
      borderColor:
        '#D6E4FF',
      backgroundColor:
        '#F5F8FF',
    },

    noVehicleIconBox: {
      width: 38,
      height: 38,
      marginRight: 10,
      borderRadius: 12,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        COLORS.primaryLight,
    },

    noVehicleIcon: {
      fontSize: 17,
    },

    noVehicleTitle: {
      fontSize: 12,
      fontWeight:
        '800',
      color:
        COLORS.text,
    },

    noVehicleDescription: {
      marginTop: 2,
      fontSize: 9.5,
      lineHeight: 13,
      color:
        COLORS.textSecondary,
    },

    /*
     * NOVAS AÇÕES DO FILHO
     */

    studentActions: {
      flexDirection:
        'row',
      gap: 9,
      marginTop: 11,
    },

    vehicleButton: {
      flex: 1,
      height: 47,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'center',
      borderRadius: 14,
      backgroundColor:
        COLORS.primary,
    },

    vehicleButtonPressed: {
      backgroundColor:
        COLORS.primaryDark,
    },

    vehicleButtonIcon: {
      marginRight: 6,
      fontSize: 18,
      fontWeight:
        '900',
      color:
        COLORS.white,
    },

    vehicleButtonText: {
      fontSize: 11,
      fontWeight:
        '900',
      color:
        COLORS.white,
    },

    editButton: {
      flex: 1,
      height: 47,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'center',
      borderRadius: 14,
      borderWidth: 1,
      borderColor:
        '#D6E4FF',
      backgroundColor:
        '#F5F8FF',
    },

    editButtonPressed: {
      backgroundColor:
        '#EAF2FF',
    },

    editButtonIcon: {
      marginRight: 6,
      fontSize: 16,
      fontWeight:
        '900',
      color:
        COLORS.primary,
    },

    editButtonText: {
      fontSize: 11,
      fontWeight:
        '900',
      color:
        COLORS.primary,
    },

    changeVehicleButton: {
      flex: 1,
      height: 47,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'center',
      borderRadius: 14,
      borderWidth: 1,
      borderColor:
        '#D6E4FF',
      backgroundColor:
        '#F5F8FF',
    },

    changeVehicleIcon: {
      marginRight: 6,
      fontSize: 15,
    },

    changeVehicleText: {
      fontSize: 11,
      fontWeight:
        '900',
      color:
        COLORS.primary,
    },

    studentStatusCard: {
      marginTop: 10,
      flexDirection:
        'row',
      alignItems:
        'center',
      paddingVertical: 12,
      paddingHorizontal: 13,
      borderRadius: 16,
      backgroundColor:
        '#F8FAFC',
    },

    studentStatusIcon: {
      width: 38,
      height: 38,
      marginRight: 10,
      borderRadius: 12,
      alignItems:
        'center',
      justifyContent:
        'center',
    },

    studentStatusEmoji: {
      fontSize: 17,
    },

    studentStatusContent: {
      flex: 1,
    },

    studentStatusText: {
      marginTop: 2,
      fontSize: 14,
      fontWeight:
        '800',
    },

    locationCard: {
      marginTop: 10,
      padding: 13,
      borderRadius: 16,
      borderWidth: 1,
      borderColor:
        '#D6E4FF',
      backgroundColor:
        '#F5F8FF',
    },

    locationHeader: {
      flexDirection:
        'row',
      alignItems:
        'center',
    },

    locationIconBox: {
      width: 36,
      height: 36,
      marginRight: 9,
      borderRadius: 12,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        COLORS.primaryLight,
    },

    locationTitle: {
      fontSize: 12,
      fontWeight:
        '800',
      color:
        COLORS.text,
    },

    locationDescription: {
      marginTop: 2,
      fontSize: 9.5,
      color:
        COLORS.textSecondary,
    },

    liveBadge: {
      flexDirection:
        'row',
      alignItems:
        'center',
      paddingVertical: 5,
      paddingHorizontal: 7,
      borderRadius: 20,
      backgroundColor:
        '#ECFDF3',
    },

    liveDot: {
      width: 6,
      height: 6,
      marginRight: 4,
      borderRadius: 3,
      backgroundColor:
        COLORS.success,
    },

    liveText: {
      fontSize: 8,
      fontWeight:
        '900',
      color:
        '#067647',
    },

    coordinates: {
      marginTop: 10,
      fontSize: 10,
      color:
        COLORS.textSecondary,
    },

    absentButton: {
      height: 49,
      marginTop: 13,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'center',
      borderRadius: 14,
      borderWidth: 1,
      borderColor:
        '#FECDCA',
      backgroundColor:
        '#FEF3F2',
    },

    absentButtonPressed: {
      backgroundColor:
        '#FEE4E2',
    },

    absentButtonIcon: {
      marginRight: 7,
      fontSize: 15,
      fontWeight:
        '900',
      color:
        '#B42318',
    },

    absentButtonText: {
      fontSize: 12,
      fontWeight:
        '800',
      color:
        '#B42318',
    },

    buttonDisabled: {
      opacity: 0.6,
    },

    absentConfirmation: {
      marginTop: 12,
      flexDirection:
        'row',
      alignItems:
        'center',
      padding: 12,
      borderRadius: 15,
      backgroundColor:
        '#ECFDF3',
    },

    absentConfirmationIcon: {
      width: 32,
      height: 32,
      marginRight: 10,
      textAlign:
        'center',
      textAlignVertical:
        'center',
      borderRadius: 10,
      fontSize: 16,
      fontWeight:
        '900',
      color:
        '#067647',
      backgroundColor:
        '#D1FADF',
    },

    absentConfirmationTitle: {
      fontSize: 12,
      fontWeight:
        '800',
      color:
        '#067647',
    },

    absentConfirmationText: {
      marginTop: 2,
      fontSize: 9.5,
      color:
        '#079455',
    },

    noTripCard: {
      marginTop: 10,
      flexDirection:
        'row',
      alignItems:
        'center',
      padding: 13,
      borderRadius: 16,
      backgroundColor:
        '#F8FAFC',
    },

    noTripIcon: {
      width: 38,
      height: 38,
      marginRight: 10,
      borderRadius: 12,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        '#F2F4F7',
    },

    noTripTitle: {
      fontSize: 12,
      fontWeight:
        '800',
      color:
        COLORS.text,
    },

    noTripDescription: {
      marginTop: 2,
      fontSize: 9.5,
      lineHeight: 13,
      color:
        COLORS.textSecondary,
    },

    quickActionsTitle: {
      marginTop: 7,
      marginBottom: 10,
      fontSize: 16,
      fontWeight:
        '900',
      color:
        COLORS.text,
    },

    quickActions: {
      flexDirection:
        'row',
      gap: 10,
    },

    quickActionCard: {
      flex: 1,
      minHeight: 125,
      padding: 14,
      borderRadius: 18,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      backgroundColor:
        COLORS.white,
    },

    quickActionIcon: {
      width: 36,
      height: 36,
      marginBottom: 10,
      borderRadius: 11,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        COLORS.primaryLight,
    },

    quickActionEmoji: {
      fontSize: 17,
    },

    quickActionTitle: {
      fontSize: 12,
      fontWeight:
        '800',
      color:
        COLORS.text,
    },

    quickActionDescription: {
      marginTop: 4,
      fontSize: 9.5,
      lineHeight: 13,
      color:
        COLORS.textSecondary,
    },

    logoutButton: {
      height: 50,
      marginTop: 22,
      flexDirection:
        'row',
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

    logoutButtonPressed: {
      backgroundColor:
        '#F2F4F7',
    },

    logoutIcon: {
      marginRight: 7,
      fontSize: 16,
      color:
        COLORS.textSecondary,
    },

    logoutButtonText: {
      fontSize: 12,
      fontWeight:
        '800',
      color:
        COLORS.textSecondary,
    },

    footer: {
      marginTop: 22,
      textAlign:
        'center',
      fontSize: 10,
      color:
        COLORS.textMuted,
    },
  });