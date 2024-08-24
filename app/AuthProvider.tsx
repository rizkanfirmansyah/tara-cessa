"use client"
import { useSessionUser } from '@/components/store/userStore';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type AuthContextType = {
    isLoggedIn: boolean;
    user: any;
    login: (token: string, data: any) => void;
    logout: () => void;
    checkLoggedIn: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userData, setUserData] = useState<any>(null);
    const setSession = useSessionUser(state => state.session)
    const router = useRouter();

    useEffect(() => {
        setIsLoggedIn(checkLoggedIn());
        let data = localStorage.getItem('data') ?? null;
        if (data) {
            data = JSON.parse(data)
            setUserData(data)// Initial check when component mounts
        }

    }, []);

    const checkLoggedIn = (): boolean => {
        if (typeof window !== 'undefined') { // Check if running in the browser
            const token = localStorage.getItem('token');
            return !!token;
        }
        return false;
    };

    const login = (token: string, data: any) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
            setIsLoggedIn(true);
            setSession(data);
        }
    };

    const logout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsLoggedIn(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, user: userData, checkLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
