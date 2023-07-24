import { Card, Col, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import '../../styles/components/order-details.scss';

export default function OrderDetail() {

  const { order } = useSelector((state) => state.adminReducer);

  return (
    <Card className="order-detail-card">
      <Card.Body>
        <Card.Title>{order.user.full_name}</Card.Title>
        <Row>
          <h6>Direccion</h6>
          <Col>Calle: {order.address.street} {order.address.number}</Col>
          <Col>Depto: {order.address.flat ? order.address.flat : '-'} {order.address.floor ? order.address.floor : '-'}</Col>
          <Col>Ciudad: {order.address.city}</Col>
          <Col>Extra: {order.address.extra ? order.address.extra : '-'}</Col>
        </Row>
        <Row className="">
          <h6>Productos</h6>
          <div className=" ps-3 pe-3">
            <Table striped bordered hover size="sm" variant="dark" className="mt-1">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                </tr>
              </thead>
              <tbody>
                {order.cart.subproducts?.map((elem) => (
                  <tr key={elem.subproduct._id}>
                    <td>{elem.subproduct.product.name} {elem.subproduct.size}kg</td>
                    <td>{elem.quantity}</td>
                    <td>${elem.subproduct.sell_price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Row>
        <Row className="order-total">
          <Col>Metodo de pago: {order.payment_type}</Col>
          <Col>Total: ${order.cart.total_price.toFixed(2)}</Col>
        </Row>
      </Card.Body>
    </Card>
  )
}