import { useCallback, useEffect, useState } from "react";
import { Card, Pagination, Spinner, Table, Badge } from "react-bootstrap";
import { BsCheck } from 'react-icons/bs';
import { RxCross2 } from 'react-icons/rx';
import { FiEdit, FiSave } from 'react-icons/fi';
import { useDispatch, useSelector } from "react-redux";
import { CHANGE_SUBPRODUCT_ACTIVE, CHANGE_SUBPRODUCT_HIGHLIGHT, GET_PAGINATED_PRODUCTS, UPDATE_SUBPRODUCT } from "../../redux/actions";
import '../../styles/components/products.scss';
import Swal from "sweetalert2";

export default function Products() {
  const dispatch = useDispatch();
  const { products, total_pages, total_movements } = useSelector((state) => state.adminReducer);

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentProducts, setCurrentProducts] = useState(products);

  const getProducts = useCallback(() => {
    setIsLoading(true);
    dispatch(GET_PAGINATED_PRODUCTS(currentPage)).then((res) => {
      if (res.payload) {
        setIsLoading(false);
      }
    });
  }, [dispatch, currentPage]);

  const handlePageClick = (pageNumber) => {
    if (pageNumber <= total_pages && pageNumber >= 1) {
      setCurrentPage(pageNumber);
    }
  };

  const handleActiveSubproduct = (subprod_id) => {
    setCurrentProducts((prevProducts) => {
      return prevProducts.map((product) => {
        const updatedSubproducts = product.subproducts.map((subproduct) => {
          if (subproduct._id === subprod_id) {
            return { ...subproduct, active: !subproduct.active };
          }
          return subproduct;
        });
        return { ...product, subproducts: updatedSubproducts };
      });
    });
    dispatch(CHANGE_SUBPRODUCT_ACTIVE(subprod_id));
  };

  const handleHighlightSubproduct = (subprod_id) => {
    setCurrentProducts((prevProducts) => {
      return prevProducts.map((product) => {
        const updatedSubproducts = product.subproducts.map((subproduct) => {
          if (subproduct._id === subprod_id) {
            return { ...subproduct, highlight: !subproduct.highlight };
          }
          return subproduct;
        });
        return { ...product, subproducts: updatedSubproducts };
      });
    });
    dispatch(CHANGE_SUBPRODUCT_HIGHLIGHT(subprod_id));
  };

  const handleEditSubproduct = (subprod_id) => {
    setCurrentProducts((prevProducts) => {
      return prevProducts.map((product) => {
        const updatedSubproducts = product.subproducts.map((subproduct) => {
          if (subproduct._id === subprod_id) {
            return { ...subproduct, editable: true };
          }
          return subproduct;
        });
        return { ...product, subproducts: updatedSubproducts };
      });
    });
  };

  const handleSaveSubproduct = (subprod_id) => {
    setCurrentProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) => {
        const updatedSubproducts = product.subproducts.map((subproduct) => {
          if (subproduct._id === subprod_id) {
            if (subproduct.editable) {
              const nameInput = document.getElementById(`name-input-${subproduct._id}`).value;
              const sizeInput = parseFloat(document.getElementById(`size-input-${subproduct._id}`).value);
              const buyPriceInput = parseFloat(document.getElementById(`buy-price-input-${subproduct._id}`).value);
              const sellPriceInput = parseFloat(document.getElementById(`sell-price-input-${subproduct._id}`).value);
              const stockInput = parseInt(document.getElementById(`stock-input-${subproduct._id}`).value);

              if (
                nameInput !== product.name ||
                sizeInput !== subproduct.size ||
                buyPriceInput !== subproduct.buy_price ||
                sellPriceInput !== subproduct.sell_price ||
                stockInput !== subproduct.stock
              ) {
                product.name = nameInput;
                subproduct.size = sizeInput;
                subproduct.buy_price = buyPriceInput;
                subproduct.sell_price = sellPriceInput;
                subproduct.stock = stockInput;
              }
            }
            return { ...subproduct, editable: false };
          }
          return subproduct;
        });
        return { ...product, subproducts: updatedSubproducts };
      });

      validateAndSaveChanges(updatedProducts, subprod_id);
      return updatedProducts;
    });
  };

  const validateAndSaveChanges = (updatedProducts, subprod_id) => {
    const modifiedProd = updatedProducts.find((elem) => elem.subproducts.find((sub) => sub._id === subprod_id));
    const actualProd = products.find((elem) => elem.subproducts.find((sub) => sub._id === subprod_id));
    delete modifiedProd.subproducts[0].editable;
    delete actualProd.subproducts[0].editable;

    if (JSON.stringify(modifiedProd) !== JSON.stringify(actualProd)) {
      updateSubproduct(subprod_id, modifiedProd);
    }
  };

  const updateSubproduct = useCallback((subprod_id, dataToUpdate) => {
    const updateData = { subprod_id, dataToUpdate };
    console.log(updateData);
    dispatch(UPDATE_SUBPRODUCT(updateData))
      .then((res) => {
        if (res.payload) {
          Swal.fire({
            title: 'Producto modificado con exito',
            icon: 'success'
          });
          return true;
        }
      });
  }, [dispatch]);

  useEffect(() => {
    setCurrentProducts(products);
  }, [products]);

  useEffect(() => {
    getProducts();
  }, [getProducts, currentPage]);

  return (
    <>
      <div className="title">
        <h1>Productos</h1>
      </div>
      <Card>
        <Card.Body>
          <Card.Title className="registry-title">
            Registro - Total: {isLoading ? 0 : total_movements}
          </Card.Title>
          {
            !isLoading ? (
              <>
                {
                  currentProducts?.length > 0 ? (
                    <>
                      <Table striped size="sm" bordered hover variant="dark">
                        <thead>
                          <tr>
                            <th>Id</th>
                            <th>Producto</th>
                            <th>Tamaño</th>
                            <th>Compra</th>
                            <th>Venta</th>
                            <th>Stock</th>
                            <th>Activo</th>
                            <th>Highlight</th>
                            <th>Editar</th>
                          </tr>
                        </thead>
                        <tbody className="table-products">
                          {
                            currentProducts?.flatMap((elem) =>
                              elem.subproducts.map((subproduct) => (
                                <tr key={subproduct._id}>
                                  <td>{elem._id}</td>
                                  <td>
                                    {
                                      subproduct.editable ?
                                        <input className="name-input" type="text" defaultValue={elem.name} id={`name-input-${subproduct._id}`} />
                                        : elem.name
                                    }
                                  </td>
                                  <td>
                                    {
                                      subproduct.editable ?
                                        <input type="number" defaultValue={subproduct.size} id={`size-input-${subproduct._id}`} />
                                        : subproduct.size
                                    }
                                  </td>
                                  <td>
                                    {
                                      subproduct.editable ?
                                        <input type="number" defaultValue={subproduct.buy_price} id={`buy-price-input-${subproduct._id}`} />
                                        : subproduct.buy_price
                                    }
                                  </td>
                                  <td>
                                    {
                                      subproduct.editable ?
                                        <input type="number" defaultValue={subproduct.sell_price} id={`sell-price-input-${subproduct._id}`} />
                                        : subproduct.sell_price
                                    }
                                  </td>
                                  <td>
                                    {
                                      subproduct.editable ?
                                        <input type="number" defaultValue={subproduct.stock} id={`stock-input-${subproduct._id}`} />
                                        : subproduct.stock
                                    }
                                  </td>
                                  <td>
                                    <Badge pill bg={subproduct.active ? 'success' : 'danger'}
                                      onClick={() => handleActiveSubproduct(subproduct._id)}>
                                      {subproduct.active ? <BsCheck /> : <RxCross2 />}
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge pill bg={subproduct.highlight ? 'success' : 'danger'}
                                      onClick={() => handleHighlightSubproduct(subproduct._id)}>
                                      {subproduct.highlight ? <BsCheck /> : <RxCross2 />}
                                    </Badge>
                                  </td>
                                  <td>
                                    {
                                      subproduct.editable ? <FiSave onClick={() => handleSaveSubproduct(subproduct._id)} />
                                        : <FiEdit onClick={() => handleEditSubproduct(subproduct._id)} />
                                    }
                                  </td>
                                </tr>
                              ))
                            )
                          }
                        </tbody>
                      </Table>
                      <Pagination className="mb-0">
                        <Pagination.First onClick={() => handlePageClick(1)} />
                        <Pagination.Prev onClick={() => handlePageClick(currentPage - 1)} />
                        {[...Array(total_pages)].map((_, i) => (
                          <Pagination.Item
                            key={i}
                            active={currentPage === i + 1}
                            onClick={() => handlePageClick(i + 1)}
                          >
                            {i + 1}
                          </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => handlePageClick(currentPage + 1)} />
                        <Pagination.Last onClick={() => handlePageClick(total_pages)} />
                      </Pagination>
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
      </Card>
    </>
  )
}
