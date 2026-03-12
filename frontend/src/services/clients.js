import http from "./base-api";

const list = () => http.get("/clients").then((res) => res.data);

const getOne = (id) => http.get(`/clients/${id}`).then((res) => res.data);

const update = (id, client) => http.patch(`/clients/${id}`, client).then((res) => res.data)

export default {
  list,
  getOne,
  update,
};
