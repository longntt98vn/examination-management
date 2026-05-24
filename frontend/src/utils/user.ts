export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeCurrentUser = () => {
  localStorage.removeItem("user");
};

export const getToken = () => {
  const token = localStorage.getItem("token");
  return token ? token : null;
};

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};
