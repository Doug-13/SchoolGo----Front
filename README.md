# SchoolGo Front

Front mobile em Expo + React Native + TypeScript + Expo Router.

## Instalação

```bash
npm install
copy .env.example .env
npx expo start
```

Edite `.env`:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3000
```

No emulador Android, `http://10.0.2.2:3000` também aponta para o computador host.

## Já implementado

- Cadastro e login
- Perfis Responsável/Motorista
- Tela inicial do responsável
- Tela inicial do motorista
- Viagem ativa
- Ausência do aluno
- Embarque
- Chegada à escola
- GPS do motorista enquanto a tela da rota está ativa
- Envio da posição ao Back a cada 10 s / 20 m

## Próximas etapas

1. Telas de cadastro de aluno e van (hoje os endpoints já existem no Back).
2. Mapa com `react-native-maps`.
3. GPS em background com `expo-task-manager` + Development Build.
4. Push notifications.
5. Geofencing.
6. ETA e otimização de rota.
