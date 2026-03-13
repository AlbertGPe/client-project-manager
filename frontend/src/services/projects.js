import http from "./base-api";

const list = () => http.get("/projects").then((res) => res.data);

const getOne = (id) => http.get(`/projects/${id}`).then((res) => res.data);

const create = (project) => http.post('/projects', project).then((res) => res.data)

const listByClient = (id) =>
  http.get(`/projects/client/${id}`).then((res) => res.data);

const update = (id, project) =>
  http.patch(`/projects/${id}`, project).then((res) => res.data);

const remove = (id) => http.delete(`/projects/${id}`)

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list,
  listByClient,
  getOne,
  update,
  create,
  delete: remove,
};
