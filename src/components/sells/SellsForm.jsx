import { Formik } from 'formik';
import { Form, Col, Row } from 'react-bootstrap';
import * as yup from 'yup';
import '../../styles/components/sell-forms.scss'
import { useCallback, useEffect, useRef, useState } from 'react';
import { MdSearch } from 'react-icons/md'
import { useDispatch } from 'react-redux';
import { SEARCH_USERS } from '../../redux/actions';
import { paymentsType } from '../../helpers/constants';

export default function SellsForm({ sellFullData, setSellFullData, setValidSellForm }) {

  const dispatch = useDispatch()

  const inputUser = useRef(null)
  const [userResults, setUserResults] = useState([]);

  const getCurrentDate = (date) => {
    const now = date ? new Date(date) : new Date();
    date && now.setDate(now.getDate() + 1)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const [sellData, setSellData] = useState({
    date: getCurrentDate(),
    user: '',
    address_id: '',
    payment_type: paymentsType.CASH
  })

  const validationSchema = yup.object().shape({
    date: yup.date(),
    user: yup.string().required('Ingresa un cliente'),
    movement_type: yup.string().required('Ingresa movimiento')
  });

  const handleKeyDownUser = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUserInput(e?.target?.value);
    }
    if (e.key === ' ') {
      e.stopPropagation();
    }
  };

  const handleSelectedClient = (setFieldValue, user_id, fullName) => {
    setFieldValue('user', user_id);

    const selectedUser = userResults.find((user) => user._id === user_id);
    const { _id, addresses } = selectedUser;
    const lastAddress = addresses[addresses.length - 1];

    setSellData((prevSellData) => ({
      ...prevSellData,
      user: _id,
      address_id: lastAddress
    }));

    setSellFullData({ ...sellFullData, ...sellData, user: _id, address_id: lastAddress });
    setUserResults([]);
    inputUser.current.value = fullName;
  }

  const handleUserInput = useCallback(async (value) => {
    await dispatch(SEARCH_USERS({ input_value: value })).then((res) => {
      if (res.payload) {
        setUserResults(res.payload);
      }
    });
  }, [dispatch])

  useEffect(() => {
    if (sellData.date.length > 0 && sellData.user.length > 0) setValidSellForm(true)
    if (Object.keys(sellFullData).length === 0) {
      setSellData({
        date: getCurrentDate(),
        user: '',
        address_id: '',
        payment_type: paymentsType.CASH
      })
      if (inputUser.current) {
        inputUser.current.value = '';
      }
    }
    // eslint-disable-next-line
  }, [sellFullData, setValidSellForm])

  return (
    <>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          date: getCurrentDate(),
          user: '',
          movement_type: paymentsType.CASH
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);

        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          setFieldValue,
          values,
          touched,
          isValid,
          errors
        }) => (
          <Form noValidate onSubmit={handleSubmit} className='sell-form'>
            <Form.Group as={Row} className='firstRow sell-row'>
              <Form.Group as={Col} controlId="validationFormikDate">
                <Form.Label>Fecha</Form.Label>
                <Form.Group className='input-form-group'>
                  <Form.Control
                    type="date"
                    placeholder="Date"
                    name="date"
                    value={values.date}
                    onChange={(e) => {
                      setSellData((prevData) => ({ ...prevData, date: getCurrentDate(e.target.value) }))
                      setFieldValue('date', getCurrentDate(e.target.value))
                      handleChange(e)
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.date && !!errors.date}
                  />
                </Form.Group>
                <Form.Control.Feedback type="invalid">
                  {errors.date}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="validationFormikUser">
                <Form.Label>Cliente</Form.Label>
                <Form.Group className='input-form-group'>
                  <Form.Control
                    type="text"
                    placeholder="Nombre cliente"
                    name="user"
                    ref={inputUser}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDownUser}
                    isInvalid={touched.user && !!errors.user}
                    autoComplete="off"
                  />
                  <MdSearch className='action-search-icon' size={25} onClick={() => handleUserInput(inputUser.current.value)} />
                </Form.Group>
                {userResults.length > 0 && (
                  <Form.Group as={Row} className='search-results-container users'>
                    <ul className="search-results">
                      {userResults.map((user) =>
                        <li key={user._id} onClick={() => handleSelectedClient(setFieldValue, user._id, user.full_name)}>
                          {user.full_name}
                        </li>
                      )}
                    </ul>
                  </Form.Group>
                )}
                <Form.Control.Feedback type="invalid">
                  {errors.user}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="validationFormikPayment">
                <Form.Label>Forma de Pago</Form.Label>
                <Form.Group className='input-form-group'>
                  <Form.Select
                    className='select-payment'
                    value={values.movement_type}
                    name='movement_type'
                    onChange={(e) => {
                      handleChange(e)
                      setFieldValue('movement_type', e.target.value)
                      setSellData((prevData) => ({ ...prevData, payment_type: e.target.value }))
                      setSellFullData((prevData) => ({ ...prevData, payment_type: e.target.value }))
                    }}
                  >
                    <option value={paymentsType.CASH}>CASH</option>
                    <option value={paymentsType.MP}>MP</option>
                    <option value={paymentsType.TRANSFERENCIA}>TRANSFERENCIA</option>
                  </Form.Select>
                </Form.Group>
                <Form.Control.Feedback type="invalid">
                  {errors.movement_type}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Group>
          </Form>
        )}
      </Formik>
    </>
  )
}

