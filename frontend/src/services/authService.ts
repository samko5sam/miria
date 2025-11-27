import axios from "axios";
import type { User } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const authService = {
  login: async (username: string, password: string): Promise<void> => {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    } else {
      return Promise.reject("Invalid credentials");
    }
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

  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const allowedRoles = ["seller", "buyer", "admin"] as const;
        type AllowedRole = typeof allowedRoles[number];

        const user: User = {
          id: response.data.id || "unknown",
          username: response.data.username,
          email: response.data.email,
          role: allowedRoles.includes(response.data.role as AllowedRole)
            ? (response.data.role as AllowedRole)
            : "buyer",
          profilePicture: response.data.profile_picture,
          createdAt: response.data.created_at,
        };
        return user;
      } catch (error) {
        // If token is invalid, remove it
        localStorage.removeItem("token");
        return null;
      }
    }
    return null;
  },

  getUserProfile: async (username: string): Promise<User> => {
    const response = await axios.get(`${API_URL}/profile/${username}`);
    return {
      id: response.data.id || "unknown",
      username: response.data.username,
      email: response.data.email || "",
      role: response.data.role,
      profilePicture: response.data.profile_picture,
      createdAt: response.data.created_at,
    };
  },

  updateProfile: async (profilePicture: string): Promise<User> => {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/profile`,
      { profile_picture: profilePicture },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      id: response.data.id || "unknown",
      username: response.data.username,
      email: response.data.email,
      role: response.data.role,
      profilePicture: response.data.profile_picture,
      createdAt: response.data.created_at,
    };
  },
};
