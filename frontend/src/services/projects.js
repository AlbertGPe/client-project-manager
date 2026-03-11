import http from './base-api';

const list = () => http.get('/projects')
  .then((res) => res.data)

const listByClient = (id) => http.get(`/projects/client/${id}`)
  .then((res) => res.data)

export default {
  list,
  listByClient,
}