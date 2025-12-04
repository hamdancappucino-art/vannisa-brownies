/**
=========================================================
* Vannisa Brownies - v4.0.1
=========================================================

* Custom Master Data Icon (Folder + List)
*/
import PropTypes from "prop-types";
import colors from "assets/theme/base/colors";

function Master({ color, size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 42 42"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>master-data</title>
      <g
        id="Basic-Elements"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Rounded-Icons"
          transform="translate(-1870, -640)"
          fill={colors[color] ? colors[color].main : colors.dark.main}
          fillRule="nonzero"
        >
          <g id="Icons" transform="translate(1716, 291)">
            <g id="master-data" transform="translate(154, 349)">
              {/* Folder Top */}
              <path
                d="M4,10 L38,10 C39.1,10 40,10.9 40,12 L40,34 C40,35.1 39.1,36 38,36 L4,36 C2.9,36 2,35.1 2,34 L2,12 C2,10.9 2.9,10 4,10 Z"
                opacity="0.65"
              />

              {/* Tab Folder */}
              <path d="M18,6 L8,6 C6.9,6 6,6.9 6,8 L6,12 L22,12 L22,10 C22,7.79 20.21,6 18,6 Z" />

              {/* List Lines */}
              <rect x="10" y="18" width="20" height="3" rx="1.5" />
              <rect x="10" y="24" width="16" height="3" rx="1.5" />
              <rect x="10" y="30" width="22" height="3" rx="1.5" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

Master.defaultProps = {
  color: "dark",
  size: "16px",
};

Master.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
    "white",
  ]),
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Master;
