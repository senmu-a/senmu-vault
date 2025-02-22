import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import MainLayout from '@layouts/MainLayout';

import Home from '@pages/Home';
import PageNotFoundView from '@components/common/PageNotFoundView';
import DappTest from '@pages/DappTest';

const Test = lazy(() => import('@components/Test'));
const Routes: RouteObject[] = [];

const Layout = () => {
  return (
    <Suspense fallback="loading...">
      <MainLayout />
    </Suspense>
  );
};

const mainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    { path: '*', element: <PageNotFoundView /> },
    { path: '/dapp', element: <DappTest /> },
    { path: '/', element: <Home /> },
    { path: '404', element: <PageNotFoundView /> },
  ],
};

const demoRoutes = {
  path: 'senmu',
  element: <Layout />,
  children: [{ path: 'test', element: <Test /> }],
};

Routes.push(mainRoutes, demoRoutes);

export default Routes;
