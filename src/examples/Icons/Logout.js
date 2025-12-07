/**
=========================================================
* Vannisa Brownies - v4.0.1
=========================================================

* Custom Logout Icon
*/

import PropTypes from "prop-types";
import colors from "assets/theme/base/colors";

function Logout({ color, size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 42 42"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>logout</title>
      <g
        id="Basic-Elements"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Rounded-Icons"
          transform="translate(-1870, -710)"
          fill={colors[color] ? colors[color].main : colors.dark.main}
          fillRule="nonzero"
        >
          <g id="Icons" transform="translate(1716, 291)">
            <g id="logout" transform="translate(154, 419)">

              {/* Outer box (frame), same style as others */}
              <path
                opacity="0.65"
                d="M6,4 L26,4 C28.209,4 30,5.791 30,8 L30,34 C30,36.209 28.209,38 26,38 L6,38 C3.791,38 2,36.209 2,34 L2,8 C2,5.791 3.791,4 6,4 Z"
              />

              {/* Logout arrow */}
              <path d="M32,21 L22,21 C20.895,21 20,20.105 20,19 C20,17.895 20.895,17 22,17 L32,17 L32,12 L40,18 L32,24 L32,21 Z" />

              {/* Vertical bar (logout source) */}
              <rect x="10" y="12" width="6" height="16" rx="2" />

            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

Logout.defaultProps = {
  color: "dark",
  size: "16px",
};

Logout.propTypes = {
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

export default Logout;
