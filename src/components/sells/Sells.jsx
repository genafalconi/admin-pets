import { useCallback, useEffect, useState } from "react";
import { Accordion, Placeholder, Card } from "react-bootstrap";
import ProductsTable from "./ProductsTable";
import { useDispatch, useSelector } from "react-redux";
import { GET_PAGINATED_ORDERS } from "../../redux/actions";
import LazyComponent from "../../helpers/lazyComponents";
import '../../styles/components/sell-forms.scss';
import CustomPagination from "../atomic/CustomPagination";

export default function Sells() {
  const dispatch = useDispatch();
  const { sells, total_pages, total_movements } = useSelector((state) => state.adminReducer);

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const getSells = useCallback(() => {
    dispatch(GET_PAGINATED_ORDERS(currentPage)).then((res) => {
      if (res.payload) setIsLoading(false);
    });
  }, [dispatch, currentPage]);

  const handlePageClick = (pageNumber) => {
    if (pageNumber <= total_pages && pageNumber >= 1) {
      setCurrentPage(pageNumber);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return `${day < 10 ? "0" : ""}${day}/${month < 10 ? "0" : ""}${month}/${year}`;
  };

  useEffect(() => {
    getSells();
  }, [getSells]);

  return (
    <Card>
      <Card.Body>
        <Card.Title className="registry-title">Registro - Total: {total_movements === 0 ? sells?.length : total_movements}</Card.Title>
        <Card>
          <Card.Title className="d-flex w-100 card-title m-0 p-1 justify-content-around h5">
            <p>Fecha</p>
            <p>Cliente</p>
            <p>Total</p>
          </Card.Title>
        </Card>
        {!isLoading ? (
          <>
            {sells?.length !== 0 ? (
              <>
                <Accordion key="accordion-sells" className="accordion-sells">
                  {sells.map((elem, index) => {
                    return (
                      <Accordion.Item key={`${elem._id}-${index}`} eventKey={elem._id}>
                        <Accordion.Header>
                          <div className="col sell-header-col">
                            <h5>{formatDate(elem.offer?.date)}</h5>
                          </div>
                          <div className="col sell-header-col">
                            <h5>{elem.user?.full_name}</h5>
                          </div>
                          <div className="col sell-header-col">
                            <h5>${elem.cart?.total_price?.toFixed(2)}</h5>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <LazyComponent>
                            <ProductsTable products={elem.products} totalProducts={elem.cart?.total_price} isSell={true} />
                          </LazyComponent>
                        </Accordion.Body>
                      </Accordion.Item>
                    );
                  })}
                </Accordion>
                <CustomPagination currentPage={currentPage} totalPages={total_pages} handlePageClick={handlePageClick} />
              </>
            ) : (
              <h2 className="fs-4 mt-2">No hay ventas</h2>
            )}
          </>
        ) : (
          <Placeholder as={Accordion} animation="glow" className="accordion-orders">
            <Placeholder as={Accordion.Header} animation="glow">
              <Placeholder xs={11} />
            </Placeholder>
            <Placeholder as={Accordion.Header} animation="glow">
              <Placeholder xs={11} />
            </Placeholder>
          </Placeholder>
        )}
      </Card.Body>
    </Card>
  );
}