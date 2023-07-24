import './App.scss';
import './styles/mixins.scss'
import 'sweetalert2/src/sweetalert2.scss';
import AutoLogout from './components/atomic/AutoLogout';
import Nav from './components/admin/Nav';
import LazyComponent from './helpers/lazyComponents';
import { Route, Routes } from 'react-router-dom';
import ValidateSesion from './helpers/validateSesion';
import FullForm from './components/sells/FullForm';
import BuyForm from './components/buys/BuyForm';
import UserForm from './components/users/UserForm';
import Products from './components/products/Products';
import Reports from './components/reports/Report';
import Delivery from './components/delivery/Delivery';

function App() {
  return (
    <div className="App">
      {/* <ValidateSesion /> */}
      <AutoLogout inactivityTime={process.env.REACT_APP_INACTIVITY} />
      <Nav />
      <div className='content-page'>
        <Routes>
          <Route exact path="/entregas" element={<LazyComponent><Delivery /></LazyComponent>} />
          <Route exact path="/ventas" element={<LazyComponent><FullForm /></LazyComponent>} />
          <Route exact path="/compras" element={<LazyComponent><BuyForm /></LazyComponent>} />
          <Route exact path="/clientes" element={<LazyComponent><UserForm /></LazyComponent>} />
          <Route exact path="/productos" element={<LazyComponent><Products /></LazyComponent>} />
          <Route exact path="/reportes" element={<LazyComponent><Reports /></LazyComponent>} />
        </Routes>
      </div>
    </div >
  );
}

export default App;
