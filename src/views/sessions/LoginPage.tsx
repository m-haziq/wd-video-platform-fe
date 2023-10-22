import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {

  const {login} = useAuth()
  const navigate = useNavigate()
  
  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().required('Email is required').email('Invalid email format'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values: any) => {    
    const { email, password } = values;
    await login(email,password)
    navigate("/")
    

  };


  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Login</h2>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                <Form>
                  <div className="mb-3 row">
                    <label htmlFor="email" className="col-md-3 col-form-label">
                      Email
                    </label>
                    <div className="col-md-7">
                      <Field type="text" className="form-control" id="email" name="email" />
                      <ErrorMessage name="email" component="div" className="text-danger" />
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <label htmlFor="password" className="col-md-3 col-form-label">
                      Password
                    </label>
                    <div className="col-md-7">
                      <Field type="password" className="form-control" id="password" name="password" />
                      <ErrorMessage name="password" component="div" className="text-danger" />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                      Login
                    </button>
                  </div>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default LoginPage;
