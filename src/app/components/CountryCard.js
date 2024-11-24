import React from "react";
import PropTypes from "prop-types";

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

export default CountryCard;