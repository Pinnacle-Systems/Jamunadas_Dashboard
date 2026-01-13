import React from "react";

const SpinLoader = () => {
  return (
    <div style={styles.overlay}>
      <div style={styles.spinner}>
        <div style={{ ...styles.blade, transform: "rotate(0deg)" }} />
        <div style={{ ...styles.blade, transform: "rotate(90deg)" }} />
        <div style={{ ...styles.blade, transform: "rotate(180deg)" }} />
        <div style={{ ...styles.blade, transform: "rotate(270deg)" }} />
        <div style={styles.center} />
      </div>

      <style>
        {`
          @keyframes spin {
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

const GREY = "#6B7280";

const styles = {
  overlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },

  spinner: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    border: `2px solid ${GREY}`,
    position: "relative",
    animation: "spin 0.9s linear infinite",
    boxShadow: `0 0 6px ${GREY}40`,
  },

  blade: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "22px",
    height: "6px",
    background: `linear-gradient(to right, transparent, ${GREY})`,
    borderRadius: "0 10px 10px 0",
    transformOrigin: "0% 50%",
    transform: "translateY(-50%)",
  },

  center: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "10px",
    height: "10px",
    background: GREY,
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
  },
};

export default SpinLoader;
