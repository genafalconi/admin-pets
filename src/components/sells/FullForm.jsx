import { useEffect, useState } from "react";
import ProductForm from "./ProductsForm";
import SellsForm from "./SellsForm";
import { Button, Card } from "react-bootstrap";
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

  const handleSubmitSell = () => {
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
      })
  }

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
      <div className="content-container">
        <Card className="mb-3">
          <Card.Body>
            <SellsForm
              sellFullData={sellFullData}
              setSellFullData={setSellFullData}
              setValidSellForm={setValidSellForm}
            />
            <div className="wrapform">
              <ProductForm
                sellFullData={sellFullData}
                setSellFullData={setSellFullData}
                setValidProductForm={setValidProductForm}
                isSell={true}
              />
              <div className="finalize-btn d-flex justify-content-end m-3">
                <Button className="btn-finalize w-100" variant="success" disabled={!finalizeForm} onClick={handleSubmitSell}>Finalizar</Button>
              </div>
            </div>
          </Card.Body>
        </Card>
        <Sells />
      </div>
    </>
  );
}