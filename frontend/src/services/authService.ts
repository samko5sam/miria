import axios from "axios";
import { jwtDecode } from "jwt-decode";
import type { User } from "../types";

const API_URL = "http://localhost:5000/api";

export const authService = {
  login: async (username: string, password: string): Promise<User> => {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      return authService.getCurrentUser();
    }
    return Promise.reject("Invalid credentials");
  },

  register: async (
    username: string,
    email: string,
    password: string,
  ): Promise<User> => {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
    });
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem("token");
  },

  getCurrentUser: (): User | null => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: { sub: string; email: string; role: string } =
        jwtDecode(token);
      const user: User = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };
      return user;
    }
    return null;
  },
};
