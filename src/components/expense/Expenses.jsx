import { useCallback, useEffect, useState } from "react";
import { Accordion, Placeholder, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { GET_PAGINATED_EXPENSES } from "../../redux/actions";
import LazyComponent from "../../helpers/lazyComponents";
import '../../styles/components/sell-forms.scss';
import CustomPagination from "../atomic/CustomPagination";

export default function Expenses() {
  const dispatch = useDispatch();
  const { expenses, total_pages, total_movements } = useSelector((state) => state.adminReducer);

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const getExpenses = useCallback(() => {
    dispatch(GET_PAGINATED_EXPENSES(currentPage)).then((res) => {
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

  }, [expenses])

  useEffect(() => {
    getExpenses();
  }, [getExpenses]);

  return (
    <Card>
      <Card.Body>
        <Card.Title className="registry-title">Registro - Total: {total_movements === 0 ? expenses?.length : total_movements}</Card.Title>
        <Card>
          <Card.Title className="d-flex w-100 card-title m-0 p-1 justify-content-around h5">
            <p>Fecha</p>
            <p>Tipo</p>
            <p>Total</p>
          </Card.Title>
        </Card>
        {!isLoading ? (
          <>
            {expenses?.length !== 0 ? (
              <>
                <Accordion key="accordion-sells" className="accordion-sells">
                  {expenses?.map((elem) => {
                    return (
                      <Accordion.Item key={elem._id} eventKey={elem._id}>
                        <Accordion.Header>
                          <div className="col sell-header-col">
                            <h5>{formatDate(elem.date)}</h5>
                          </div>
                          <div className="col sell-header-col">
                            <h5>{elem.type}</h5>
                          </div>
                          <div className="col sell-header-col">
                            <h5>${elem.total}</h5>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <LazyComponent>
                            <div>
                              <p>{elem.description}</p>
                            </div>
                          </LazyComponent>
                        </Accordion.Body>
                      </Accordion.Item>
                    );
                  })}
                </Accordion>
                <CustomPagination currentPage={currentPage} totalPages={total_pages} handlePageClick={handlePageClick} />
              </>
            ) : (
              <h2 className="fs-4 mt-2">No hay gastos</h2>
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