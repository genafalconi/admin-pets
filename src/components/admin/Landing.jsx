import { useNavigate } from 'react-router-dom';
import '../../styles/components/landing.scss';
import { cloudinaryImg } from '../../helpers/cloudinary';
import { AdvancedImage } from '@cloudinary/react';

const LOGO_PUBLIC_ID = 'Ppales/croplogo_ikxgit'

export default function Landing() {

  const navigate = useNavigate()

  const handleRedirect = (route) => {
    navigate(route);
  }

  return (
    <div className="landing-container">
      <header>
        <div>
          <AdvancedImage cldImg={cloudinaryImg(LOGO_PUBLIC_ID)} alt='Logo' />
          <h1>Pets Zone</h1>
        </div>
        <h2>Bienvenido al sitio de administración</h2>
      </header>
      <main>
        <div className="feature" onClick={() => handleRedirect('productos')}>
          <h3>Gestión de productos</h3>
          <p>Administre fácilmente todos los productos de Pets Zone. Agregue nuevos productos, actualice precios y más.</p>
        </div>
        <div className="feature" onClick={() => handleRedirect('entregas')}>
          <h3>Gestión de pedidos</h3>
          <p>Verifique los pedidos entrantes, actualice el estado de entrega y mantenga un registro de los detalles.</p>
        </div>
        <div className="feature" onClick={() => handleRedirect('clientes')}>
          <h3>Gestión de clientes</h3>
          <p>Verifique los clientes junto con sus detalles detalles.</p>
        </div>
        <div className="feature" onClick={() => handleRedirect('reportes')}>
          <h3>Informes y estadísticas</h3>
          <p>Obtenga información valiosa sobre las ventas, clientes y productos más populares.</p>
        </div>
      </main>
      <footer>
        <p>Todos los derechos reservados &copy; {new Date().getFullYear()} Pets Zone</p>
      </footer>
    </div>
  );
}
