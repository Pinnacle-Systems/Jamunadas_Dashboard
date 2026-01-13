import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL, JAMUNAS_DASHBOARD } from "../../constants/apiUrl";

const JamunasDashboard = createApi({
  reducerPath: "JamunasDashboard",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["JamunasDashboard"],
  endpoints: (builder) => ({
    getJamunasDashboard: builder.query({
      query: ({ params }) => {
        return {
          url: JAMUNAS_DASHBOARD,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["JamunasDashboard"],
    }),
    getFinYear: builder.query({
      query: () => {
        console.log("Jamunas Finyear API called");

        return {
          url: JAMUNAS_DASHBOARD + "/finYear",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["JamunasDashboard"],
    }),
    getTotalSales: builder.query({
      query: () => {
        return {
          url: JAMUNAS_DASHBOARD + "/sales",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getMonthlySales: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/monthlysales",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getQuarterSales: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/quartersales",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getYearlySales: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/yearlysales",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getTopTenCustomer: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/topTenCustomer",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getTopTenCustomerMonth: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/topTenCustomerMonth",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getTopTenCustomerWeek: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/topTenCustomerWeek",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getTopTenCustomerDaily: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/topTenCustomerDaily",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getTopTenItemYear: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/topTenItemYear",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getTopTenItemMonth: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/topTenItemMonth",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getTopTenItemWeek: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/topTenItemWeek",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getTopTenItemDaily: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/topTenItemDaily",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),



  }),
});

export const {

  useGetFinYearQuery,
  useGetTotalSalesQuery,
  useGetMonthlySalesQuery,
  useGetQuarterSalesQuery,
  useGetYearlySalesQuery,
  useGetTopTenCustomerQuery,
  useGetTopTenCustomerMonthQuery,
  useGetTopTenCustomerWeekQuery,
  useGetTopTenCustomerDailyQuery,
  useGetTopTenItemYearQuery,
  useGetTopTenItemMonthQuery,
  useGetTopTenItemWeekQuery,
  useGetTopTenItemDailyQuery
  

} = JamunasDashboard;

export default JamunasDashboard;
