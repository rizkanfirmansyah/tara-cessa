import { Header, Sidebar } from "@/components/organisms";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { MetaProvider } from "../MetaProvider";
import Provider from "../Provider";
import "../globals.css";
import { AuthProvider } from "../AuthProvider";

// const inter = Inter({ subsets: ["latin"] });
const dmsans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Thara - Dashboard",
    description: "Thara - Dashboard",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en">
            <body className={dmsans.className}>
                <Provider>
                    <AuthProvider>
                        <div className="grid-cols-12 grid">
                            <Sidebar />
                            <MetaProvider>
                                <div className="bg-white dark:bg-gray-900 transition-all duration-500 col-span-10 dark:text-light">
                                    <Header />
                                    <main className="bg-semi-light dark:bg-gray-900 transition-all duration-500 p-4 h-max dark:text-light">
                                        {children}
                                    </main>
                                </div>
                            </MetaProvider>
                        </div>
                    </AuthProvider>
                </Provider>
            </body>
        </html>
    );
}
