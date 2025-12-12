import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const CustomDialog = ({ open, onClose, title, subtitle, type }) => {
  const getColor = () => {
    switch (type) {
      case "success":
        return "#4caf50"; // hijau
      case "error":
        return "#f44336"; // merah
      case "warning":
        return "#ff9800"; // orange
      default:
        return "#000";
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: "bold", color: getColor() }}>
        {title}
      </DialogTitle>

      {subtitle && (
        <DialogContent>
          <Typography sx={{ fontSize: "14px" }}>{subtitle}</Typography>
        </DialogContent>
      )}

      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ bgcolor: getColor(), color: "white.main" }}
        >
          Oke
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CustomDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  type: PropTypes.oneOf(["success", "error", "warning"]),
};

CustomDialog.defaultProps = {
  subtitle: "",
  type: "success",
};

export default CustomDialog;
