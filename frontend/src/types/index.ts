export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
}

export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};
