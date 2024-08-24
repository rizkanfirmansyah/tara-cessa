"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

type MetaProviderProps = {
    children: ReactNode;
};

type MetaContextType = {
    title: string;
    updateTitle: (newValue: string) => void;
};


const defaultValue: MetaContextType = {
    title: 'Default Title',
    updateTitle: () => { },
};

const MetaContext = createContext<MetaContextType>(defaultValue);

const MetaProvider = ({ children }: MetaProviderProps) => {
    const [title, setTitle] = useState('Dashboard');

    const updateTitle = (newValue: string) => {
        setTitle(newValue);
    };

    const contextValue: MetaContextType = {
        title,
        updateTitle,
    };

    return <MetaContext.Provider value={contextValue}>{children}</MetaContext.Provider>;
};



export { MetaProvider, MetaContext };
