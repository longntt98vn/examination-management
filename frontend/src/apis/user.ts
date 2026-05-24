// Utility functions for API calls

import { Role } from "../constants";
import { apiUrl, headers } from "../constants/api";

export const getAllTeachers = async () => {
  const response = await fetch(`${apiUrl}/user?role=${Role.TEACHER}`, {
    headers,
  });
  return response.json();
};

export const getAllStudents = async () => {
  const response = await fetch(`${apiUrl}/user?role=${Role.STUDENT}`, {
    headers,
  });
  return response.json();
};

export const getAllUsers = async () => {
  const response = await fetch(`${apiUrl}/user`, {
    headers,
  });
  return response.json();
};
