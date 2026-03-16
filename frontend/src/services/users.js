import http from "./base-api";

const create = (user) => http.post("/auth/register", user);

const login = (user) => http.post('/auth/login', user).then((res) => res.data)

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  create,
  login,
};
