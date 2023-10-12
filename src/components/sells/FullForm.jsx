import { useCallback, useEffect, useState } from "react";
import ProductForm from "./ProductsForm";
import SellsForm from "./SellsForm";
import { Button, Modal, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { CREATE_MANUALLY_SELL } from "../../redux/actions";
import Swal from "sweetalert2";
import '../../styles/components/sell-forms.scss'
import Sells from "./Sells";

export default function FullForm() {

  const dispatch = useDispatch();

  const [sellFullData, setSellFullData] = useState({});
  const [validProductForm, setValidProductForm] = useState(false);
  const [validSellForm, setValidSellForm] = useState(false);
  const [finalizeForm, setFinalizeForm] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const handleSubmitSell = useCallback(() => {
    setIsLoadingButton(true)
    dispatch(CREATE_MANUALLY_SELL(sellFullData))
      .then((res) => {
        if (res.payload?.success) {
          Swal.fire({
            title: 'Venta creada',
            icon: 'success'
          })
          setSellFullData({})
          setFinalizeForm(false)
        }
        setIsLoadingButton(false)
        setShowCreate(false)
      })
  }, [dispatch, sellFullData])

  useEffect(() => {
    if (validSellForm && validProductForm) {
      setFinalizeForm(true)
    }

  }, [sellFullData, validSellForm, validProductForm]);

  return (
    <>
      <div className="title">
        <h1>Ventas</h1>
      </div>
      <div className="create-sell">
        <Button onClick={() => setShowCreate(!showCreate)}>Cargar</Button>
      </div >
      <Modal
        show={showCreate}
        onHide={() => setShowCreate(!showCreate)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="modal-creation-sells"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Carga de ventas
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='modal-sells-body'>
          <SellsForm
            sellFullData={sellFullData}
            setSellFullData={setSellFullData}
            setValidSellForm={setValidSellForm}
            showCreate={showCreate}
            setShowCreate={setShowCreate}
          />
          <div className="wrapform">
            <ProductForm
              sellFullData={sellFullData}
              setSellFullData={setSellFullData}
              setValidProductForm={setValidProductForm}
              isSell={true}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className='modal-sell-footer'>
          <Button className="btn-finalize w-100" variant="success"
            disabled={!finalizeForm}
            onClick={handleSubmitSell}>
            {
              isLoadingButton ? <Spinner animation="border" size="sm" />
                : 'Finalizar'
            }
          </Button>
        </Modal.Footer>
      </Modal >
      <Sells />
    </>
  );
}