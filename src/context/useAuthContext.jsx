import { deleteCookie, getCookie, hasCookie, setCookie } from 'cookies-next';
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const loadSession = () => {
      try {
        const fetchedCookie = getCookie(authSessionKey)?.toString();
        if (fetchedCookie) {
          const sessionData = JSON.parse(fetchedCookie);
          setUser(sessionData);
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
    console.log('Salvando sessão:', userData);
    setCookie(authSessionKey, JSON.stringify(userData));
    setUser(userData);
    console.log('Sessão salva, usuário definido:', userData);
  };

  const removeSession = () => {
    console.log('Removendo sessão...');
    deleteCookie(authSessionKey);
    setUser(null);
    
    // Tentar navegar com React Router primeiro, depois fallback
    try {
      navigate('/auth/sign-in');
    } catch (error) {
      console.log('Navegação com React Router falhou, usando window.location');
      window.location.href = '/auth/sign-in';
    }
  };

  const login = async (email, password) => {
    try {
      // Simulação de login - em produção, isso seria uma chamada para API
      if (email && password) {
        const userData = {
          id: Date.now(),
          name: email.split('@')[0],
          email: email
        };
        console.log('Login realizado:', userData);
        saveSession(userData);
        return { success: true };
      } else {
        return { success: false, error: 'Email e senha são obrigatórios' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  };

  const register = async (userData) => {
    try {
      // Simulação de registro - em produção, isso seria uma chamada para API
      if (userData.email && userData.password) {
        const newUser = {
          id: Date.now(),
          name: userData.name,
          email: userData.email
        };
        console.log('Registro realizado:', newUser);
        saveSession(newUser);
        return { success: true };
      } else {
        return { success: false, error: 'Dados obrigatórios não fornecidos' };
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  };

  const updateProfile = async (userData) => {
    try {
      if (!user) return { success: false, error: 'Usuário não autenticado' };
      
      // Simulação de atualização - em produção, isso seria uma chamada para API
      const updatedUser = {
        ...user,
        ...userData
      };
      saveSession(updatedUser);
      return { success: true };
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