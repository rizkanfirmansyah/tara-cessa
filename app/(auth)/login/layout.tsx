import { GetServerSideProps } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { AuthProvider } from "@/app/AuthProvider";
import Provider from "../../Provider";
import "../../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Siorta - Dashboard Apps",
  description: "Siorta, order taker dashboard apps modern",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <AuthProvider>
            <main className="bg-white dark:bg-slate-950 h-screen">
              {children}
            </main>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
