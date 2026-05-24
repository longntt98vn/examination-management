import { apiUrl, headers } from "../constants/api";

export const updateCandidates = async (data: any) => {
  const response = await fetch(`${apiUrl}/candidate`, {
    method: "POST",
    body: JSON.stringify(data),
    headers,
  });
  return response.json();
};

export const getCandidatesByConditions = async (data: any) => {
  const response = await fetch(
    `${apiUrl}/candidate?${new URLSearchParams(data).toString()}`,
    {
      headers,
    },
  );
  return response.json();
};
