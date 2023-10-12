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
                <td>{
                  `${elem.subproduct?.product?.name ? elem.subproduct?.product?.name : elem.name} 
                ${elem.subproduct?.size ? elem.subproduct?.size : elem.size}kg`
                }</td>
                <td>{elem.quantity}</td>
                <td>${elem.buy_price?.toFixed(2)}</td>
                <td>${elem.highlight ? elem.sale_price?.toFixed(2) : elem.sell_price?.toFixed(2)}</td>
                <td>${((isSell ? (elem.highlight ? elem.sale_price : elem.sell_price) : elem.buy_price) * elem.quantity)?.toFixed(2)}</td>
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