import { Table } from "react-bootstrap";
import '../../styles/components/sell-forms.scss'

export default function ProductsTable({ products, totalProducts, isSell }) {

  return (
    <Table striped bordered hover size="sm" variant="dark" className='product-table mt-3'>
      <thead>
        <tr key={'header'}>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio Compra</th>
          <th>Precio Venta</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {
          products?.map((elem, index) => {
            return (
              <tr key={`${elem._id}-${index}`}>
                <td>{`${elem.product?.name ? elem.product.name : elem.name} ${elem.size}kg`}</td>
                <td>{elem.quantity}</td>
                <td>${elem.buy_price?.toFixed(2)}</td>
                <td>${elem.sell_price?.toFixed(2)}</td>
                <td>${((isSell ? elem.sell_price : elem.buy_price) * elem.quantity)?.toFixed(2)}</td>
              </tr>
            )
          })
        }
        <tr>
          <td colSpan={4}>Total</td>
          <td>${totalProducts?.toFixed(2)}</td>
        </tr>
      </tbody>
    </Table>
  )
}