import { apiUrl, headers } from "../constants/api";

export const updateScores = async (data: any) => {
  const response = await fetch(`${apiUrl}/score`, {
    method: "POST",
    body: JSON.stringify(data),
    headers,
  });
  return response.json();
};

export const getScoreHistory = async (scoreId: string) => {
  const response = await fetch(`${apiUrl}/score/history?scoreId=${scoreId}`, {
    headers,
  });
  return response.json();
};

export const getAllScoreOnChain = async () => {
  const response = await fetch(`${apiUrl}/score?getOnChain=true`, {
    headers,
  });
  return response.json();
};
