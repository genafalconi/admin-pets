import { Formik } from "formik";
import { useState, useEffect, useCallback } from "react";
import { Button, Col, Modal, Row, Spinner, Form } from "react-bootstrap";
import SubproductsTable from "./SubproductsTable";
import { useDispatch, useSelector } from "react-redux";
import * as yup from 'yup';
import { CREATE_SUBPRODUCT, GET_PRODUCTS_TO_ADD, GET_PRODUCTS_TYPES } from "../../redux/actions";
import { AiOutlineSearch } from 'react-icons/ai'
export default function SubprodOnlyCreation({ showOnlySubproduct, setShowOnlySubproduct }) {

  const dispatch = useDispatch();
  const { products_finded, animal_size, animals, animal_age, brands, categories } = useSelector((state) => state.adminReducer);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [productToSearch, setProductToSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [subproductData, setSubproductData] = useState({
    product: '',
    buy_price: 0,
    sell_price: 0,
    sale_price: 0,
    size: 0,
    stock: 0,
    animal: '',
    animal_age: '',
    brand: '',
    category: '',
    animal_size: ''
  })

  const validationSchema = yup.object().shape({
    animal_size: yup.string().required('Ingrese el tamaño del animal'),
    buy_price: yup.number().min(100, 'Ingrese un numero mayor').required('Ingrese el precio de compra'),
    sell_price: yup.number().min(100, 'Ingrese un numero mayor').required('Ingrese el precio de venta'),
    sale_price: yup.number().min(100, 'Ingrese un numero mayor').required('Ingrese el precio de oferta'),
    stock: yup.number().min(1, 'Ingrese un numero mayor').max(1000, 'Ingrese un numero menor').required('Ingrese el stock'),
    size: yup.number().min(0.5, 'Ingrese un numero mayor').required('Ingrese el tamaño'),
    product: yup.string().min(5, 'Ingrese un texto mas especifico').required('Ingrese el producto')
  });

  const handleCreate = useCallback(() => {
    setIsLoadingButton(true);
    dispatch(CREATE_SUBPRODUCT(subproductData)).then((res) => {
      if (res.payload) {
        setIsLoadingButton(false);
      }
    })
  }, [dispatch, subproductData])

  const handleProductSelect = (productSelected, setFieldValue) => {
    const updatedData = {
      product: productSelected._id,
      buy_price: 0,
      sell_price: 0,
      size: 0,
      stock: 0,
      sale_price: 0,
      animal: productSelected.animal,
      animal_age: productSelected.animal_age,
      brand: productSelected.brand,
      category: productSelected.category,
      animal_size: ''
    };

    setFieldValue('product', productSelected.name)
    setSubproductData(updatedData)
    Object.keys(updatedData).forEach((fieldName) => {
      if (fieldName !== 'product') {
        setFieldValue(fieldName, updatedData[fieldName]);
      }
    });
    setShowResults(false)
  }

  const handleFinish = () => {
    setSubproductData({
      product: '',
      buy_price: 0,
      sell_price: 0,
      size: 0,
      stock: 0,
      animal: '',
      animal_age: '',
      brand: '',
      category: '',
      animal_size: ''
    })
    setShowOnlySubproduct(false)
  }

  const handleSearchProduct = useCallback(() => {
    if (productToSearch.length >= 5) {
      setIsSearching(true);
      dispatch(GET_PRODUCTS_TO_ADD(productToSearch))
        .then((res) => {
          setShowResults(true);
          setIsSearching(false);
        })
    }
  }, [dispatch, productToSearch])

  useEffect(() => {
    dispatch(GET_PRODUCTS_TYPES()).then((res) => {
      if (res.payload) setIsLoading(false)
    })
  }, [dispatch])

  return (
    <Modal
      show={showOnlySubproduct}
      onHide={() => setShowOnlySubproduct(!showOnlySubproduct)}
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
            <>
              <Formik
                validationSchema={validationSchema}
                initialValues={{
                  product: '',
                  buy_price: 0,
                  sell_price: 0,
                  sale_price: 0,
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
                      <Form.Label>Busqueda por nombre: </Form.Label>
                      <Form.Group className="search-product">
                        <Form.Control
                          className="search-input-form"
                          type="text"
                          placeholder="Producto"
                          name="product"
                          value={values.product}
                          onChange={(e) => {
                            setProductToSearch(e.target.value);
                            setFieldValue('name', e.target.value);
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          isInvalid={touched.product && !!errors.product}
                          autoComplete="off"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              // Handle Enter key press here
                              handleSearchProduct();
                              e.preventDefault();
                            }
                          }}
                        />
                        {
                          isSearching ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            : <AiOutlineSearch className="search-icon" size={20} onClick={handleSearchProduct} />
                        }
                        <Form.Control.Feedback type="invalid">
                          {errors.product}
                        </Form.Control.Feedback>
                        {showResults && products_finded.length > 0 && (
                          <div className="search-results">
                            <p>Select a product:</p>
                            <ul>
                              {products_finded.map((result) => (
                                <li
                                  key={result._id}
                                  onClick={() => handleProductSelect(result, setFieldValue)}
                                >
                                  {result.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </Form.Group>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Group as={Col} controlId="validationFormikPayment">
                        <Form.Label>Categoria: </Form.Label>
                        <Form.Group>
                          <Form.Select
                            className='select-form'
                            value={values.category}
                            name="category"
                            onChange={(e) => {
                              setSubproductData((prevData) => ({ ...prevData, category: e.target.value }));
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
                              setSubproductData((prevData) => ({ ...prevData, animal: e.target.value }));
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
                              setSubproductData((prevData) => ({ ...prevData, animal_age: e.target.value }));
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
                              setSubproductData((prevData) => ({ ...prevData, brand: e.target.value }));
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
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Group as={Col} controlId="validationFormikPayment">
                        <Form.Label className="wrapped">Tamaño animal: </Form.Label>
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
                              setSubproductData((prevData) => ({ ...prevData, stock: parseInt(e.target.value) }));
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
                      <Form.Group as={Col}>
                        <Form.Label>Bolsa(kg)</Form.Label>
                        <Form.Group>
                          <Form.Control
                            className="input-form input-small"
                            type="number"
                            placeholder="Bolsa"
                            name="size"
                            value={values.size}
                            onChange={(e) => {
                              setSubproductData((prevData) => ({ ...prevData, size: parseFloat(e.target.value) }));
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
                              setSubproductData((prevData) => ({ ...prevData, buy_price: parseInt(e.target.value) }));
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
                              setSubproductData((prevData) => ({ ...prevData, sell_price: parseInt(e.target.value) }));
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
                        <Form.Label>Oferta($)</Form.Label>
                        <Form.Group>
                          <Form.Control
                            className="input-form input-small"
                            type="number"
                            placeholder="Bolsa"
                            name="sale_price"
                            value={values.sale_price}
                            onChange={(e) => {
                              setSubproductData((prevData) => ({ ...prevData, sale_price: parseFloat(e.target.value) }));
                              setFieldValue('sale_price', e.target.value);
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
                            isInvalid={touched.sale_price && !!errors.sale_price}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.sale_price}
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
              {

              }
              <SubproductsTable />
            </>
          )
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