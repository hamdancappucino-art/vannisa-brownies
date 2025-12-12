import PropTypes from "prop-types";
import colors from "assets/theme/base/colors";

function Logout({ color, size }) {
  const strokeColor = colors[color] ? colors[color].main : colors.dark.main;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 3H13V5H8V19H13V21H6V3Z" />

      <path d="M13 12H21" />
      <path d="M18 9L21 12L18 15" />
    </svg>
  );
}

Logout.defaultProps = {
  color: "dark",
  size: "26px",
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
