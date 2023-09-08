import { useNavigate } from "react-router-dom";
import '../../styles/components/nav.scss'
import { AdvancedImage } from "@cloudinary/react";
import { cloudinaryImg } from "../../helpers/cloudinary";

export default function NavItem({ Icon, name, img }) {

  const navigate = useNavigate()

  const handleSection = () => {
    navigate(`/${name.toLowerCase()}`);
  }

  return (
    <div className="item-container" id={name} onClick={handleSection}>
      {Icon ? Icon : <AdvancedImage cldImg={cloudinaryImg(img)} alt={name} />}
      <p>{name}</p>
    </div>
  )

}