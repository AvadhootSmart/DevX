import api from "@/config/axios.config";


export const getUserData = async (token: string) => {
    try {
        const response = await api.get("/v1/me", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("profile error", error);
    }
}

export const getUserFromEmail = async (email: string) => {
    try {
        const response = await api.get(`/user/${email}`);
        return response.data;
    } catch (error) {
        console.error("profile error", error);
    }
}