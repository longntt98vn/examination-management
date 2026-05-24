import { apiKey, apiUrl, token } from "../constants/api";

export const login = async (data: any) => {
  const response = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const refreshLogin = async () => {
  const response = await fetch(`${apiUrl}/auth/refresh-login`, {
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
      token: token,
    },
  });

  return response.json();
};
