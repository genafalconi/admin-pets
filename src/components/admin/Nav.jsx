import { Link } from "react-router-dom";
import { AdvancedImage } from '@cloudinary/react'
import { cloudinaryImg } from '../../helpers/cloudinary'
import '../../styles/components/nav.scss'
import NavItem from "../atomic/NavItem";
import { navItems } from "../../helpers/constants";

const LOGO_PUBLIC_ID = 'Ppales/Logo'

export default function Nav() {

  return (
    <nav className="nav">
      <div className='logo-nav'>
        <Link to='/' className="logo-link">
          <AdvancedImage cldImg={cloudinaryImg(LOGO_PUBLIC_ID)} alt='Logo' />
        </Link>
        <p className="m-0">Admin</p>
      </div>
      <div className="items-nav">
        <ul className="items-list">
          {
            navItems.map((elem) => {
              return <li key={elem.name}>
                <NavItem name={elem.name} Icon={elem.Icon} img={elem.img} />
              </li>
            })
          }
        </ul>
      </div>
    </nav>
  )
}