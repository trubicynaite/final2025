import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useFormik } from "formik";
import * as Yup from 'yup';
import styled from "styled-components";
import bcrypt from "bcryptjs";

import UsersContext from "../../contexts/UsersContext";
import { UserContextTypes } from "../../types";

const StyledLogin = styled.section`
    
`;

const Login = () => {

    const { users, setLoggedInUser } = useContext(UsersContext) as UserContextTypes;
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
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,20}$/,
                    'Password must contain at least one: lower case character, upper case character, number, special symbol AND must be between 7 and 20 symbols length.'
                )
                .required('Field cannot be empty')
                .trim('Empty spaces are ignored')
        }),
        onSubmit: (values) => {
            if (users) {
                const foundUser = users.find(user =>
                    user.username === values.username &&
                    bcrypt.compareSync(values.password, user.password)
                );
                if (foundUser) {
                    if (values.stayLoggedIn) {
                        localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
                    }
                    setLoggedInUser(foundUser);
                    navigate('/');
                } else {
                    setError('No such user, wrong username or password')
                }
            }
        }
    })
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
                                >Email: </label>
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
                            <div>
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