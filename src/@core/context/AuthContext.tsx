import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';


interface User {
  username: string | null;
  token: string | null;
  clientID: number | null;
  islogin: boolean | null
}

// Buat konteks dan penyedia yang akan menyimpan data pengguna.
const AuthContext = createContext<{
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean
} | undefined>(undefined);

// Buat penyedia konteks untuk mengelola data pengguna.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [cookies, setCookie] = useCookies(['RichoAdminAuth']);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>({
    username: null,
    token: null,
    clientID: null,
    islogin: false,
  });
  useEffect(() => {
    if (cookies?.RichoAdminAuth?.data) {
      setUser(cookies?.RichoAdminAuth?.data);
    } else setIsLoading(false);

    return () => {
      setIsLoading(false)
    }
  }, [cookies])


  const login = (userData: User) => {
    setUser(userData);
    setCookie('RichoAdminAuth', { data: { ...userData, islogin: true } }, {
      path: '/',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    })
  };

  const logout = () => {
    setUser({
      username: null,
      token: null,
      clientID: null,
      islogin: false,
    });
    setCookie('RichoAdminAuth', {
      data: {
        username: null,
        token: null,
        clientID: null,
        islogin: false,
      }
    }, {
      path: '/',
    })
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
