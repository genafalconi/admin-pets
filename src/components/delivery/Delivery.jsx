import { Badge, Card, Spinner, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { GET_DELIVERY_BY_WEEK, GET_ORDER_DETAILS, UPDATE_ORDER_DELIVER_STATUS } from "../../redux/actions";
import handleBadge from "../../helpers/badgeHandler";
import { TbListDetails } from 'react-icons/tb';
import OrderDetail from "./OrderDetail";
import handleStatusOrder from "../../helpers/handleStatusOrder";
import '../../styles/components/order-details.scss';

export default function Delivery() {

  const { deliverys, week } = useSelector((state) => state.adminReducer);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(null);

  const getDeliverysByWeek = useCallback(() => {
    dispatch(GET_DELIVERY_BY_WEEK()).then((res) => {
      if (res.payload) {
        setIsLoading(false);
      }
    });
  }, [dispatch]);

  const formatDate = (date) => {
    const dateObj = new Date(date);
    const day = dateObj.getUTCDate().toString().padStart(2, "0");
    const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getUTCFullYear().toString();

    return `${day}/${month}/${year}`;
  };

  const handleDetails = (order_id) => {
    setIsLoadingDetails(order_id);
    dispatch(GET_ORDER_DETAILS(order_id)).then((res) => {
      if (res.payload) {
        setIsLoadingDetails(false);
        setShowOrderDetails(order_id);
      }
    });
  };

  const handleDeliveryStatus = (order_id, status) => {
    setIsLoadingStatus(order_id);
    dispatch(UPDATE_ORDER_DELIVER_STATUS({ order_id, status })).then((res) => {
      if (res.payload) {
        setIsLoadingStatus(false);
      }
    });
  };

  useEffect(() => {

  }, [deliverys])

  useEffect(() => {
    getDeliverysByWeek();
  }, [getDeliverysByWeek]);

  return (
    <>
      <div className="title">
        <h1>Entregas</h1>
      </div>
      <div className="content-container deliver">
        {
          !isLoading ? (
            <>
              <Card className={showOrderDetails ? 'deliver-card' : 'deliver-card alone'}>
                <Card.Body>
                  <Card.Title>{formatDate(week?.start)} al {formatDate(week?.end)}</Card.Title>
                  {
                    deliverys.length === 0 ? (
                      <h2 className="fs-4 mt-2">No hay entregas esta semana</h2>
                    ) : (
                      <Table striped bordered hover size="sm" variant="dark">
                        <thead>
                          <tr>
                            <th>Dia</th>
                            <th>Cliente</th>
                            <th>Estado</th>
                            <th>Entrega</th>
                            <th>Detalles</th>
                          </tr>
                        </thead>
                        <tbody>
                          {

                            deliverys.map((elem) => (
                              <tr key={elem._id}>
                                <td>{formatDate(elem.offer.date)}</td>
                                <td>{elem.user.full_name}</td>
                                <td>
                                  <Badge bg={handleBadge(elem?.status)?.variant} className="ms-2">
                                    {handleBadge(elem?.status)?.text}
                                  </Badge>
                                </td>
                                <td>
                                  <Badge pill bg={handleBadge(elem.status).variant} onClick={() => handleDeliveryStatus(elem._id, elem.status)}>
                                    {isLoadingStatus === elem._id ? <Spinner animation="border" size="sm" /> : handleStatusOrder(elem.status)}
                                  </Badge>
                                </td>
                                <td>
                                  {isLoadingDetails === elem._id ? (
                                    <Spinner animation="border" size="sm" />
                                  ) : (
                                    <TbListDetails onClick={() => handleDetails(elem._id)} />
                                  )}
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </Table>
                    )
                  }
                </Card.Body>
              </Card>
              {showOrderDetails && <OrderDetail />}
            </>
          ) : (
            <div className="loading">
              <Spinner animation="border" size="lg" />
            </div>
          )
        }
      </div>
    </>
  )
}