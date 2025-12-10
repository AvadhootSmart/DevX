import api from "@/config/axios.config";
import { getToken } from "@/lib/utils";
import { toast } from "sonner";

export async function submitCode(
  code: string,
  problemPath: string,
  problemId: string | number,
) {
  const token = getToken();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await api.post(
      "/submit",
      {
        code: code,
        problem_path: problemPath,
        problem_id: problemId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    return response.data;
  } catch (error) {
    // Clear the timeout in case of error
    clearTimeout(timeoutId);

    console.error("Failed to submit code:", error);

    // Check if the error is due to timeout
    if (error instanceof Error && error.name === "AbortError") {
      toast.error(
        "Submission timed out. The server is taking too long to respond. Please try again.",
      );
    } else {
      toast.error("Failed to submit code. Please try again.");
    }
  }
}
