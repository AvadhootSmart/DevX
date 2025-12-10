import api from "@/config/axios.config";
import { toast } from "sonner";

export const getProblems = async () => {
  try {
    const response = await api.get("/problems");
    return response.data;
  } catch (error) {
    console.error("Error fetching problems", error);
    toast.error("Error fetching problems");
  }
};
