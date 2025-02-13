enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export const api = async (
  url: string,
  options: {
    method?: keyof typeof Method;
    data?: object;
    credential?: boolean;
  } = {}
) => {
  const { method = Method.GET, data, credential = false } = options;

  const fetchOptions: RequestInit = {
    method,
    credentials: credential ? "include" : "omit",
    headers: {
      "Content-Type": "application/json",
    },
    ...(method !== Method.GET && data ? { body: JSON.stringify(data) } : {}),
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
};
