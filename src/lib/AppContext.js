
'use client'
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(undefined);

export function AppProvider({ children }) {
    const storageKey = 'library-auth-storage';
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // hydrate from localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed) {
                    setUser(parsed.user ?? null);
                    setIsLoggedIn(!!parsed.isLoggedIn);
                }
            }
        } catch (e) {
            console.error('Failed to hydrate auth state', e);
        }
    }, []);

    // persist to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify({ user, isLoggedIn }));
        } catch (e) {
            console.error('Failed to persist auth state', e);
        }
    }, [user, isLoggedIn]);

    const login = (userData) => {
        setUser(userData);
        setIsLoggedIn(true);
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
    };

    const updateUser = (updatedFields) => {
        setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
    };

    const value = { user, isLoggedIn, login, logout, updateUser };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (ctx === undefined) throw new Error('useAuth must be used within AppProvider');
    return ctx;
}

