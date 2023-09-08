import { Formik } from "formik";
import { useEffect } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as yup from 'yup';
import { CREATE_SUBPRODUCT, GET_PRODUCTS_TYPES } from "../../redux/actions";
import { useState } from "react";
import '../../styles/components/product-form.scss';
import SubproductsTable from "./SubproductsTable";
import { useCallback } from "react";

export default function SubproductCreation({ showCreateSubproduct, setShowCreateSubproduct, productData }) {

  const dispatch = useDispatch();
  const { animal_size, product } = useSelector((state) => state.adminReducer);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [subproductData, setSubproductData] = useState({
    product: product._id,
    buy_price: 0,
    sell_price: 0,
    size: 0,
    stock: 0,
    animal: productData.animal,
    animal_age: productData.animal_age,
    brand: productData.brand,
    category: productData.category,
    animal_size: animal_size[0]
  })

  const validationSchema = yup.object().shape({
    animal_size: yup.string().required('Ingrese el tamaño del animal'),
    buy_price: yup.number().min(100, 'Ingrese un numero mayor').required('Ingrese el precio de compra'),
    sell_price: yup.number().min(100, 'Ingrese un numero mayor').required('Ingrese el precio de venta'),
    stock: yup.number().min(1, 'Ingrese un numero mayor').max(1000, 'Ingrese un numero menor').required('Ingrese el stock'),
    size: yup.number().min(0.5, 'Ingrese un numero mayor').required('Ingrese el tamaño')
  });

  const handleCreate = useCallback(() => {
    setIsLoadingButton(true);
    console.log(subproductData)
    dispatch(CREATE_SUBPRODUCT(subproductData)).then((res) => {
      if (res.payload) {
        setIsLoadingButton(false);
      }
    })

  }, [dispatch, subproductData])

  useEffect(() => {
    dispatch(GET_PRODUCTS_TYPES()).then((res) => {
      if (res.payload) setIsLoading(false)
    })
  }, [dispatch])

  return (
    <>
      {
        showCreateSubproduct && (
          <>
            {
              isLoading ? (
                <div className="loading-no-central">
                  <Spinner as="span" animation="border" size="xl" role="status" aria-hidden="true" />
                </div>
              ) : (
                <>
                  <Formik
                    validationSchema={validationSchema}
                    initialValues={{
                      buy_price: 0,
                      sell_price: 0,
                      size: 0,
                      stock: 0,
                      animal_size: ''
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
                    }) => (
                      <Form className="subproduct-form">
                        <Form.Group as={Row}>
                          <Form.Label className="product-label">Producto: {product.name}</Form.Label>
                        </Form.Group>
                        <Form.Group as={Row}>
                          <Form.Group as={Col} controlId="validationFormikPayment">
                            <Form.Label className="full-label">Tamaño animal: </Form.Label>
                            <Form.Group>
                              <Form.Select
                                className='select-form'
                                value={values.animal_size}
                                name="animal_size"
                                onChange={(e) => {
                                  setSubproductData((prevData) => ({ ...prevData, animal_size: e.target.value }));
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
                          <Form.Group as={Col}>
                            <Form.Label>Stock</Form.Label>
                            <Form.Group>
                              <Form.Control
                                className="input-form input-small"
                                type="number"
                                placeholder="Stock"
                                name="stock"
                                value={values.stock}
                                onChange={(e) => {
                                  setSubproductData((prevData) => ({ ...prevData, stock: e.target.value }));
                                  setFieldValue('stock', e.target.value);
                                  handleChange(e);
                                }}
                                onBlur={handleBlur}
                                isInvalid={touched.stock && !!errors.stock}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.stock}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Form.Group>
                        </Form.Group>
                        <Form.Group as={Row}>
                          <Form.Group as={Col}>
                            <Form.Label>Compra($)</Form.Label>
                            <Form.Group>
                              <Form.Control
                                className="input-form"
                                type="number"
                                placeholder="Compra"
                                name="buy_price"
                                value={values.buy_price}
                                onChange={(e) => {
                                  setSubproductData((prevData) => ({ ...prevData, buy_price: e.target.value }));
                                  setFieldValue('buy_price', e.target.value);
                                  handleChange(e);
                                }}
                                onBlur={handleBlur}
                                isInvalid={touched.buy_price && !!errors.buy_price}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.buy_price}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Form.Group>
                          <Form.Group as={Col}>
                            <Form.Label>Venta($)</Form.Label>
                            <Form.Group>
                              <Form.Control
                                className="input-form"
                                type="number"
                                placeholder="Venta"
                                name="sell_price"
                                value={values.sell_price}
                                onChange={(e) => {
                                  setSubproductData((prevData) => ({ ...prevData, sell_price: e.target.value }));
                                  setFieldValue('sell_price', e.target.value);
                                  handleChange(e);
                                }}
                                onBlur={handleBlur}
                                isInvalid={touched.sell_price && !!errors.sell_price}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.sell_price}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Form.Group>
                          <Form.Group as={Col}>
                            <Form.Label>Bolsa(kg)</Form.Label>
                            <Form.Group>
                              <Form.Control
                                className="input-form  input-small"
                                type="number"
                                placeholder="Bolsa"
                                name="size"
                                value={values.size}
                                onChange={(e) => {
                                  setSubproductData((prevData) => ({ ...prevData, size: e.target.value }));
                                  setFieldValue('size', e.target.value);
                                  handleChange(e);
                                }}
                                onBlur={handleBlur}
                                isInvalid={touched.size && !!errors.size}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.size}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Form.Group>
                        </Form.Group>
                        <div className="button-charge">
                          <Button
                            className='submit-button'
                            onClick={handleCreate}
                            disabled={!isValid || !dirty || isLoadingButton}
                            variant='success'
                          >
                            {isLoadingButton ? <Spinner animation="border" size="sm" /> : 'Cargar'}
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                  <SubproductsTable />
                </>
              )
            }
          </>
        )
      }
    </>
  )
}