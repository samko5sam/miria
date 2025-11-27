export type User = {
  id: string;
  username?: string;
  email: string;
  role: "buyer" | "seller" | "admin";
  profilePicture?: string;
  createdAt?: string;
};

export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
};
