import { apiUrl, headers } from "../constants/api";

export const createExam = async (data: any) => {
  const response = await fetch(`${apiUrl}/exam`, {
    method: "POST",
    body: JSON.stringify(data),
    headers,
  });
  return response.json();
};

export const getExams = async (query?: any) => {
  const response = await fetch(
    `${apiUrl}/exam?${new URLSearchParams(query || {}).toString()}`,
    {
      headers,
    },
  );
  return response.json();
};

export const getExamById = async (id: string) => {
  const response = await fetch(`${apiUrl}/exam/${id}`, {
    headers,
  });
  return response.json();
};

export const getAllSemesters = async () => {
  const response = await fetch(`${apiUrl}/semester`, {
    headers,
  });
  return response.json();
};

export const getAllSubjects = async () => {
  const response = await fetch(`${apiUrl}/subject`, {
    headers,
  });
  return response.json();
};
