import { Formik } from 'formik';
import { Form, Button, Row, Card } from 'react-bootstrap';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import '../../styles/components/buy-form.scss'
import ProductForm from '../sells/ProductsForm';
import * as yup from 'yup';
import { CREATE_MANUALLY_BUY } from '../../redux/actions';
import Swal from 'sweetalert2';
import Buys from './Buys';

export default function BuyForm() {

  const dispatch = useDispatch()

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const [buyFullData, setBuyFullData] = useState({
    date: getCurrentDate(),
    discount: false
  });
  const [validProductForm, setValidProductForm] = useState(false);
  const [finalizeForm, setFinalizeForm] = useState(false);

  const validationSchema = yup.object().shape({
    date: yup.date(),
    discount: yup.boolean()
  });

  const handleDiscountChange = (e, setFieldValue) => {
    const newValue = e.target.checked;
    setFieldValue('discount', newValue);
    setBuyFullData(prevData => ({
      ...prevData,
      discount: newValue
    }));
  };

  const handleSubmitBuy = useCallback(() => {
    dispatch(CREATE_MANUALLY_BUY(buyFullData))
      .then((res) => {
        if (res.payload?.success) {
          Swal.fire({
            title: 'Compra creada',
            icon: 'success'
          })
          setBuyFullData({
            date: getCurrentDate(),
            discount: false
          })
          setFinalizeForm(false)
        }
      })
  }, [buyFullData, dispatch])

  useEffect(() => {
    if (buyFullData.date.length !== 0 && validProductForm) setFinalizeForm(true)
  }, [buyFullData, validProductForm])

  return (
    <>
      <div className="title">
        <h1>Compras</h1>
      </div>
      <div className="content-container">
        <Card className='ms-3 mb-3'>
          <Card.Body as={Row}>
            <div className="col">
              <ProductForm sellFullData={buyFullData} setSellFullData={setBuyFullData} setValidProductForm={setValidProductForm} isSell={false} />
            </div>
            <div className="col-3">
              <Formik
                validationSchema={validationSchema}
                initialValues={{
                  date: getCurrentDate(),
                  discount: false
                }}
                onSubmit={(values, { resetForm }) => {
                  resetForm();
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
                  <Form noValidate onSubmit={handleSubmit} className='buy-form'>
                    <Form.Group as={Row}>
                      <Form.Label>Fecha</Form.Label>
                      <Form.Group className='input-form-group'>
                        <Form.Control
                          type="date"
                          placeholder="Date"
                          name="date"
                          value={values.date}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.date && !!errors.date}
                        />
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        {errors.date}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                      <Form.Check
                        type="checkbox"
                        label="Bonificacion"
                        name="discount"
                        checked={values.discount}
                        onChange={(e) => handleDiscountChange(e, setFieldValue)}
                      />
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Button variant='success' onClick={handleSubmitBuy} disabled={!finalizeForm}>Finalizar</Button>
                    </Form.Group>
                  </Form>
                )}
              </Formik>
            </div>
          </Card.Body>
        </Card>
        <Buys />
      </div>
    </>
  );
};