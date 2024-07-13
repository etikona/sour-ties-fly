import { GraphQLFormattedError } from "graphql";
type Error = {
  message: string;
  statusCode: string;
};
const customeFetch = async (Url: string, options: RequestInit) => {
  const accessToken = localStorage.getItem("accesss_token");
  const headers = options.headers as Record<string, string>;
  return await fetch(Url, {
    ...options,
    headers: {
      ...headers,
      Authorization: headers?.Authorization || `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "Apollo-Require-Preflight": "true",
    },
  });
};

const getGraphqlErrors = (
  body: Record<"errors", GraphQLFormattedError[] | undefined>
): Error | null => {
  if (!body) {
    return {
      message: "Unknown error",
      statusCode: "INTERNAL_SERVER_ERROR",
    };
  }
  if ("errors" in body) {
    const errors = body?.errors;
    const message = errors?.map((error) => error.message)?.join("");
    const code = errors?.[0]?.extensions?.code;

    return {
      message: message || JSON.stringify(errors),
      statusCode: code || 500,
    };
  }

  return null;
};

export const fetchWrapper = async (Url: string, options: RequestInit) => {
  const response = await customeFetch(Url, options);
  const responseClone = response.clone();
  const body = await responseClone.json();
  const error = getGraphqlErrors(body);
  if (error) {
    throw error;
  }
  return response;
};
