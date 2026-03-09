import http from './base-api';

const create = (user) => http.post('/auth/register', user)

export default {
  create
}