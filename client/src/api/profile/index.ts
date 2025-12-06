import api from "@/config/axios.config";
import { getToken } from "@/lib/utils";

export const getUserData = async () => {
  const token = getToken()
  try {
    const response = await api.get("/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("profile error", error);
  }
};

export const getUserFromEmail = async (email: string) => {
  try {
    const response = await api.get(`/user/${email}`);
    return response.data;
  } catch (error) {
    console.error("profile error", error);
  }
};

export const getUserSubmissions = async () => {

  const token = getToken()
  try {
    const response = await api.get("/submissions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user's submissions", error);
  }
};
