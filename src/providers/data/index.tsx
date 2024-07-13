import { GraphQLClient } from "@refinedev/nestjs-query";
import { fetchWrapper } from "./fetch-wrapper";

export const API_URL = "https://api.crm.refine.dev";
export const client = new GraphQLClient(API_URL, {
  fetch: (Url: string, options: RequestInit) => {
    try {
      return fetchWrapper(Url, options);
    } catch (error) {
      return Promise.reject(error as Error);
    }
  },
});
