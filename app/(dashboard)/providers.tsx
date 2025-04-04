'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from './theme-provider';
import { ThemeScript } from '../theme-script';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system">
      <ThemeScript />
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
