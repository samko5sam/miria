import type { User } from "../types";

// Mock database
const users: User[] = [
  { id: "1", email: "admin@example.com", role: "admin" },
  { id: "2", email: "user@example.com", role: "user" },
];

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    console.log(`Attempting to log in with email: ${email}`);
    const user = users.find((u) => u.email === email);
    if (user) {
      // In a real app, you'd verify the password
      console.log("Login successful for user:", user);
      localStorage.setItem("user", JSON.stringify(user));
      return Promise.resolve(user);
    }
    console.log("Login failed: user not found");
    return Promise.reject("Invalid credentials");
  },

  register: async (email: string, password: string): Promise<User> => {
    console.log(`Attempting to register with email: ${email}`);
    if (users.find((u) => u.email === email)) {
      console.log("Registration failed: email already exists");
      return Promise.reject("Email already exists");
    }
    const newUser: User = {
      id: String(users.length + 1),
      email,
      role: "user", // Default role
    };
    users.push(newUser);
    console.log("Registration successful for new user:", newUser);
    return Promise.resolve(newUser);
  },

  logout: (): void => {
    console.log("Logging out");
    localStorage.removeItem("user");
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      console.log("Current user from localStorage:", user);
      return user;
    }
    console.log("No current user in localStorage");
    return null;
  },
};
