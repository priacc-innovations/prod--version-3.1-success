// src/utils/authService.ts
import axios from "axios";

const BASE_URL = "/api";

export const authService = {
  // Login → calls backend /api/signin/user
  login: async (email: string, password: string) => {
    const response = await axios.post(`${BASE_URL}/user/signin`, {
      email,
      password,
    });

    // backend returns Users object (id, email, fullName, empid, role, ...)
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("userId");
  },

  // Fetch logged-in user details
  getLoggedInUser: async (id: number | string) => {
    const response = await axios.get(`${BASE_URL}/user/${id}`);
    return response.data;
  },
};
