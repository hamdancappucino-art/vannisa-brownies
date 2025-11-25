/**
=========================================================
* Vannisa Brownies - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Vannisa Brownies base styles
import colors from "assets/theme/base/colors";

function Profile({ color, size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 42 42"
      xmlns="http://www.w3.org/2000/svg"
      fill={colors[color] ? colors[color].main : colors.dark.main}
    >
      <title>profile</title>
      <g fillRule="nonzero">
        {/* Kepala */}
        <circle cx="21" cy="13" r="7" />
        {/* Bahu / badan */}
        <path d="M21 23c-6.627 0-12 3.373-12 7.5V38h24v-7.5C33 26.373 27.627 23 21 23z" />
      </g>
    </svg>
  );
}

// Default props
Profile.defaultProps = {
  color: "dark",
  size: "16px",
};

// Prop types
Profile.propTypes = {
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

export default Profile;
