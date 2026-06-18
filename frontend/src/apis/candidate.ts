import { apiUrl, headers } from "../constants/api";

export const updateCandidates = async (data: any) => {
  const response = await fetch(`${apiUrl}/candidate`, {
    method: "POST",
    body: JSON.stringify(data),
    headers,
  });
  return response.json();
};

export const getCandidatesByConditions = async (query?: any) => {
  const response = await fetch(
    `${apiUrl}/candidate?${new URLSearchParams(query || {}).toString()}`,
    {
      headers,
    },
  );
  return response.json();
};
