import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_CAROUSEL_ITEMS } from "../../redux/actions";
import { Spinner } from "react-bootstrap";
import { AdvancedImage } from "@cloudinary/react";
import { cloudinaryImg } from "../../helpers/cloudinary";
import { BsCheck, BsFillArrowRightCircleFill, BsFillArrowLeftCircleFill } from "react-icons/bs";
import { MdOutlineDelete } from 'react-icons/md';
import { RxCross2 } from "react-icons/rx";
import "../../styles/components/landing-manager.scss";

export default function CarouselManager() {
  const dispatch = useDispatch();
  const { carousel } = useSelector((state) => state.adminReducer);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        return carousel.length - 1;
      } else {
        return prevIndex - 1;
      }
    });
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === carousel.length - 1) {
        return 0;
      } else {
        return prevIndex + 1;
      }
    });
  };

  useEffect(() => {
    dispatch(GET_CAROUSEL_ITEMS()).then((res) => {
      setIsLoading(false);
    });
  }, [dispatch]);

  return (
    <>
      <div className="title">
        <h1>Landing manager</h1>
      </div>
      {isLoading ? (
        <div className="loading">
          <Spinner animation="border" size="lg" />
        </div>
      ) : (
        <div className="carousel">
          <BsFillArrowLeftCircleFill className="arrow prev" onClick={handlePrevClick} />
          <div className="carousel-items">
            {carousel
              .slice(currentIndex, currentIndex + 3)
              .map((elem) => (
                <div key={elem._id} className="item">
                  <div className="trash">
                    <MdOutlineDelete />
                  </div>
                  <div className="image">
                    <AdvancedImage cldImg={cloudinaryImg(elem.image)} />
                  </div>
                  <div className="details">
                    <p>Tipo: {elem.type}</p>
                    <p>
                      Activo: {elem.active ? <BsCheck /> : <RxCross2 />}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <BsFillArrowRightCircleFill className="arrow next" onClick={handleNextClick} />
        </div>
      )}
    </>
  );
}
