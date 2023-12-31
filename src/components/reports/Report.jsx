import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GET_FULL_REPORTS } from '../../redux/actions';
import { Card, Row, Table } from 'react-bootstrap';
import MonthYearPicker from '../atomic/MonthYearPicker';
import '../../styles/components/reports.scss'
import ChartComponent from '../atomic/Chart';

export default function Reports() {
  const dispatch = useDispatch();
  const { users, total_import_sell, total_import_buy, total_profit, total_import_expense, stock, cash, bank } = useSelector((state) => state.adminReducer);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleMonthYearChange = useCallback((month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  }, []);

  const calculateMargin = () => {
    const margin = ((total_profit - total_import_expense) / total_import_sell) * 100;
    const roundedMargin = Math.ceil(margin * 100) / 100;
    return parseFloat(roundedMargin.toFixed(2));
  }

  const getFullReports = useCallback(() => {
    const selectedDate = selectedMonth < 12 ? new Date(selectedYear, selectedMonth, 15).toISOString() : '';
    dispatch(GET_FULL_REPORTS(selectedDate));
  }, [dispatch, selectedMonth, selectedYear]);

  const getReports = useCallback(() => {
    const today = new Date().toISOString();
    getFullReports(today)
  }, [getFullReports]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
  };

  useEffect(() => {
    getReports();
  }, [getReports]);

  return (
    <>
      <div className="title">
        <h1>Reportes</h1>
      </div>
      <div className="content-container report">
        <div className="first-col">
          <Card className='report-card graphic'>
            <Card.Body>
              <Row className='date-picker mb-3'>
                <MonthYearPicker
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  onChange={handleMonthYearChange}
                />
              </Row>
              <Row className="row-values">
                <ChartComponent
                  totalImportBuy={total_import_buy}
                  totalImportSell={total_import_sell}
                  totalProfit={total_profit}
                  totalExpenses={total_import_expense}
                  percentage={calculateMargin()}
                />
              </Row>
            </Card.Body>
          </Card>
          <Card className='report-card graphic'>
            <Card.Body>
              <Card.Title>Cashflow</Card.Title>
              <div className="cashflow">
                <p>Efectivo: ${cash}</p>
                <p>Banco: ${bank}</p>
              </div>
              <Card.Title>Stock</Card.Title>
              <div className="stock">
                <Table striped bordered hover size="sm" variant="dark" className="mt-3">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stock?.map((elem) => (
                      <tr key={elem._id}>
                        <td>{elem.product}</td>
                        <td>{elem.quantity}</td>
                        <td>{elem.buy_price > 0 ? `$${elem.buy_price?.toFixed(2)}` : '-'}</td>
                        <td>${(elem.buy_price * elem.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3}>Total</td>
                      <td>
                        ${stock.length > 0
                          ? stock.reduce((tot, curr) => tot + curr.quantity * curr.buy_price, 0).toFixed(2)
                          : '0'}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="second-col">
          <Card className='user-report-card'>
            <Card.Body>
              <Card.Title className='fs-4'>Clientes</Card.Title>
              <Table striped bordered hover size="sm" variant="dark" className="mt-3">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Ultima Compra</th>
                    <th>Re-compra</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((elem) => (
                    <tr key={elem._id}>
                      <td>{elem.name}</td>
                      <td>{elem.total_buys > 0 ? `$${elem.total_buys?.toFixed(2)}` : '-'}</td>
                      <td>{elem.last_buy ? formatDate(elem.last_buy) : '-'}</td>
                      <td>{elem.re_buy ? formatDate(elem.re_buy) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
}
