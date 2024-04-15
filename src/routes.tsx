import {createBrowserRouter} from 'react-router-dom';
import App from "@/App.tsx";

const routes = createBrowserRouter([
    {path: '/', element: <App/>}
])

export default routes;