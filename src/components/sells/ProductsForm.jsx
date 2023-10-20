import { Formik } from 'formik';
import { Form, Col, Button, Row, Card } from 'react-bootstrap';
import * as yup from 'yup';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MdSearch } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { SEARCH_PRODUCTS } from '../../redux/actions';
import ProductsTable from './ProductsTable';
import '../../styles/components/sell-forms.scss'

export default function ProductForm({ sellFullData, setSellFullData, setValidProductForm, isSell }) {

  const dispatch = useDispatch()

  const inputProduct = useRef(null)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [productResults, setProductResults] = useState([]);
  const [totalProducts, setTotalProducts] = useState()

  const validationSchema = yup.object().shape({
    product: yup.string().required('Ingresa un producto'),
    quantity: yup.number().required('Ingresa cantidad')
      .min(1, 'El número mínimo es 1')
      .positive('El numero tiene que ser positivo')
      .integer('El numero tiene que ser un entero')
  });

  const handleProductInput = useCallback(async (value) => {
    await dispatch(SEARCH_PRODUCTS({ input_value: value })).then((res) => {
      if (res.payload) {
        setProductResults(res.payload);
      }
    });
  }, [dispatch])

  const handleSelectedProduct = (setFieldValue, subprod_id, name, size, price, buy_price) => {
    setFieldValue('product', name);
    setFieldValue('size', size);
    setFieldValue('price', price);
    setFieldValue('subprod_id', subprod_id);
    setFieldValue('buy_price', buy_price);
    inputProduct.current.value = `${name} ${size}kg`;
    setProductResults([])
  }

  const handleKeyDownProduct = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleProductInput(e?.target?.value);
    }
    if (e.key === ' ') {
      e.stopPropagation();
    }
  };

  const addProduct = ({ subprod_id, product, size, price, quantity, buy_price }) => {
    const newProduct = {
      name: product,
      subprod_id: subprod_id,
      quantity: quantity,
      sell_price: price,
      size: size,
      buy_price: buy_price,
      profit: (price - buy_price) * quantity
    };

    const existSubprod = selectedProducts.find((elem) => elem.subprod_id === newProduct.subprod_id)
    const updatedProducts = [...selectedProducts]
    if (existSubprod) {
      existSubprod.quantity += newProduct.quantity
      setSelectedProducts([...selectedProducts])
    } else {
      setSelectedProducts([...selectedProducts, newProduct]);
      updatedProducts.push(newProduct)
    }
    inputProduct.current.value = '';
    
    const total_products = updatedProducts.reduce((sum, product) => {
      const productPrice = product.quantity * (isSell ? product.sell_price : product.buy_price);
      return sum + productPrice;
    }, 0);

    setTotalProducts(total_products)
    setSellFullData({
      ...sellFullData,
      products: updatedProducts,
      total_sell: total_products
    });
  }

  useEffect(() => {
    if (totalProducts > 0) setValidProductForm(true)
    if (Object.keys(sellFullData).length === 0) {
      setSelectedProducts([])
      setTotalProducts()
    }
  }, [sellFullData, totalProducts, setValidProductForm])

  return (
    <Card className='ms-3'>
      <Card.Body>
        <Card.Title className='d-flex fs-4'>Productos</Card.Title>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            product: '',
            quantity: 1
          }}
          onSubmit={(values, { resetForm }) => {
            addProduct(values)
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
            <Form noValidate onSubmit={handleSubmit} className='product-form ms-4'>
              <Form.Group as={Row}>
                <Form.Group as={Col} className='col-5' controlId="validationFormikProduct">
                  <Form.Group className='input-form-group'>
                    <Form.Control
                      type="text"
                      placeholder="Producto"
                      name="product"
                      ref={inputProduct}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDownProduct}
                      isInvalid={touched.product && !!errors.product}
                      autoComplete="one-time-code"
                    />
                    <MdSearch className='action-search-icon' size={25} onClick={() => handleProductInput(inputProduct.current.value)} />
                  </Form.Group>
                  {productResults.length > 0 && (
                    <Form.Group as={Row} className='search-results-container products'>
                      <ul className="search-results">
                        {productResults.map((result) =>
                          result.subproducts.map((subproduct) => (
                            <li key={subproduct._id} onClick={() => handleSelectedProduct(setFieldValue, subproduct._id, result.name, subproduct.size, subproduct.sell_price, subproduct.buy_price)}>
                              {`${result.name} ${subproduct.size}kg`}
                            </li>
                          ))
                        )}
                      </ul>
                    </Form.Group>
                  )}
                  <Form.Control.Feedback type="invalid">
                    {errors.product}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormikQuantity" className='input-form-group gap-2 flex-row'>
                  <Form.Label className='m-0'>Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    className='input-quantity'
                    value={values.quantity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.quantity && !!errors.quantity}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.quantity}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} className='product-form-add'>
                  <Button type='submit' disabled={!isValid}>Agregar</Button>
                </Form.Group>
              </Form.Group>
            </Form>
          )}
        </Formik>
        {
          selectedProducts.length > 0 && <ProductsTable products={selectedProducts} totalProducts={totalProducts} isSell={isSell} />
        }
      </Card.Body>
    </Card>
  );
};