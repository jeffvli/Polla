import axios from "axios";
import useSWR from "swr";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const refreshAuthLogic = async (failedRequest) => {
  await axios
    .post(`${process.env.REACT_APP_API_URL}/auth/token`, {
      refreshToken: localStorage.getItem("refreshToken"),
    })
    .then((tokenRefreshResponse) => {
      localStorage.setItem("token", tokenRefreshResponse.data.token);
      failedRequest.response.config.headers["Authorization"] =
        "Bearer " + tokenRefreshResponse.data.token;
      return Promise.resolve();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: localStorage.getItem("token")
    ? {
        Authorization: "Bearer " + localStorage.getItem("token"),
      }
    : null,
});

createAuthRefreshInterceptor(api, refreshAuthLogic);

export const fetcher = (url) => api.get(url).then((res) => res.data);
export const authFetcher = (url, token) =>
  api
    .get(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => res.data);

export const usePolls = () => {
  const { data, error } = useSWR("/polls/", fetcher, {
    revalidateOnFocus: false,
  });

  return {
    polls: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const usePoll = (slug) => {
  const { data, error } = useSWR(`/polls/${slug}`, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    poll: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useUser = (token) => {
  const { data, error } = useSWR(["/auth/user", token], authFetcher, {
    revalidateOnFocus: false,
  });

  return {
    user: { isAuthenticated: !error, data: data },
    isLoading: !error && !data,
    isError: error,
  };
};
