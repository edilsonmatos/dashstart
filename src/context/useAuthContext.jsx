import { deleteCookie, getCookie, hasCookie, setCookie } from 'cookies-next';
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';
const AuthContext = createContext(undefined);
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
const authSessionKey = '_LARKON_AUTH_KEY_';
export function AuthProvider({
  children
}) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar sessão do usuário
  useEffect(() => {
    const loadSession = async () => {
      try {
        const fetchedCookie = getCookie(authSessionKey)?.toString();
        if (fetchedCookie) {
          const sessionData = JSON.parse(fetchedCookie);
          // Verificar se o usuário ainda existe no banco
          const result = await authService.getUserById(sessionData.id);
          if (result.success) {
            setUser(result.user);
          } else {
            // Usuário não existe mais, limpar sessão
            removeSession();
          }
        }
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
        removeSession();
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const saveSession = (userData) => {
    setCookie(authSessionKey, JSON.stringify(userData));
    setUser(userData);
  };

  const removeSession = () => {
    deleteCookie(authSessionKey);
    setUser(null);
    navigate('/auth/sign-in');
  };

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        saveSession(result.user);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Erro interno do servidor' };
    }
  };

  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      if (result.success) {
        saveSession(result.user);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Erro interno do servidor' };
    }
  };

  const updateProfile = async (userData) => {
    try {
      if (!user) return { success: false, error: 'Usuário não autenticado' };
      
      const result = await authService.updateProfile(user.id, userData);
      if (result.success) {
        saveSession(result.user);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Erro interno do servidor' };
    }
  };

  return <AuthContext.Provider value={{
    user,
    loading,
    isAuthenticated: !!user,
    saveSession,
    removeSession,
    login,
    register,
    updateProfile
  }}>
      {children}
    </AuthContext.Provider>;
}