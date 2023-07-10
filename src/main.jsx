import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// const router = createBrowserRouter([
//   // {
//   //   path: "/",
//   //   element: <Root />,
//   //   errorElement: <ErrorPage />,
//   //   children: [
//   //     {
//   //       path: "contacts/:contactId",
//   //       element: <Contact />,
//   //     },
//   //   ],
//   // },
//   {
//     path: "/",
//     element: <App />,
//     errorElement: <ErrorPage />,
//   },
// ]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
