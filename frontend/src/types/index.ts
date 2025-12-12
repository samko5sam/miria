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
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  store_name?: string;
  store_id?: number;
  files: ProductFile[];
  files_count?: number; // For public store view
}

export interface Order {
  id: number;
  order_id: string; // Lemon Squeezy Order ID
  amount_paid: number;
  status: 'paid' | 'unpaid' | 'cancelled';
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
