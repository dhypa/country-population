import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SortAsc, Users } from 'lucide-react';

import FlagPlaceholder from '@/components/ui/placeholder';
import PropTypes from 'prop-types';

const formatPopulation = (population) => {
    if (population === "N/A") return "N/A";
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};


const CountryCardGrid = ({ countries }) => {
    const [sortBy, setSortBy] = useState('alphabetical');

    const sortedCountries = [...countries].sort((a, b) => {
        switch (sortBy) {
            case 'population':
                // Handle "N/A" values
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
            <div className="flex items-center justify-between pr-16 mb-6">
                <h1 className="text-2xl font-bold">Countries Overview</h1>
                <div className="flex items-center gap-2">
                    <SortAsc className="text-gray-500" size={20} />
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sortedCountries.map((country) => (
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
