"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import FlagPlaceholder from "@/components/ui/placeholder";

const filterData = (responseData) => {
  const startIndex = responseData.findIndex((item) => item.country === "Afghanistan");
  if (startIndex === -1) {
    return []; // Return an empty array if "Afghanistan" is not found
  }
  return responseData.slice(startIndex); // Remove all elements before "Afghanistan"
};

const formatPopulation = (population) => {
  if (population === "N/A") return "N/A";
  return new Intl.NumberFormat('en-US').format(population);
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
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">Countries Overview</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {countries.map((country) => (
          <Card
            key={country.iso}
            className="w-full max-w-sm transition-shadow hover:shadow-lg"
          >
            <CardHeader className="p-4">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg font-bold truncate">
                  {country.name}
                </CardTitle>
                <span className="flex-shrink-0 px-2 py-1 font-mono text-sm bg-gray-100 rounded">
                  {country.iso}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="flex items-center justify-center w-full h-32 overflow-hidden rounded bg-gray-50">
                {country.flagUrl ? (
                  <img
                    src={country.flagUrl}
                    alt={`Flag of ${country.name}`}
                    className="object-contain w-40 h-24"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.parentElement.innerHTML = FlagPlaceholder({ countryName: country.name }).type({ countryName: country.name });
                    }}
                  />
                ) : (
                  <FlagPlaceholder countryName={country.name} />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Capital:</span>
                  <span className="font-medium text-sm truncate max-w-[160px]">
                    {country.capital}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Users size={14} />
                    Population:
                  </span>
                  <span className="text-sm font-medium">
                    {formatPopulation(country.population)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default App;
