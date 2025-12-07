import { apiClient } from "../utils/apiUtils";
import type { User } from "../types";

export const authService = {
  login: async (username: string, password: string): Promise<void> => {
    const response = await apiClient.post(`/login`, {
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
    const response = await apiClient.post(`/register`, {
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
        const response = await apiClient.get(`/profile`);
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
    const response = await apiClient.get(`/profile/${username}`);
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
    const response = await apiClient.put(
      `/profile`,
      { profile_picture: profilePicture }
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

  uploadProfilePicture: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(`/profile/picture`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.profile_picture_url;
  },
};
