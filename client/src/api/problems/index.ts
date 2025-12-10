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

export const getProblemData = async (problemName: string) => {
  try {
    const response = await api.get(`/problem/${problemName}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching problem data", error);
    toast.error("Error fetching problem data");
  }
};
