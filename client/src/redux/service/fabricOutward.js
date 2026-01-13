import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, FABRIC_OUTWARD } from "../../constants/apiUrl";

const fabricOutward = createApi({
  reducerPath: "fabricOutward",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["FabricOutward"],
  endpoints: (builder) => ({
    getFabOutCust: builder.query({
      query: ({ params }) => {
        return {
          url: `${FABRIC_OUTWARD}/fabOutCust`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FabricOutward"],
    }),
    getFabricOutwardDetail: builder.query({
      query: ({ params }) => {
        return {
          url: `${FABRIC_OUTWARD}/getFabricOutward`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FabricOutward"],
    }),
    getFabricOutwardCusDetail: builder.query({
      query: ({ params }) => {
        return {
          url: `${FABRIC_OUTWARD}/fabricOutwardCustomer`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FabricOutward"],
    }),
    getFabOutByCusName: builder.query({
      query: ({ params }) => {
        return {
          url: `${FABRIC_OUTWARD}/fabOutByCusName`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["FabricOutward"],
    }),
  }),
});

export const {
  useGetFabOutCustQuery,
  useGetFabricOutwardDetailQuery,
  useGetFabricOutwardCusDetailQuery,
  useGetFabOutByCusNameQuery,
} = fabricOutward;

export default fabricOutward;
