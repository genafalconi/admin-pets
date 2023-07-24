import { useCallback, useEffect, useState } from "react";
import { Accordion, Placeholder, Pagination, Card } from "react-bootstrap";
import ProductsTable from "../sells/ProductsTable";
import { useDispatch, useSelector } from "react-redux";
import { GET_PAGINATED_BUYS } from "../../redux/actions";
import LazyComponent from "../../helpers/lazyComponents";
import '../../styles/components/sell-forms.scss';

export default function Buys() {
  const dispatch = useDispatch();
  const { buys, total_pages, total_movements } = useSelector((state) => state.adminReducer);

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const getBuys = useCallback(() => {
    dispatch(GET_PAGINATED_BUYS(currentPage)).then((res) => {
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

  }, [buys])

  useEffect(() => {
    getBuys();
  }, [getBuys]);

  return (
    <Card className="ms-3">
      <Card.Body>
        <Card.Title className="registry-title">Registro - Total: {total_movements === 0 ? buys?.length : total_movements}</Card.Title>
        <Card>
          <Card.Title className="d-flex w-100 card-title m-0 p-1 justify-content-around h5">
            <p>Fecha</p>
            <p>Total</p>
          </Card.Title>
        </Card>
        {!isLoading ? (
          <>
            {buys?.length !== 0 ? (
              <>
                <Accordion key="accordion-sells" className="accordion-sells">
                  {buys?.map((elem) => {
                    const updatedProducts = elem.products?.map((subproduct) => ({
                      ...subproduct.subproduct,
                      buy_price: subproduct.subproduct?.buy_price,
                      size: subproduct.subproduct?.size,
                      quantity: subproduct.quantity
                    }));

                    return (
                      <Accordion.Item key={elem._id} eventKey={elem._id}>
                        <Accordion.Header>
                          <div className="col sell-header-col">
                            <h5>{formatDate(elem.date)}</h5>
                          </div>
                          <div className="col sell-header-col">
                            <h5>${elem.total_buy?.toFixed(2)}</h5>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <LazyComponent>
                            <ProductsTable products={updatedProducts} totalProducts={elem.total_buy} isSell={false} />
                          </LazyComponent>
                        </Accordion.Body>
                      </Accordion.Item>
                    );
                  })}
                </Accordion>
                <Pagination className="mb-0">
                  <Pagination.First onClick={() => handlePageClick(1)} />
                  <Pagination.Prev onClick={() => handlePageClick(currentPage - 1)} />
                  {[...Array(total_pages)].map((_, i) => (
                    <Pagination.Item
                      key={i}
                      active={currentPage === i + 1}
                      onClick={() => handlePageClick(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => handlePageClick(currentPage + 1)} />
                  <Pagination.Last onClick={() => handlePageClick(total_pages)} />
                </Pagination>
              </>
            ) : (
              <h2 className="fs-4 mt-2">No hay compras</h2>
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