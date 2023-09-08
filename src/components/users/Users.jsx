import { useCallback, useEffect, useState } from "react";
import { Card, Spinner, Table } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux";
import { GET_PAGINATED_USERS, UPDATE_USER_NEXT_BUY } from "../../redux/actions";
import CustomPagination from "../atomic/CustomPagination";
import { FiEdit, FiSave } from 'react-icons/fi';
import { MdOutlineCancel } from "react-icons/md";
import { useRef } from "react";
import '../../styles/components/user-form.scss'

export default function Users() {

  const dispatch = useDispatch();
  const { users, total_pages, total_movements } = useSelector((state) => state.adminReducer);
  const inputRef = useRef('');

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [notValidInput, setNotValidInput] = useState(false);

  const toggleEditUser = (user) => {
    setEditingUser(user === editingUser ? null : user);
  };

  const validateInput = () => {
    const value = parseInt(inputRef.current.value)
    if (value > 70 || value < 1) {
      setNotValidInput(true);
    } else {
      setNotValidInput(false);
    }
  }

  const handleSaveChange = useCallback((user) => {
    const nextBuyData = {
      user: user._id,
      next_buy: parseInt(inputRef.current.value)
    }
    dispatch(UPDATE_USER_NEXT_BUY(nextBuyData))
  }, [dispatch])

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
                          <th>Prox Pedido</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          users?.map((elem, index) => {
                            const isEditing = editingUser === elem;
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
                                {
                                  isEditing ? (
                                    <td className={notValidInput ? 'invalid-td' : ''}>
                                      <input type="text" className={`input-next-buy ${notValidInput ? 'invalid-input' : ''}`} ref={inputRef} onChange={validateInput} />
                                      <MdOutlineCancel onClick={() => toggleEditUser(elem)} />
                                      {notValidInput && <span className="invalid-text">Invalido</span>}
                                    </td>
                                  ) : (
                                    <td>{elem.next_buy ? formatDate(elem.next_buy) : '-'}</td>
                                  )
                                }
                                <td>
                                  {isEditing ? <FiSave onClick={() => handleSaveChange(elem)} />
                                    : <FiEdit onClick={() => toggleEditUser(elem)} />}
                                </td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </Table>
                    <CustomPagination currentPage={currentPage} totalPages={total_pages} handlePageClick={handlePageClick} />
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
    </Card >
  )
}