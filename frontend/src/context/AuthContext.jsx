import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  loginUser,
  registerUser,
  getCurrentUser
} from '../services/authService';


const AuthContext = createContext(null);


export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    () => localStorage.getItem('mam_token')
  );

  const [loading, setLoading] = useState(true);



  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser(token);

        if (isMounted) {
          if (response && response.success && response.data && response.data.user) {
            setUser(response.data.user);
          } else {
            localStorage.removeItem('mam_token');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth Bootstrap Error:', error);
        if (isMounted) {
          localStorage.removeItem('mam_token');
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [token]);




  const login = async (payload) => {

    const response = await loginUser(payload);


    if (response.success) {


      localStorage.setItem(
        'mam_token',
        response.data.token
      );


      setToken(
        response.data.token
      );


      setUser(
        response.data.user
      );

    }


    return response;

  };




  const register = async (payload) => {


    const response = await registerUser(payload);


    if (response.success) {


      localStorage.setItem(
        'mam_token',
        response.data.token
      );


      setToken(
        response.data.token
      );


      setUser(
        response.data.user
      );

    }


    return response;

  };





  const logout = () => {
    localStorage.removeItem('mam_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      updateUser,
    }),
    [user, token, loading]
  );



  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

}



export function useAuth() {

  return useContext(AuthContext);

}