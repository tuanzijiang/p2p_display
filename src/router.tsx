import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { LogViewerPage } from './routes/LogViewerPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <LogViewerPage />,
      },
    ],
  },
]);
