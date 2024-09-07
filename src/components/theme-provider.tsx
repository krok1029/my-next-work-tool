import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class" // 確保主題通過 class 切換，避免 style 屬性上的變化
      defaultTheme="system"
      enableSystem
    >
      {children}
    </NextThemesProvider>
  );
}
