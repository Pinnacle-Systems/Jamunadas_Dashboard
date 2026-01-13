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
    getMonthlySalesTable: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/monthlysalesTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getQuarterSalesTable: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/quartersalesTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getYearlySalesTable: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/yearlysalesTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getTopTenCustomerYearTable: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/topTenCustomerYearTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getTopTenCustomerMonthTable: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/topTenCustomerMonthTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getTopTenCustomerWeekTable: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/topTenCustomerWeekTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getTopTenCustomerDailyTable: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/topTenCustomerDailyTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getTopTenItemYearTable: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/topTenItemYearTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getTopTenItemMonthTable: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/topTenItemMonthTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getTopTenItemWeekTable: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/topTenItemWeekTable",
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
           params,
        };
      },
      providesTags: ['JamunasDashboard'],
    }),
    getTopTenItemDailyTable: builder.query({
      query: ({params}) => {
        return {
          url: JAMUNAS_DASHBOARD + "/topTenItemDailyTable",
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
  useGetTopTenItemDailyQuery,
  useGetMonthlySalesTableQuery,
  useGetQuarterSalesTableQuery,
  useGetYearlySalesTableQuery,
  useGetTopTenCustomerYearTableQuery,
  useGetTopTenCustomerMonthTableQuery,
  useGetTopTenCustomerWeekTableQuery,
  useGetTopTenCustomerDailyTableQuery,
  useGetTopTenItemYearTableQuery,
  useGetTopTenItemMonthTableQuery,
  useGetTopTenItemWeekTableQuery,
  useGetTopTenItemDailyTableQuery

  

} = JamunasDashboard;

export default JamunasDashboard;
