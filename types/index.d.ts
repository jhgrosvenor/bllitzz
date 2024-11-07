declare module 'next-themes' {
    interface ThemeProviderProps {
      children: React.ReactNode;
      defaultTheme?: string;
      attribute?: string;
      value?: Record<string, string>;
      enableSystem?: boolean;
      disableTransitionOnChange?: boolean;
    }
  }