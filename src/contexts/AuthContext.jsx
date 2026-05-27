import { createContext, useState, useEffect, useContext } from "react";
import { account, ID } from "../lib/appwrite";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    account
      .get()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    await account.createEmailPasswordSession(email, password);
    const u = await account.get();
    setUser(u);
    return u;
  }

  async function signup(email, password, name) {
    await account.create(ID.unique(), email, password, name);
    return login(email, password);
  }

  async function logout() {
    await account.deleteSession("current");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
