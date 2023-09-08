import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { GET_SUBPRODUCT_DETAILS } from "../../redux/actions";
import { Spinner, Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { AdvancedImage } from "@cloudinary/react";
import { cloudinaryImg } from "../../helpers/cloudinary";

export default function ProductDetail() {
  const { subprod_id } = useParams();
  const { subproduct } = useSelector((state) => state.adminReducer);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(GET_SUBPRODUCT_DETAILS(subprod_id)).then((res) => {
      if (res.payload) {
        setIsLoading(false);
      }
    });
  }, [dispatch, subprod_id]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    // Add validation rules for other fields
  });

  return (
    <div className="product-detail">
      {isLoading ? (
        <div className="loading">
          <Spinner animation="border" size="lg" />
        </div>
      ) : (
        <div className="product-content">
          <div className="title">
            <h1>Detalles del producto</h1>
          </div>
          <Formik
            initialValues={subproduct}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              // Dispatch an action to update the subproduct data
              // You can implement this based on your Redux setup
              // After updating, you can use setSubmitting(false);
            }}
          >
            {({ values, handleChange, handleSubmit, isSubmitting, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                <AdvancedImage className='details-image' cldImg={cloudinaryImg(values.product.image)}/>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={touched.name && !!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    isInvalid={touched.description && !!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
                {/* Add more Form.Group elements for other fields */}
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  Save Changes
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
}
