"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import React, { useEffect, useMemo, useState } from "react";

import PropTypes from 'prop-types';
import axios from "axios";

const filterData = (responseData) => {
    const startIndex = responseData.findIndex((item) => item.country === "Afghanistan");
    if (startIndex === -1) {
        return [];
    }
    return responseData.slice(startIndex); // Remove all elements before "Afghanistan"
};


const Stats = ({ countries }) => {
    const colors = [
        '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe',
        '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd',
        '#dbeafe'
    ];
    const { totalPopulation, averagePopulation, pieData } = useMemo(() => {

        const total = countries.reduce((acc, country) => {
            return acc + Number(country.population);
        }, 0);

        const average = total / countries.length;


        const top10 = countries.sort((a, b) => b.population - a.population).slice(0, 10);
        const otherPopulation = countries.slice(10)
            .reduce((sum, c) => sum + c.population, 0);

        const pieData = [
            ...top10.map(c => ({
                name: c.name,
                value: c.population
            })),
            { name: 'Others', value: otherPopulation }
        ];

        return {
            totalPopulation: total,
            averagePopulation: average,
            pieData,
        };

    }, [countries]);

    return (
        <div>
            <Card className="mb-10">
                <CardHeader>
                    <CardTitle className="font-medium">Population Overview</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-around">
                    <div className="text-center">
                        <div className="text-2xl">
                            {formatPopulation(totalPopulation)}
                        </div>
                        <div className="text-sm text-gray-500">Total Population</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl">
                            {formatPopulation(averagePopulation)}
                        </div>
                        <div className="text-sm text-gray-500">Average Population</div>
                    </div>
                </CardContent>
            </Card>
            {/* Pie Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="font-medium">Top 10 Countries by Population</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={150}
                                    label={({ name, percent }) =>
                                        `${name} (${(percent * 100).toFixed(1)}%)`
                                    }
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={entry.name} fill={colors[index % colors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatPopulation(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}

Stats.propTypes = {
    countries: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            population: PropTypes.string.isRequired,
            flagUrl: PropTypes.string.isRequired,
            capital: PropTypes.string.isRequired,
            iso: PropTypes.string.isRequired,
        })
    ).isRequired,
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

                if (populationRes.data.error === true || flagRes.data.error === true || capitalRes.data.error === true) {
                    console.error(populationRes.data.msg, flagRes.data.msg, capitalRes.data.msg);
                    throw new Error("Error fetching data");
                }

                // console.log(populationData);

                // Combine population and flag data
                const combinedData = populationData.map(country => {
                    const capital = capitalRes.data.data.find(capital => capital.name === country.country);
                    const flag = flagRes.data.data.find(flag => flag.name === country.country);
                    return {
                        name: country.country,
                        population: country.populationCounts.at(-1)?.value || "N/A",
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

        <Stats countries={countries} />

    );
};

export default App;


const formatPopulation = (population) => {
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};