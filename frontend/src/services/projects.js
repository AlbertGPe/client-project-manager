import http from "./base-api";

const list = () => http.get("/projects").then((res) => res.data);

const getOne = (id) => http.get(`/projects/${id}`).then((res) => res.data);

const listByClient = (id) =>
  http.get(`/projects/client/${id}`).then((res) => res.data);

const update = (id, project) => http.patch(`/projects/${id}`, project).then((res) => res.data)

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list,
  listByClient,
  getOne,
  update,
};
