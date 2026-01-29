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

const SalesDetail = ({ selectedYear, selectedCompany }) => {

  const [yearFilter, setYearFilter] = useState(selectedYear || "");
  const [company, setCompany] = useState("HVM");

  const { data: finYrData } = useGetFinYearQuery();


  useEffect(() => {
    setYearFilter(selectedYear || "");
  }, [selectedYear]);
  useEffect(() => {
    setCompany(selectedCompany || "");
  }, [selectedCompany]);


  console.log(selectedCompany, company, "selectedYear");


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


      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <MonthlySales finYrData={finYrData} selectedYear={yearFilter} selectedCompany={company} />
        </Grid>

      </Grid>
      <Grid container >

        <Grid item xs={12} md={8}>
          <QuarterSales finYrData={finYrData} selectedYear={yearFilter} selectedCompany={company} />
        </Grid>
        <Grid item xs={12} md={4}>
          <YearlySales finYrData={finYrData} year={yearFilter} selectedCompany={company} />
        </Grid>
      </Grid>
      <Grid container >

        <Grid item xs={12} md={6}>
          <CustomerTopTen finYrData={finYrData} selectedYear={yearFilter} selectedCompany={company} />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomerTopTenMonth finYrData={finYrData} selectedYear={yearFilter} selectedCompany={company} />
        </Grid>
      </Grid>
      <Grid container >

        <Grid item xs={12} md={6}>
          <CustomerTop10Week finYrData={finYrData} selectedYear={yearFilter} selectedCompany={company} />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomerTop10Daily finYrData={finYrData} selectedYear={yearFilter} selectedCompany={company} />
        </Grid>
      </Grid>
      <Grid container >

        <Grid item xs={12} md={12}>
          <StyleTopTenYear finYrData={finYrData} selectedYear={yearFilter} selectedCompany={company} />
        </Grid>
       
      </Grid>
      <Grid container >

       
        <Grid item xs={12} md={12}>
          <StyleTopTenMonth finYrData={finYrData} selectedYear={yearFilter} selectedCompany={company}  />
        </Grid>
      </Grid> 



       <Grid container >

        <Grid item xs={12} md={6}>
          <StyleTop10Week finYrData={finYrData} selectedYear={yearFilter} selectedCompany={company} />
        </Grid>
        <Grid item xs={12} md={6}>
          <StyleTop10Daily finYrData={finYrData} selectedYear={yearFilter} selectedCompany={company} />
        </Grid>
      </Grid>

    </>
  );
};

export default SalesDetail;
