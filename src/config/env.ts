const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  console.warn(
    '[SchoolGo] EXPO_PUBLIC_API_URL não configurada. Usando Android Emulator: http://10.0.2.2:3000/api',
  );
}

export const ENV = {
  API_URL: apiUrl ?? 'http://10.0.2.2:3000/api',
};
