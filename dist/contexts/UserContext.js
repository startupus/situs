import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { usersApi } from '../api/services/users.api';
import { ApiUtils } from '../api/client';
const UserContext = createContext(undefined);
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Проверяем аутентификацию при загрузке
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (token) {
                    const currentUser = await usersApi.getCurrentUser();
                    setUser(currentUser);
                }
            }
            catch (err) {
                // Токен недействителен, удаляем его
                localStorage.removeItem('auth_token');
                console.log('Auth check failed:', err);
            }
            finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);
    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const authResponse = await usersApi.login(credentials);
            setUser(authResponse.user);
        }
        catch (err) {
            const errorMessage = ApiUtils.handleError(err);
            setError(errorMessage);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const authResponse = await usersApi.register(userData);
            setUser(authResponse.user);
        }
        catch (err) {
            const errorMessage = ApiUtils.handleError(err);
            setError(errorMessage);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    const logout = () => {
        usersApi.logout();
        setUser(null);
        setError(null);
    };
    const updateProfile = async (profileData) => {
        setError(null);
        try {
            const updatedUser = await usersApi.updateProfile(profileData);
            setUser(updatedUser);
        }
        catch (err) {
            const errorMessage = ApiUtils.handleError(err);
            setError(errorMessage);
            throw err;
        }
    };
    const uploadAvatar = async (file) => {
        setError(null);
        try {
            const result = await usersApi.uploadAvatar(file);
            if (user) {
                setUser({
                    ...user,
                    profile: {
                        ...user.profile,
                        avatar: result.url
                    }
                });
            }
        }
        catch (err) {
            const errorMessage = ApiUtils.handleError(err);
            setError(errorMessage);
            throw err;
        }
    };
    const changePassword = async (currentPassword, newPassword) => {
        setError(null);
        try {
            await usersApi.changePassword(currentPassword, newPassword);
        }
        catch (err) {
            const errorMessage = ApiUtils.handleError(err);
            setError(errorMessage);
            throw err;
        }
    };
    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        uploadAvatar,
        changePassword
    };
    return (_jsx(UserContext.Provider, { value: value, children: children }));
};
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
//# sourceMappingURL=UserContext.js.map