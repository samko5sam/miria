import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      <Navbar />
      <hr />
      <Outlet />
    </div>
  );
}

export default App;
