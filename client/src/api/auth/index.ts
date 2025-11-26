import api from "@/config/axios.config";
import { toast } from "sonner";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/login", { email, password });
    if (response.status === 200) {
      toast.success("Logged In successfully");
    }
    return response.data;
  } catch (error) {
    toast.error("Invalid email or password");
    console.error("auth error", error);
  }
};

export const registerUser = async (
  email: string,
  username: string,
  password: string,
) => {
  try {
    const response = await api.post("/register", {
      email,
      username,
      password,
    });
    if (response.status === 201) {
      toast.success("Account created successfully");
    }
    return response.data;
  } catch (error) {
    toast.error("Something went wrong, try again later");
    console.error("auth error", error);
  }
};
