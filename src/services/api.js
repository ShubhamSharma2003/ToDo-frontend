import axios from 'axios';

//fetching by date
const fetchTodosByDate = () => {
  return axios.get('http://localhost:8081/todos', {
    withCredentials: true
  });
};

export { fetchTodosByDate };
