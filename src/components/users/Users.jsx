import { useCallback, useEffect, useState } from "react";
import { Card, Pagination, Spinner, Table } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux";
import { GET_PAGINATED_USERS } from "../../redux/actions";

export default function Users() {

  const dispatch = useDispatch();
  const { users, total_pages, total_movements } = useSelector((state) => state.adminReducer);

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const getUsers = useCallback(() => {
    dispatch(GET_PAGINATED_USERS(currentPage)).then((res) => {
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
    if (users?.length === 0) {
      getUsers();
    } else {
      setIsLoading(false)
    }
    // eslint-disable-next-line
  }, [getUsers]);

  useEffect(() => {
    getUsers();
  }, [getUsers, currentPage]);

  return (
    <Card>
      <Card.Body>
        <Card.Title className="registry-title">Registro - Total: {isLoading ? 0 : total_movements}</Card.Title>
        {
          !isLoading ? (
            <>
              {
                users?.length > 0 ? (
                  <>
                    <Table striped size="sm" bordered hover variant="dark">
                      <thead>
                        <tr>
                          <th>Nro</th>
                          <th>Nombre y Apellido</th>
                          <th>Contacto</th>
                          <th>Direccion</th>
                          <th>Ultimo Pedido</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          users?.map((elem, index) => {
                            return (
                              <tr key={elem._id}>
                                <td>{index}</td>
                                <td>{elem.full_name}</td>
                                <td>{elem.phone ? elem.phone : '-'}</td>
                                {
                                  elem.last_address?.street ? (
                                    <td>{elem.last_address?.street} {elem.last_address?.number} {elem.last_address?.extra}</td>
                                  ) : <td>-</td>
                                }
                                <td>{elem.last_order?.createdAt ? formatDate(elem.last_order?.createdAt) : '-'}</td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </Table>
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
                  <h2 className="fs-4 mt-2">No hay clientes</h2>
                )
              }
            </>
          ) : (
            <div className="loading-no-central">
              <Spinner as="span" animation="border" size="xl" role="status" aria-hidden="true" />
            </div>
          )
        }
      </Card.Body>
    </Card>
  )
}