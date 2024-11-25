import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useState } from 'react';
import { Search, SortAsc, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import FlagPlaceholder from '@/components/ui/placeholder';
import { Input } from '@/components/ui/input';
import PropTypes from 'prop-types';

const formatPopulation = (population) => {
    if (population === "N/A") return "N/A";
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};


const CountryCardGrid = ({ countries }) => {
    const [sortBy, setSortBy] = useState("alphabetical");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter and sort countries
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
                    if (a.population === "N/A") return 1;
                    if (b.population === "N/A") return -1;
                    return b.population - a.population;
                case 'alphabetical':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });
    return (
        <div className="p-4">
            <div className="space-y-4">

                <div className="flex flex-col gap-4 sm:flex-row">
                    {/* Search Input */}
                    <div className="relative w-[84%]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search by country name or ISO code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                        <SortAsc className="hidden text-gray-500 sm:block" size={20} />
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                                <SelectItem value="population">Population (High to Low)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Results count */}
                <div className="text-sm text-gray-500">
                    Found {filteredAndSortedCountries.length} {filteredAndSortedCountries.length === 1 ? 'country' : 'countries'}
                    {searchQuery && ` matching "${searchQuery}"`}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredAndSortedCountries.map((country) => (
                    <Card
                        key={country.iso}
                        className="w-full max-w-sm transition-shadow hover:bg-slate-200/30 hover:border hover:border-black"
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
}


const CountryCard = ({ name, flagUrl, population, capital }) => {
    return (
        <div className="country-card">
            <img src={flagUrl} alt={`${name} flag`} className="aspect-[2/3]" />
            <h3>{name}</h3>
            <p>Population: {population}</p>
            {capital && <p>Capital: {capital}</p>}
        </div>
    );
};


CountryCard.propTypes = {
    name: PropTypes.string,
    flagUrl: PropTypes.string,
    population: PropTypes.number,
    capital: PropTypes.string
};

CountryCardGrid.propTypes = {
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

export default CountryCardGrid;
