import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useFormik } from "formik";
import * as Yup from 'yup';
import styled from "styled-components";

import UsersContext from "../../contexts/UsersContext";
import { UserContextTypes } from "../../types";

const StyledLogin = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  > h2 {
    text-align: center;
    color: white;
    margin-bottom: 20px;
  }

  > form {
    display: grid;
    gap: 10px;
    width: 100%;
    max-width: 320px;
    color: white;

    > div {
      display: flex;
      flex-direction: column;

      > label {
        margin-bottom: 5px;
        color: #f3aadb;
        cursor: pointer;
      }

      > input[type="text"],
      input[type="password"] {
        color: white;
        padding: 8px 10px;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        background-color: transparent;
        border: 1.5px solid #EB88CA;
        transition: border-color 0.3s ease;

        &::placeholder {
          color: #f3aadb99;
        }

        &:focus {
          border-color: #f3aadb;
          outline: none;
          color: #f3aadb;
        }
      }

      > p {
        margin-top: 5px;
        font-size: 15px;
        color: #f3aadb;
      }
    }

    > div.checkbox {
        display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;

      > input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
        margin: 0;
      }

      > label.loggedIn {
        color: #f3aadb;
        font-size: 14px;
        cursor: pointer;
        user-select: none;
        margin: 0;
      }
    }

    input[type="submit"] {
      background-color: #f3aadb;
      color: #87085D;
      padding: 10px 0;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 18px;
      transition: background-color 0.3s ease, color 0.3s ease;

      &:hover {
        background-color: #EB88CA;
        color: white;
      }
    }
  }

  > p {
    margin-top: 15px;
    color: #f3aadb;
    font-size: 16px;
    text-align: center;
  }

  > a {
    margin-top: 15px;
    color: #f3aadb;
    font-size: 15px;
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: white;
    }
  }

  @media (min-width: 575px) {
    padding: 40px;

    > h2 {
      font-size: 28px;
    }

    > form {
      max-width: 400px;

      input[type="text"],
      input[type="password"] {
        font-size: 17px;
      }

      input[type="submit"] {
        font-size: 20px;
      }

      > label.loggedIn {
        font-size: 15px;
      }
    }
  }
`;

const Login = () => {

  const { setLoggedInUser } = useContext(UsersContext) as UserContextTypes;
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 50);
    return () => clearTimeout(timer);
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      stayLoggedIn: false
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required('Field cannot be empty.')
        .trim(),
      password: Yup.string()
        .required('Field cannot be empty.')
        .trim()
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch("http://localhost:5500/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: values.username,
            password: values.password
          })
        });
        const data = await response.json();

        if (!response.ok) {
          setError("Login failed.");
          return;
        }

        const token = response.headers.get("Authorization");

        if (!token) {
          setError("Missing authorization token.");
          return;
        }

        if (values.stayLoggedIn) {
          localStorage.setItem("loggedInUser", JSON.stringify(data.userData));
          localStorage.setItem("accessJWT", token);
        }

        setLoggedInUser(data.userData);
        navigate("/");
      } catch {
        setError("Something went wrong, please try again later.")
      }
    }
  });

  return (
    <StyledLogin>
      <h2>Login</h2>
      {
        loading ?
          <p>Please wait, the page is loading.</p> :
          <>
            <form onSubmit={formik.handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                >Username: </label>
                <input
                  type="text"
                  name='username' id='username'
                  placeholder='Enter your username'
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {
                  formik.errors.username && formik.touched.username &&
                  <p>{formik.errors.username}</p>
                }
              </div>
              <div>
                <label
                  htmlFor="password"
                >Password: </label>
                <input
                  type="password"
                  name='password' id='password'
                  placeholder='Enter your password'
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {
                  formik.errors.password && formik.touched.password &&
                  <p>{formik.errors.password}</p>
                }
              </div>
              <div className="checkbox">
                <input
                  type="checkbox"
                  name="stayLoggedIn" id="stayLoggedIn"
                  checked={formik.values.stayLoggedIn}
                  onChange={formik.handleChange}
                />
                <label htmlFor="stayLoggedIn" className='loggedIn'>Stay Logged In</label>
              </div>
              <input type="submit" value="Log In" />
            </form>
            {
              error && <p>{error}</p>
            }
            <Link to="/register">Don't have an account yet? Go create one.</Link>
          </>
      }
    </StyledLogin>
  );
}

export default Login;