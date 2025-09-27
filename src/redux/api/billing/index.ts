import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BillingApi = createApi({
  reducerPath: "billing",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/billing" }),
  endpoints: (builder) => ({
    getCheckout: builder.query({
      query: (userId: string) => ({
        url: "/checkout",
        method: "GET",
        params: {
          userId,
        },
      }),
    }),
  }),
});

export const { useLazyGetCheckoutQuery } = BillingApi;
