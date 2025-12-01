import { QueryClientProvider } from "@tanstack/react-query";

type ProviderProps = {
  children: React.ReactNode;
};

import {
  QueryClient,
  DefaultOptions,
} from "@tanstack/react-query";

const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  },
};

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

export default function ReactQuery({ children }: ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
