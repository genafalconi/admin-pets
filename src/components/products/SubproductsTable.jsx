import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import '../../styles/components/product-form.scss';

export default function SubproductsTable() {
  const { subproducts, product } = useSelector((state) => state.adminReducer);

  return (
    <Table className="subprod-table" striped bordered hover variant="dark" size="sm">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Compra</th>
          <th>Venta</th>
          <th>Stock</th>
          <th>Animal</th>
        </tr>
      </thead>
      <tbody>
        {
          Array.isArray(subproducts) && subproducts.length > 0 && subproducts.map((elem) => {
            return (
              <tr>
                <td>{product.name} {elem.size}kg</td>
                <td>${elem.buy_price.toFixed(2)}</td>
                <td>${elem.sell_price.toFixed(2)}</td>
                <td>{elem.stock}</td>
                <td>{elem.animal_size}</td>
              </tr>
            )
          })
        }
      </tbody>
    </Table>
  )
}