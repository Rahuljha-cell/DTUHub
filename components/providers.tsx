"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            className:
              "!bg-white !text-gray-900 dark:!bg-gray-800 dark:!text-white !shadow-lg",
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
