import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .max(64, "Email must be lower than 64 characters")
    .email("Email must be valid")
    .required("Required"),
  password: Yup.string()
    .min(6, "Password must be between 6 and 16 characters")
    .max(16, "Password must be between 6 and 16 characters")
    .matches(/(?=.*[0-9])/, "Password must contain a number.")
    .required("Required"),
});

function SignUp() {
  return (
    <div className="container">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={SignupSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const response = await axios.post("/api/users/signup", {
            email: values.email,
            password: values.password,
          });
          console.log(response.data);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <h1 className="mt-3">Sign Up</h1>
            <div className="form-group mt-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                className="form-control"
              />
              <ErrorMessage name="email" component="div" />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <Field
                type="password"
                name="password"
                id="password"
                className="form-control"
              />
              <ErrorMessage name="password" component="div" />
            </div>
            <button
              className="btn btn-primary mt-3"
              type="submit"
              disabled={isSubmitting}
            >
              SignUp
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

SignUp.propTypes = {};

export default SignUp;
