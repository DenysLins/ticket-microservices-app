import React from "react";
import Router from "next/router";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useRequest from "../../hooks/use-request";
import styles from "../../styles/SignIn.module.css";

const SignInSchema = Yup.object().shape({
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

function SignIn() {
  const { doRequest, errors } = useRequest();
  return (
    <div className="container">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={SignInSchema}
        onSubmit={async (values, { setSubmitting }) => {
          await doRequest(
            "/api/users/signin",
            "post",
            {
              email: values.email,
              password: values.password,
            },
            () => Router.push("/")
          );
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <h1 className="mt-3">Sign In</h1>
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
              <ErrorMessage
                className={styles.errors}
                name="email"
                component="div"
              />
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
              <ErrorMessage
                className={styles.errors}
                name="password"
                component="div"
              />
            </div>
            <button
              className="btn btn-primary mt-3"
              type="submit"
              disabled={isSubmitting}
            >
              SignIn
            </button>
            {errors}
          </Form>
        )}
      </Formik>
    </div>
  );
}

SignIn.propTypes = {};

export default SignIn;
