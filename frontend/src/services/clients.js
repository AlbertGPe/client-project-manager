import http from "./base-api";

const list = () => http.get("/clients").then((res) => res.data);

const getOne = (id) => http.get(`/clients/${id}`).then((res) => res.data);

const create = (client) => http.post('/clients', client).then((res) => res.data) 

const update = (id, client) =>
  http.patch(`/clients/${id}`, client).then((res) => res.data);

const remove = (id) => http.delete(`/clients/${id}`)


// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list,
  getOne,
  update,
  create,
  delete: remove,
};
