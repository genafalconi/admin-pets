import { Badge, Card, Spinner, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { GET_DELIVERY_BY_WEEK, GET_ORDER_DETAILS, UPDATE_ORDER_DELIVER_STATUS } from "../../redux/actions";
import handleBadge from "../../helpers/badgeHandler";
import { TbListDetails } from 'react-icons/tb';
import OrderDetail from "./OrderDetail";
import handleStatusOrder from "../../helpers/handleStatusOrder";
import '../../styles/components/order-details.scss';

export default function ClientReminder() {

  const { users_reminder, week } = useSelector((state) => state.adminReducer);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(null);

  const getClientsByWeek = useCallback(() => {
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

  useEffect(() => {

  }, [users_reminder])

  useEffect(() => {
    getClientsByWeek();
  }, [getClientsByWeek]);

  return (
    <Card className='client-reminder'>
      <Card.Body>
        <Card.Title>Recordatorio a clientes</Card.Title>
        {
          users_reminder.length === 0 ? (
            <h2 className="fs-4 mt-2">No hay recordatorios esta semana</h2>
          ) : (
            <Table striped bordered hover size="sm" variant="dark">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Ultimo pedido</th>
                  <th>Proximo pedido</th>
                </tr>
              </thead>
              <tbody>
                {
                  users_reminder.map((elem) => (
                    <tr key={elem._id}>
                      <td>{elem.full_name}</td>
                      <td>{formatDate(elem.last_order)}</td>
                      <td>{formatDate(elem.next_order)}</td>\
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          )
        }
      </Card.Body>
    </Card>
  )
}