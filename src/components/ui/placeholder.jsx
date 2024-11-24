import { Flag } from "lucide-react";
import React from "react";
import PropTypes from "prop-types";

const FlagPlaceholder = ({ countryName }) => (
  <div className="flex flex-col items-center justify-center w-40 h-24 text-gray-400 border-2 border-gray-200 border-dashed rounded">
    <Flag size={24} />
    <span className="max-w-full px-2 mt-2 text-xs text-center truncate">
      {countryName}
    </span>
  </div>
);
FlagPlaceholder.propTypes = {
  countryName: PropTypes.string.isRequired,
};

export default FlagPlaceholder;
