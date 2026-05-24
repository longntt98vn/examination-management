export const apiKey = import.meta.env.VITE_API_KEY;
export const token = import.meta.env.VITE_TOKEN;
export const apiUrl = import.meta.env.VITE_API_URL;

export const headers = {
  "Content-Type": "application/json",
  "X-Api-Key": apiKey,
  token: token,
};
