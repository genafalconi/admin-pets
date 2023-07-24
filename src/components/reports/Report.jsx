import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GET_BUYS_REPORT, GET_SELLS_REPORT, GET_USERS_REPORT } from '../../redux/actions';
import { Card, Row, Table } from 'react-bootstrap';
import MonthYearPicker from '../atomic/MonthYearPicker';
import '../../styles/components/reports.scss'
import ChartComponent from '../atomic/Chart';

export default function Reports() {
  const dispatch = useDispatch();
  const { users, total_import_sell, total_import_buy, total_profit, percentage } = useSelector((state) => state.adminReducer);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleMonthYearChange = useCallback((month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  }, []);

  const getBuysReport = useCallback(() => {
    const selectedDate = selectedMonth < 12 ? new Date(selectedYear, selectedMonth, 15).toISOString() : '';
    dispatch(GET_BUYS_REPORT(selectedDate));
  }, [dispatch, selectedMonth, selectedYear]);

  const getSellsReport = useCallback(() => {
    const selectedDate = selectedMonth < 12 ? new Date(selectedYear, selectedMonth, 15).toISOString() : '';
    dispatch(GET_SELLS_REPORT(selectedDate));
  }, [dispatch, selectedMonth, selectedYear]);

  const getUsersReport = useCallback(() => {
    dispatch(GET_USERS_REPORT());
  }, [dispatch]);

  const getReports = useCallback(() => {
    const today = new Date().toISOString();
    getBuysReport(today);
    getSellsReport(today);
    getUsersReport();
  }, [getBuysReport, getSellsReport, getUsersReport]);

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
        <Card className='report-card'>
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
                totalExpenses={total_import_sell - total_import_buy - total_profit}
                percentage={percentage}
              />
            </Row>
          </Card.Body>
        </Card>
        <Card className='report-card'>
          <Card.Body>
            <Card.Title className='fs-4'>Reporte clientes</Card.Title>
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
    </>
  );
}
