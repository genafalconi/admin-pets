import { useRef, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { expenseType } from '../../helpers/constants';
import { Button, Col, Row, Spinner, Form, Modal } from 'react-bootstrap';
import '../../styles/components/expense-form.scss';
import Expenses from './Expenses';
import { useDispatch } from 'react-redux';
import { CREATE_MANUALLY_EXPENSE } from '../../redux/actions';
import Swal from 'sweetalert2';

export default function ExpenseForm() {

  const getCurrentDate = (date) => {
    const now = date ? new Date(date) : new Date();
    date && now.setDate(now.getDate() + 1)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const dispatch = useDispatch()
  const inputDescription = useRef(null)
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [expenseData, setExpenseData] = useState({
    description: '',
    total: 0,
    date: getCurrentDate(),
    type: ''
  })

  const validationSchema = Yup.object().shape({
    description: Yup.string().required('Ingresa la descripcion'),
    total: Yup.number().min(1, 'Monto muy chico').typeError('Tiene que ser un numero').required('Ingresa el total'),
    date: Yup.date().required('Selecciona la fecha'),
    type: Yup.string().notOneOf([''], 'Selecciona el tipo').required('Selecciona el tipo')
  });

  const handleCreateExpense = () => {
    setIsLoadingButton(true)
    dispatch(CREATE_MANUALLY_EXPENSE(expenseData)).then((res) => {
      if (res.payload) {
        Swal.fire({
          title: 'Gasto creado',
          icon: 'success'
        })
        setIsLoadingButton(false)
      }
    })
  };

  return (
    <>
      <div className="title">
        <h1>Gastos</h1>
      </div>
      <div className="create-expense">
        <Button onClick={() => setShowCreate(!showCreate)}>Cargar</Button>
      </div>
      <Formik
        initialValues={{
          description: '',
          total: 0,
          date: getCurrentDate(),
          type: ''
        }}
        validationSchema={validationSchema}
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
          <Modal
            show={showCreate}
            onHide={() => setShowCreate(!showCreate)}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="modal-creation-expense"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Carga de compras
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className='modal-expense-body'>
              <Form noValidate className='expense-form'>
                <Form.Group as={Row}>
                  <Form.Group as={Col}>
                    <Form.Label>Fecha</Form.Label>
                    <Form.Group className='input-form-group'>
                      <Form.Control
                        type="date"
                        placeholder="Date"
                        name="date"
                        value={values.date}
                        onChange={(e) => {
                          setExpenseData((prevData) => ({ ...prevData, date: getCurrentDate(e.target.value) }))
                          setFieldValue('date', getCurrentDate(e.target.value))
                          handleChange(e)
                        }}
                        onBlur={handleBlur}
                        isInvalid={touched.date && !!errors.date}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.date}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Group>
                  <Form.Group as={Col} controlId="validationFormikPayment">
                    <Form.Label>Tipo de gasto</Form.Label>
                    <Form.Group>
                      <Form.Select
                        value={values.type}
                        name='type'
                        onChange={(e) => {
                          setExpenseData((prevData) => ({ ...prevData, type: e.target.value }))
                          setFieldValue('type', e.target.value)
                          handleChange(e)
                        }}
                        isInvalid={touched.type && !!errors.type}
                      >
                        <option value='' disabled>Selecciona</option>
                        <option value={expenseType.FUEL}>NAFTA</option>
                        <option value={expenseType.SALARY}>SUELDO</option>
                        <option value={expenseType.OTHER}>OTRO</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid" className="error-message">
                        {errors.type}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Group>
                  <Form.Group as={Col} controlId="validationFormikDescription">
                    <Form.Label>Total</Form.Label>
                    <Form.Group>
                      <Form.Control
                        type="number"
                        placeholder="Monto"
                        name="total"
                        ref={inputDescription}
                        onChange={(e) => {
                          setExpenseData((prevData) => ({ ...prevData, total: e.target.value }))
                          setFieldValue('total', e.target.value)
                          handleChange(e)
                        }}
                        onBlur={handleBlur}
                        isInvalid={touched.total && !!errors.total}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.total}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Group>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label>Descripcion</Form.Label>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Descripcion"
                      name="description"
                      ref={inputDescription}
                      onChange={(e) => {
                        setExpenseData((prevData) => ({ ...prevData, description: e.target.value }))
                        setFieldValue('description', e.target.value)
                        handleChange(e)
                      }}
                      onBlur={handleBlur}
                      isInvalid={touched.description && !!errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer className='modal-expense-footer'>
              <Button variant='success' disabled={!isValid} onClick={handleCreateExpense}>
                {
                  isLoadingButton ? <Spinner animation="border" size="sm" />
                    : 'Cargar gasto'
                }
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Formik>
      <Expenses />
    </>
  );
};