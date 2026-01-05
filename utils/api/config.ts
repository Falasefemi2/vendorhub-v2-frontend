const baseURL: string =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/";

const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
};

export const getAuthHeaders = (
    token: string | null,
): Record<string, string> => {
    const headers = { ...defaultHeaders };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return headers;
};

export const config = {
    baseURL,
    defaultHeaders,
};
