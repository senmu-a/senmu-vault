import Header from '@components/common/Header';
import { memo } from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="mx-auto px-4">
        <Outlet />
      </main>
    </>
  );
};
// MainLayout.whyDidYouRender = true;
export default memo(MainLayout);
