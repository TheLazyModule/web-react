import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './App.css'
import routes from "@/routes.tsx";
import {RouterProvider} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={routes}></RouterProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)
