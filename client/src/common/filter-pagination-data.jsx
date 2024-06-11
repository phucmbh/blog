import axios from 'axios';

export const filterPaginationData = async ({
  create_new_arr = false,
  state,
  data,
  page,
  countRoute,
  data_to_send = {},
  user = undefined,
}) => {
  let obj;

  let headers = {};

  if (user) {
    headers.headers = {
      Authorization: `Bearer ${user}`,
    };
  }

  if (state != null && !create_new_arr) {
    obj = { ...state, results: [...state.results, ...data], page: page };
  } else {
    const response = await axios.post(
      import.meta.env.VITE_SERVER_DOMAIN + countRoute,
      data_to_send,
      headers
    );

    const { totalDocs } = response.data;

    obj = { results: data, page: 1, totalDocs };

  }

  return obj;
};
