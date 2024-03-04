import React from "react";
import ReactDOM from "react-dom/client";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import App from "./App";
import "./index.css";
import { AuthContextProvider } from "./context/authContext";
import { DarkModeContextProvider } from "./context/darkModeContext";

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_LEFT,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
};




const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <AuthContextProvider>
        <AlertProvider template={AlertTemplate} {...options}>
          <App />
        </AlertProvider>
      </AuthContextProvider>
    </DarkModeContextProvider>
  </React.StrictMode>
);
