"use client";

import { Flag, Search } from "lucide-react";
import React, { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import PropTypes from 'prop-types';
import axios from "axios";

const filterData = (responseData) => {
    const startIndex = responseData.findIndex((item) => item.country === "Afghanistan");
    if (startIndex === -1) {
        return [];
    }
    return responseData.slice(startIndex); // Remove all elements before "Afghanistan"
};

export default function Page() {
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
        <CountryTable countries={countries} />
    );
}


const CountryTable = ({ countries }) => {
    const [sortBy, setSortBy] = useState('alphabetical');
    const [searchQuery, setSearchQuery] = useState('');

    const formatPopulation = (population) => {
        return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const filteredAndSortedCountries = [...countries]
        .filter(country => {
            const query = searchQuery.toLowerCase().trim();
            return (
                country.name.toLowerCase().includes(query) ||
                country.iso.toLowerCase().includes(query)
            );
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'population':
                    return b.population - a.population;
                // case 'population-reverse':
                //     if (a.population === "N/A") return 1;
                //     if (b.population === "N/A") return -1;
                //     return a.population - b.population;
                case 'alphabetical':
                    return a.name.localeCompare(b.name);
                case 'iso':
                    return a.iso.localeCompare(b.iso);
                case 'capital':
                    return (a.capital || '').localeCompare(b.capital || '');
                default:
                    return 0;
            }
        });

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Countries Overview</h1>

            <div className="flex flex-col gap-4 sm:flex-row">
                {/* Search Input */}
                <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search by country name or ISO code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="alphabetical">Country Name</SelectItem>
                        <SelectItem value="iso">ISO Code</SelectItem>
                        <SelectItem value="capital">Capital</SelectItem>
                        <SelectItem value="population">Population</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="text-sm text-gray-500">
                Found {filteredAndSortedCountries.length} {filteredAndSortedCountries.length === 1 ? 'country' : 'countries'}
                {searchQuery && ` matching "${searchQuery}"`}
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[30px]"></TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead className="w-[100px]">ISO</TableHead>
                            <TableHead>Capital</TableHead>
                            <TableHead className="text-right">Population</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedCountries.length > 0 ? (
                            filteredAndSortedCountries.map((country) => (
                                <TableRow key={country.iso}>
                                    <TableCell>
                                        {country.flagUrl ? (
                                            <img
                                                src={country.flagUrl}
                                                alt={`Flag of ${country.name}`}
                                                className="object-contain w-6 h-4"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <Flag className="w-4 h-4 text-gray-400" />
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{country.name}</TableCell>
                                    <TableCell className="font-mono text-sm">{country.iso}</TableCell>
                                    <TableCell>{country.capital || "Unknown"}</TableCell>
                                    <TableCell className="font-mono text-right">
                                        {formatPopulation(country.population)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

CountryTable.propTypes = {
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