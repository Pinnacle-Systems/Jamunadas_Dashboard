import { Box, Grid, Typography } from "@mui/material";
import { DropdownWithSearch } from "../../../input/inputcomponent";
import { useEffect, useState } from "react";
import MonthlySales from "./MonthlySales";
import QuarterSales from "./QuarterSales";
import YearlySales from "./YearlySales";
import CustomerTopTen from "./CustomerTopTen.jsx";
import CustomerTopTenMonth from "./CustomerTopTenMonth.jsx";
import { useGetFinYearQuery } from "../../../redux/service/jamunasDashboardService.js";
import CustomerTop10Week from "./CustomerTop10Week.jsx";
import CustomerTop10Daily from "./CustomerTop10Daily.jsx";
import StyleTopTenYear from "./StyleTopTenYear.jsx";
import StyleTopTenMonth from "./StyleTopTenMonth.jsx";
import StyleTop10Week from "./StyleTopTenWeek.jsx";
import StyleTop10Daily from "./StyletopTendaily.jsx";

const SalesDetail = ({ selectedYear, selectedCompany, selectedFilter }) => {



    console.log(selectedFilter, "selectedFilter");


  const [yearFilter, setYearFilter] = useState(selectedYear || "");
  const [company, setCompany] = useState("HVM");
  const [filterType, setFilterType] = useState(selectedFilter ? selectedFilter : "" );

  console.log(filterType,"filterType");
  

  const { data: finYrData } = useGetFinYearQuery();


  useEffect(() => {
    setYearFilter(selectedYear || "");
    setFilterType(selectedFilter)
  }, [selectedYear]);
  useEffect(() => {
    setCompany(selectedCompany || "");
  }, [selectedCompany]);



  useEffect(() => {
  setFilterType(selectedFilter || "");
  // console.log("Hit filtertype")
}, [selectedFilter]);




  console.log(selectedCompany, company, selectedFilter, "selectedYear");


  return (
    <>
      <div
        className="mt-2"
        style={{
          position: "sticky",
          top: 30,
          zIndex: 50,
          backgroundColor: "white",
        }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{
            backgroundColor: "white",
            color: "black",
            p: 0.5,
            borderBottom: "1px solid #afafaf",
            borderTop: "1px solid #afafaf",
          }}
        >
          {/* LEFT TITLE */}
          <Grid item>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, ml: 1 }}
            >
              Overview of Sales Distribution : {yearFilter}
            </Typography>
          </Grid>

          {/* RIGHT DROPDOWNS */}
          <Grid item>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                mr: 1,
              }}
            >
              <Grid item md={6}>
                <Grid container spacing={1}>
                  {/* B2B */}
                  <Grid item md={4}>
                    <button
                      onClick={() => setFilterType("B2B")}
                      className={`flex items-center gap-2 px-5 py-2 text-[12px] font-semibold rounded-full shadow-md transition-all ${filterType === "B2B"
                        ? "bg-blue-600 text-white scale-105"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                      B2B
                    </button>
                  </Grid>

                  {/* B2C */}
                  <Grid item md={4}>
                    <button
                      onClick={() => setFilterType("B2C")}
                      className={`flex items-center gap-2 px-5 py-2 text-[12px] font-semibold rounded-full shadow-md transition-all ${filterType === "B2C"
                        ? "bg-blue-600 text-white scale-105"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                      B2C
                    </button>
                  </Grid>

                  {/* ALL */}
                  <Grid item md={4}>
                    <button
                      onClick={() => setFilterType("ALL")}
                      className={`flex items-center gap-2 px-5 py-2 text-[12px] font-semibold rounded-full shadow-md transition-all ${filterType === "ALL"
                        ? "bg-blue-600 text-white scale-105"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                      All
                    </button>
                  </Grid>
                </Grid>
              </Grid>
              {/* YEAR */}
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="px-2 py-1 text-xs border-2 rounded-md 
                     border-blue-600 transition-all duration-200 w-32"
              >
                <option value="">Select Year</option>
                {(finYrData?.data || []).map((item, index) => (
                  <option key={index} value={item.finYear}>
                    {item.finYear}
                  </option>
                ))}
              </select>

              {/* COMPANY */}
              <select
                value={company || ""}
                onChange={(e) => setCompany(e.target.value)}
                className="px-2 py-1 text-xs border-2 rounded-md 
                     border-blue-600 transition-all duration-200 w-28"
              >
                <option value="HVM">HVM</option>
              </select>


            </Box>
          </Grid>
        </Grid>
      </div>





      <Grid container >


        <Grid item xs={12} md={4}>
          <YearlySales finYrData={finYrData} year={yearFilter} selectedCompany={company} filterType={filterType} setFilterType={setFilterType} />
        </Grid>
        <Grid item xs={12} md={8}>
          <QuarterSales finYrData={finYrData} yearFilter={yearFilter} setYearFilter={setYearFilter} selectedCompany={company} filterType={filterType} setFilterType={setFilterType} />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <MonthlySales finYrData={finYrData} yearFilter={yearFilter} selectedCompany={company} setYearFilter={setYearFilter} filterType={filterType} setFilterType={setFilterType} />
        </Grid>

      </Grid>

      <Grid container >

        <Grid item xs={12} md={6}>
          <CustomerTopTen finYrData={finYrData} yearFilter={yearFilter} selectedCompany={company} setYearFilter={setYearFilter} filterType={filterType} setFilterType={setFilterType} />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomerTopTenMonth finYrData={finYrData} yearFilter={yearFilter} selectedCompany={company} setYearFilter={setYearFilter} filterType={filterType} setFilterType={setFilterType} />
        </Grid>
      </Grid>
      <Grid container >

        <Grid item xs={12} md={6}>
          <CustomerTop10Week finYrData={finYrData} selectedYear={yearFilter} selectedCompany={company} filterType={filterType} setFilterType={setFilterType} />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomerTop10Daily finYrData={finYrData} selectedYear={yearFilter} selectedCompany={company} filterType={filterType} setFilterType={setFilterType} />
        </Grid>
      </Grid>
      <Grid container >

        <Grid item xs={12} md={12}>
          <StyleTopTenYear finYrData={finYrData} yearFilter={yearFilter} selectedCompany={company} setYearFilter={setYearFilter} filterType={filterType} setFilterType={setFilterType} />
        </Grid>

      </Grid>
      <Grid container >


        <Grid item xs={12} md={12}>
          <StyleTopTenMonth finYrData={finYrData} yearFilter={yearFilter} selectedCompany={company} setYearFilter={setYearFilter} filterType={filterType} setFilterType={setFilterType} />
        </Grid>
      </Grid>



      <Grid container >

        <Grid item xs={12} md={6}>
          <StyleTop10Week finYrData={finYrData} selectedYear={yearFilter} selectedCompany={company} filterType={filterType} setFilterType={setFilterType} />
        </Grid>
        <Grid item xs={12} md={6}>
          <StyleTop10Daily finYrData={finYrData} selectedYear={yearFilter} selectedCompany={company} filterType={filterType} setFilterType={setFilterType} />
        </Grid>
      </Grid>

    </>
  );
};

export default SalesDetail;
