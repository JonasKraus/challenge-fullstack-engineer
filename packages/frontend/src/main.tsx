import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BACKEND_ROUTES } from "@challenge/utils";
import { OrderOverview } from "./components/orders/OrderOverview";
import Login from "./components/login/Login";
import { OrderDetailView } from "./components/orders/OrderDetailView";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
				element: <Login/>
			},
			{
				path: BACKEND_ROUTES.ORDERS,
				element: <OrderOverview/>
			},
			{
				path: BACKEND_ROUTES.ORDER,
				element: <OrderDetailView/>
			}
		]
	}
])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
