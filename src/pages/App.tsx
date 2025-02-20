import { useRoutes } from 'react-router-dom';
import routes from '@/routes/index';

const App = () => {
  const routing = useRoutes(routes);
  return (
    <div className="min-h-screen bg-white dark:bg-stone-800">
      { routing }
    </div>
  )
}

export default App;