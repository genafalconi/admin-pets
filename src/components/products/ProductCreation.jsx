import { Formik } from "formik";
import { useEffect } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as yup from 'yup';
import { CREATE_PRODUCT, GET_PRODUCTS_TYPES } from "../../redux/actions";
import { useState } from "react";
import '../../styles/components/product-form.scss';
import SubproductCreation from "./SubprodCreation";
import { useCallback } from "react";

export default function ProductCreation({ showCreate, setShowCreate }) {

  const dispatch = useDispatch();
  const { animals, animal_age, brands, categories, animal_size } = useSelector((state) => state.adminReducer);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [showCreateSubproduct, setShowCreateSubproduct] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    image: '',
    description: '',
    animal: '',
    animal_age: '',
    brand: '',
    category: '',
    animal_size: ''
  })

  const validationSchema = yup.object().shape({
    name: yup.string().min(5, 'Debe ser mas largo').max(80, 'Muy largo').required('Ingrese el nombre'),
    category: yup.string().required('Ingrese la categoria'),
    animal: yup.string().required('Ingrese el animal'),
    brand: yup.string().required('Ingrese la marca'),
    animal_age: yup.string().required('Ingrese la edad'),
    animal_size: yup.string().required('Ingrese el tamaño del animal'),
    // description: yup.string().min(5, 'Debe ser mas largo').max(400, 'Muy largo'),
    // image: yup.string().min(5, 'Debe ser mas largo').max(200, 'Muy largo').required('Ingrese la imagen')
  });

  const handleCreate = useCallback(() => {
    setIsLoadingButton(true)
    dispatch(CREATE_PRODUCT(productData)).then((res) => {
      if (res.payload) {
        setIsLoadingButton(false);
        setShowCreateSubproduct(true);
      }
    })
  }, [productData, dispatch])

  const handleFinish = () => {
    setProductData({
      name: '',
      image: '',
      description: '',
      animal: '',
      animal_age: '',
      brand: '',
      category: ''
    })
    setShowCreate(false)
  }

  useEffect(() => {
    dispatch(GET_PRODUCTS_TYPES()).then((res) => {
      if (res.payload) setIsLoading(false)
    })
  }, [dispatch])

  return (
    <Modal
      show={showCreate}
      onHide={() => setShowCreate(!showCreate)}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal-creation-product"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Carga de productos
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-product-body'>
        {
          isLoading ? (
            <div className="loading-no-central">
              <Spinner as="span" animation="border" size="xl" role="status" aria-hidden="true" />
            </div>
          ) : (
            <Formik
              validationSchema={validationSchema}
              initialValues={{
                name: '',
                category: '',
                animal: '',
                brand: '',
                animal_age: '',
                animal_size: '',
                description: '',
                image: ''
              }}
              onSubmit={(values, { resetForm }) => {
                resetForm();
              }}
            >
              {({
                handleChange,
                handleBlur,
                setFieldValue,
                values,
                touched,
                isValid,
                errors,
                dirty
              }) => {
                return (
                  <Form className="product-form">
                    <Form.Group as={Row}>
                      <Form.Group as={Col} controlId="validationFormikPayment">
                        <Form.Label>Categoria: </Form.Label>
                        <Form.Group>
                          <Form.Select
                            className='select-form'
                            value={values.category}
                            name="category"
                            onChange={(e) => {
                              setProductData((prevData) => ({ ...prevData, category: e.target.value }));
                              setFieldValue('category', e.target.value);
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
                            isInvalid={touched.category && !!errors.category}
                          >
                            <option key={'default'} value='' disabled>Categoria</option>
                            {
                              categories.map((elem) => {
                                return (
                                  <option key={elem} value={elem}>{elem}</option>
                                )
                              })
                            }
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.category}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Group>
                      <Form.Group as={Col} controlId="validationFormikPayment">
                        <Form.Label>Animal: </Form.Label>
                        <Form.Group>
                          <Form.Select
                            className='select-form'
                            value={values.animal}
                            name="animal"
                            onChange={(e) => {
                              setProductData((prevData) => ({ ...prevData, animal: e.target.value }));
                              setFieldValue('animal', e.target.value);
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
                            isInvalid={touched.animal && !!errors.animal}
                          >
                            <option key={'default'} value='' disabled>Animal</option>
                            {
                              animals.map((elem) => {
                                return (
                                  <option key={elem} value={elem}>{elem}</option>
                                )
                              })
                            }
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.animal}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Group>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Group as={Col} controlId="validationFormikPayment">
                        <Form.Label>Edad: </Form.Label>
                        <Form.Group>
                          <Form.Select
                            className='select-form'
                            value={values.animal_age}
                            name="animal_age"
                            onChange={(e) => {
                              setProductData((prevData) => ({ ...prevData, animal_age: e.target.value }));
                              setFieldValue('animal_age', e.target.value);
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
                            isInvalid={touched.animal_age && !!errors.animal_age}
                          >
                            <option key={'default'} value='' disabled>Edad</option>
                            {
                              animal_age.map((elem) => {
                                return (
                                  <option key={elem} value={elem}>{elem}</option>
                                )
                              })
                            }
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.animal_age}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Group>
                      <Form.Group as={Col} controlId="validationFormikPayment">
                        <Form.Label>Marca: </Form.Label>
                        <Form.Group>
                          <Form.Select
                            className='select-form'
                            value={values.brand}
                            name="brand"
                            onChange={(e) => {
                              setProductData((prevData) => ({ ...prevData, brand: e.target.value }));
                              setFieldValue('brand', e.target.value);
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
                            isInvalid={touched.brand && !!errors.brand}
                          >
                            <option key={'default'} value='' disabled>Marca</option>
                            {
                              brands.map((elem) => {
                                return (
                                  <option key={elem} value={elem}>{elem}</option>
                                )
                              })
                            }
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.brand}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Group>
                      <Form.Group as={Col} controlId="validationFormikPayment">
                        <Form.Label className="full-label">Tamaño animal: </Form.Label>
                        <Form.Group>
                          <Form.Select
                            className='select-form'
                            value={values.animal_size}
                            name="animal_size"
                            onChange={(e) => {
                              setProductData((prevData) => ({ ...prevData, animal_size: e.target.value }));
                              setFieldValue('animal_size', e.target.value);
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
                            isInvalid={touched.animal_size && !!errors.animal_size}
                          >
                            <option key={'default'} value='' disabled>Tamaño</option>
                            {
                              animal_size.map((elem) => {
                                return (
                                  <option key={elem} value={elem}>{elem}</option>
                                )
                              })
                            }
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.animal_size}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Group>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label>Nombre (Sin el peso)</Form.Label>
                      <Form.Group>
                        <Form.Control
                          className="input-form"
                          type="text"
                          placeholder="Nombre"
                          name="name"
                          value={values.name}
                          onChange={(e) => {
                            setProductData((prevData) => ({ ...prevData, name: e.target.value }));
                            setFieldValue('name', e.target.value);
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          isInvalid={touched.name && !!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label>Imagen (Solo el final del link y sin el tipo de imagen al final)</Form.Label>
                      <Form.Group>
                        <Form.Control
                          className="input-form"
                          type="text"
                          placeholder="Imagen"
                          name="image"
                          value={values.image}
                          onChange={(e) => {
                            setProductData((prevData) => ({ ...prevData, image: e.target.value }));
                            setFieldValue('image', e.target.value);
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          isInvalid={touched.image && !!errors.image}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.image}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label>Descripcion</Form.Label>
                      <Form.Group>
                        <Form.Control
                          className="input-form"
                          type="text"
                          placeholder="Descripcion"
                          name="description"
                          value={values.description}
                          onChange={(e) => {
                            setProductData((prevData) => ({ ...prevData, description: e.target.value }));
                            setFieldValue('description', e.target.value);
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          isInvalid={touched.description && !!errors.description}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.description}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Form.Group>
                    <div className="button-charge">
                      {
                        isLoadingButton ? (
                          <Button className='submit-button' disabled variant='success'>
                            <Spinner animation="border" size="sm" />
                          </Button>
                        ) : (
                          <Button
                            className='submit-button'
                            onClick={handleCreate}
                            disabled={!isValid || !dirty || isLoadingButton}
                            variant='success'
                          >
                            Cargar
                          </Button>
                        )
                      }
                    </div>
                  </Form>
                )
              }
              }
            </Formik>
          )
        }
        {
          showCreateSubproduct &&
          <SubproductCreation
            showCreateSubproduct={showCreateSubproduct}
            setShowCreateSubproduct={setShowCreateSubproduct}
            productData={productData}
          />
        }
      </Modal.Body>
      <Modal.Footer className='modal-product-footer'>
        <Button
          className='finish-button'
          onClick={handleFinish}
          variant='primary'
        >
          Finalizar
        </Button>
      </Modal.Footer>
    </Modal >
  )
}