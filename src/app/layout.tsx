import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { ReduxProvider } from "@/lib/redux/provider";
import { Toaster } from 'sonner'


const primaryFont = Inter({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-primary',
});

export const metadata: Metadata = {
  title: "Dreamworks Logistics Company",
  description: "Logistics Company",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   return (
     <html lang="en">
        <body className={primaryFont.variable}>
          <ReduxProvider>
            {children}
            {/* <Toaster /> */}
          </ReduxProvider>
          <Toaster position="top-right" richColors />
        </body>
     </html>
   )
}