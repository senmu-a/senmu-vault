import { useRoutes } from 'react-router-dom';
import routes from '@/routes/index';

const App = () => {
  const routing = useRoutes(routes);
  return (
    <>
      { routing }
    </>
  )
}

export default App;