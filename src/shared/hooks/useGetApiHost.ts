export const useGetApiHost = (): string => {
  const host = process.env.EXPO_PUBLIC_HOST;
  if (!host) {
    throw new Error(
      "Host not found. Please set EXPO_PUBLIC_HOST in your environment variables.",
    );
  }

  return host;
};
