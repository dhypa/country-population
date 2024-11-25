"use client";

import React, { useEffect, useState } from "react";

import CountryCardGrid from "./components/CountryCardGrid";
import axios from "axios";

const filterData = (responseData) => {
  const startIndex = responseData.findIndex((item) => item.country === "Afghanistan");
  if (startIndex === -1) {
    return [];
  }
  return responseData.slice(startIndex); // Remove all elements before "Afghanistan"
};



const App = () => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const populationRes = await axios.get("https://countriesnow.space/api/v0.1/countries/population");
        const flagRes = await axios.get("https://countriesnow.space/api/v0.1/countries/flag/images");
        const capitalRes = await axios.get("https://countriesnow.space/api/v0.1/countries/capital");

        const populationData = filterData(populationRes.data.data);

        console.log(populationData);

        // Combine population and flag data
        const combinedData = populationData.map(country => {
          const capital = capitalRes.data.data.find(capital => capital.name === country.country);
          const flag = flagRes.data.data.find(flag => flag.name === country.country);
          return {
            name: country.country,
            population: country.populationCounts.slice(-1)[0]?.value || "N/A",
            flagUrl: flag?.flag || "",
            capital: capital?.capital || "Unknown",
            iso: country.iso3 || "-",
          };
        });

        setCountries(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  return (

    <CountryCardGrid countries={countries} />

  );
};

export default App;
