import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { DashboardPage } from './routes/DashboardPage';
import { HomePage } from './routes/HomePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
    ],
  },
]);
