import { Formik } from 'formik';
import { Form, Button, Row, Card, Col } from 'react-bootstrap';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import '../../styles/components/user-form.scss'
import * as yup from 'yup';
import { CREATE_MANUALLY_CLIENT } from '../../redux/actions';
import Swal from 'sweetalert2';
import Users from './Users';

export default function UserForm() {

  const dispatch = useDispatch()

  const validationSchema = yup.object().shape({
    email: yup.string().email().required(),
    name: yup.string().required(),
    phone: yup.string(),
    street: yup.string().required(),
    number: yup.string().required(),
    flat: yup.string(),
    floor: yup.string(),
    city: yup.string().required(),
    province: yup.string().required(),
    extra: yup.string()
  });

  const handleSubmitClient = useCallback((values) => {
    const dataToSend = {
      email: values.email,
      name: values.name,
      phone: values.phone,
      address: {
        street: values.street,
        number: values.number,
        flat: values.flat,
        floor: values.floor,
        city: values.city,
        province: values.province,
        extra: values.extra
      }
    }
    dispatch(CREATE_MANUALLY_CLIENT(dataToSend))
      .then((res) => {
        if (res.payload?.success) {
          Swal.fire({
            title: 'Cliente creado',
            icon: 'success'
          })
        }
      })
  }, [dispatch])

  return (
    <>
      <div className="title">
        <h1>Clientes</h1>
      </div>
      <div className="content-container">
        <Card className='mb-3'>
          <Card.Body as={Row}>
            <Formik
              validationSchema={validationSchema}
              initialValues={{
                email: '',
                name: '',
                phone: '',
                street: '',
                number: '',
                flat: '',
                floor: '',
                city: '',
                province: '',
                extra: ''
              }}
              onSubmit={(values, { resetForm }) => {
                handleSubmitClient(values)
                resetForm();
              }}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                touched,
                isValid,
                errors
              }) => (
                <Form noValidate onSubmit={handleSubmit} className='buy-form'>
                  <Form.FloatingLabel className='fs-4'>Cliente</Form.FloatingLabel>
                  <Form.Group as={Row}>
                    <Form.Group as={Col}>
                      <Form.Label>Email</Form.Label>
                      <Form.Group className='input-form-group'>
                        <Form.Control
                          type="email"
                          placeholder="Email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.email && !!errors.email}
                        />
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Nombre y Apellido</Form.Label>
                      <Form.Group className='input-form-group'>
                        <Form.Control
                          type="text"
                          placeholder="Nombre y Apellido"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.name && !!errors.name}
                        />
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Telefono</Form.Label>
                      <Form.Group className='input-form-group'>
                        <Form.Control
                          type="text"
                          placeholder="Telefono"
                          name="phone"
                          value={values.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.phone && !!errors.phone}
                        />
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Group>
                  <Form.FloatingLabel className='fs-4'>Domicilio</Form.FloatingLabel>
                  <Form.Group as={Row}>
                    <Form.Group as={Col} lg={6} xl={4}>
                      <Form.Label>Calle</Form.Label>
                      <Form.Group className='input-form-group'>
                        <Form.Control
                          type="text"
                          placeholder="Calle"
                          name="street"
                          value={values.street}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.street && !!errors.street}
                        />
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        {errors.street}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Numero</Form.Label>
                      <Form.Group className='input-form-group'>
                        <Form.Control
                          type="text"
                          placeholder="Numero"
                          name="number"
                          value={values.number}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.number && !!errors.number}
                        />
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        {errors.number}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Piso</Form.Label>
                      <Form.Group className='input-form-group'>
                        <Form.Control
                          type="text"
                          placeholder="Piso"
                          name="floor"
                          value={values.floor}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.floor && !!errors.floor}
                        />
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        {errors.floor}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Depto</Form.Label>
                      <Form.Group className='input-form-group'>
                        <Form.Control
                          type="text"
                          placeholder="Depto"
                          name="flat"
                          value={values.flat}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.flat && !!errors.flat}
                        />
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        {errors.flat}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Group as={Col}>
                      <Form.Label>Ciudad</Form.Label>
                      <Form.Group className='input-form-group'>
                        <Form.Control
                          type="text"
                          placeholder="Ciudad"
                          name="city"
                          value={values.city}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.city && !!errors.city}
                        />
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        {errors.city}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Provincia</Form.Label>
                      <Form.Group className='input-form-group'>
                        <Form.Control
                          type="text"
                          placeholder="Provincia"
                          name="province"
                          value={values.province}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.province && !!errors.province}
                        />
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        {errors.province}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Extra</Form.Label>
                      <Form.Group className='input-form-group'>
                        <Form.Control
                          type="text"
                          placeholder="Extra"
                          name="extra"
                          value={values.extra}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.extra && !!errors.extra}
                        />
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        {errors.extra}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Group>
                  <Form.Group as={Row} className='btn-create-user'>
                    <Button variant='success' type='submit' disabled={!isValid}>Finalizar</Button>
                  </Form.Group>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
        <Users />
      </div>
    </>
  );
};