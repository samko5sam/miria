export type User = {
  id: string;
  username?: string;
  email: string;
  role: "buyer" | "seller" | "admin";
  profilePicture?: string;
  createdAt?: string;
};

export interface ProductFile {
  id: number;
  filename: string;
  file_size: number;
  content_type: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  user_id: number;
  created_at: string;
  files: ProductFile[];
}

export interface Order {
  id: number;
  order_id: string; // Lemon Squeezy Order ID
  amount_paid: number;
  created_at: string;
  product: Product;
}

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
};
