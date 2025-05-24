import ReactDOM from 'react-dom/client'
import './index.css'
import { routes } from './routes/route.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { store } from './state/store.ts';
import { Provider } from 'react-redux';
import AuthInitializer from './components/AuthInitializer';

const router = createBrowserRouter(routes);
ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <AuthInitializer />
        <RouterProvider router={router} />
    </Provider>
);
