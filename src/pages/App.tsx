import { useRoutes } from 'react-router-dom';
import routes from '@routes/index';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const routing = useRoutes(routes);
  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-white dark:bg-stone-800 transition-colors duration-200 ease-in">
        {routing}
      </div>
    </>
  );
};

export default App;
