import { useState, useEffect, createContext, useContext } from "react";
import loginAdmin from "../../services/apis/login";
import { getMe } from "../../services/apis/auth";

type User = {
  name: string;
  email: string;
  id: string;
  admin_role?: "super" | "staff" | null;
};
type Logindetails = {
  email: string;
  password: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  login: (payload: Logindetails) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children?: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("access_token");
  });
  const [user, setUser] = useState<User | null>(null);

  async function login(data: Logindetails) {
    const res = await loginAdmin(data);
    const user = res.data;
    const userData: User = { name: user.name, email: user.email, id: user.id };

    localStorage.setItem("admin_name", user.name);
    localStorage.setItem("admin_email", user.email);
    localStorage.setItem("admin_id", user.id);
    localStorage.setItem("access_token", user.tokens.access_token);
    localStorage.setItem("refresh_token", user.tokens.refresh_token);

    // Resolve the admin's tier (super/staff) so the dashboard can gate
    // Super-Admin-only screens.
    try {
      const me = await getMe();
      const adminRole = me.data.admin_role ?? null;
      if (adminRole) localStorage.setItem("admin_role", adminRole);
      userData.admin_role = adminRole;
    } catch {
      // Non-fatal: fall back to Staff-level access if /me is unavailable.
    }

    setUser(userData);
    setIsLoggedIn(true);
    return res;
  }

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");
    const name = localStorage.getItem("admin_name");
    const email = localStorage.getItem("admin_email");
    const id = localStorage.getItem("admin_id");
    const admin_role = localStorage.getItem("admin_role") as
      | "super"
      | "staff"
      | null;

    if (token && refresh && name && email && id) {
      setIsLoggedIn(true);
      setUser({ name, email, id, admin_role });
    } else {
      logout();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be inside the authProvider");
  } else return context;
};
