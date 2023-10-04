import { useCallback, useEffect, useState } from "react";
import { Card, Spinner, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
// import { BsSendCheck, BsSendX } from 'react-icons/bs';
import { GET_USERS_REBUY_WEEK } from "../../redux/actions";
import { AdvancedImage } from "@cloudinary/react";
import { cloudinaryImg } from "../../helpers/cloudinary";

const seven = 'Admin/number-7_8068340-removebg-preview_yy2ksd'
const fifthteen = 'Admin/number-15_8067991-removebg-preview_xf2vgv'

export default function Week() {

  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.adminReducer);

  const [isLoading, setIsLoading] = useState(true);
  // const [sended, setSended] = useState(null);

  const getUsersRebuyWeek = useCallback(() => {
    dispatch(GET_USERS_REBUY_WEEK()).then(() => {
      setIsLoading(false);
    })
  }, [dispatch])

  useEffect(() => {
    getUsersRebuyWeek();
  }, [getUsersRebuyWeek])

  return (
    <>
      <div className="title">
        <h1>Semana</h1>
      </div>
      {
        !isLoading ? (
          <Card>
            <Card.Body>
              <Card.Title>Clientes</Card.Title>
              <Table className="subprod-table" striped bordered hover variant="dark" size="sm">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Recompra</th>
                    <th>Pasar x dias</th>
                    <th>Enviar mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    Array.isArray(users) && users.length > 0 && users.map((elem) => {
                      return (
                        <tr key={elem._id}>
                          <td>{elem.full_name}</td>
                          <td>{elem.rebuydate}</td>
                          <td>
                            <AdvancedImage cldImg={cloudinaryImg(seven)} />
                            <AdvancedImage cldImg={cloudinaryImg(fifthteen)} />
                          </td>
                          {/* <td>
                            {
                              sended ? <BsSendCheck /> : <BsSendX />
                            }
                          </td> */}
                        </tr>
                      )
                    })
                  }
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        ) : (
          <div className="loading">
            <Spinner animation="border" size="lg" />
          </div >
        )
      }
    </>
  )
}