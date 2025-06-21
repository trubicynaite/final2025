import { useFormik } from "formik";
import bcrypt from "bcryptjs";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router";
import * as Yup from 'yup';
import styled from "styled-components";

import UsersContext from "../../contexts/UsersContext";
import { User, UserContextTypes } from "../../types";

const StyledReg = styled.section`
    
`;

const Register = () => {

    const [error, setError] = useState<string | null>(null);
    const { users, dispatch, setLoggedInUser } = useContext(UsersContext) as UserContextTypes;
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            firstName: '',
            lastName: '',
            dob: '',
            password: '',
            passwordRepeat: ''
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(5, 'Username must be at least 5 symbols length.')
                .max(20, 'Username must be shorter than 20 symbols.')
                .required('Field cannot be empty.')
                .trim(),
            email: Yup.string()
                .email('Must be a valid email.')
                .required('Field cannot be empty.')
                .trim(),
            firstName: Yup.string()
                .required('Field cannot be empty.')
                .trim(),
            lastName: Yup.string()
                .required('Field cannot be empty.')
                .trim(),
            dob: Yup.date()
                .min(new Date(1900), 'Date must be later than 1900.')
                .max(new Date(new Date().setFullYear(new Date().getFullYear() - 14)), 'You must be at least 14 years old.')
                .required(),
            password: Yup.string()
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,20}$/,
                    'Password must contain at least one: lower case character, upper case character, number, special symbol & must be between 7 and 20 symbols length.')
                .required('Field cannot be empty.')
                .trim(),
            passwordRepeat: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords do not match.')
                .required('Field cannot be empty.')
                .trim(),
        }),
        onSubmit: async (values) => {
            if (users.find(user =>
                user.email === values.email || user.username === values.username
            )) {
                setError('This user already exists.');
                return;
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { passwordRepeat, ...rest } = values;

                const newUser = {
                    ...rest,
                    passwordText: rest.password,
                    password: bcrypt.hashSync(rest.password, 10),
                    createDate: new Date().toISOString().split('T')[0]
                };
                try {
                    const response = await fetch('http://localhost:5500/users/register', {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(newUser)
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        setError(errorData.message || 'Registration failed.');
                        return;
                    }

                    const createdUser: User = await response.json();

                    setLoggedInUser(createdUser);
                    dispatch({
                        type: 'addUser',
                        newUser: createdUser
                    });

                    formik.resetForm();
                    navigate('/');
                } catch {
                    setError('Sorry, something went wrong.')
                }
            }
        }
    });

    return (
        <StyledReg>
            <h2>Register</h2>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label
                        htmlFor="username">Username:</label>
                    <input
                        type="text"
                        name="username" id="username"
                        placeholder="Create username."
                        value={formik.values.username}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                    />
                    {
                        formik.touched.username && formik.errors.username &&
                        <p>{formik.errors.username}</p>
                    }
                </div>
                <div>
                    <label
                        htmlFor="email">Email:</label>
                    <input
                        type="email"
                        name="email" id="email"
                        placeholder='Enter your email.'
                        value={formik.values.email}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                    />
                    {
                        formik.touched.email && formik.errors.email &&
                        <p>{formik.errors.email}</p>
                    }
                </div>
                <div>
                    <label
                        htmlFor="firstName">First name:</label>
                    <input
                        type="text"
                        name="firstName" id="firstName"
                        placeholder='Enter your first name.'
                        value={formik.values.firstName}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                    />
                    {
                        formik.touched.firstName && formik.errors.firstName &&
                        <p>{formik.errors.firstName}</p>
                    }
                </div>
                <div>
                    <label
                        htmlFor="lastName">Last name:</label>
                    <input
                        type="text"
                        name="lastName" id="lastName"
                        placeholder='Enter your last name.'
                        value={formik.values.lastName}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                    />
                    {
                        formik.touched.lastName && formik.errors.lastName &&
                        <p>{formik.errors.lastName}</p>
                    }
                </div>
                <div>
                    <label
                        htmlFor="dob">Date of birth:</label>
                    <input
                        type="date"
                        name="dob" id="dob"
                        value={formik.values.dob}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                    />
                    {
                        formik.touched.dob && formik.errors.dob &&
                        <p>{formik.errors.dob}</p>
                    }
                </div>
                <div>
                    <label
                        htmlFor="">Password:</label>
                    <input
                        type="password"
                        name="password" id="password"
                        placeholder='Create password'
                        value={formik.values.password}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                    />
                    {
                        formik.touched.password && formik.errors.password &&
                        <p>{formik.errors.password}</p>
                    }
                </div>
                <div>
                    <label
                        htmlFor="passwordRepeat">Password Repeat:</label>
                    <input
                        type="password"
                        name="passwordRepeat" id="passwordRepeat"
                        placeholder='Repeat password'
                        value={formik.values.passwordRepeat}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                    />
                    {
                        formik.touched.passwordRepeat && formik.errors.passwordRepeat &&
                        <p>{formik.errors.passwordRepeat}</p>
                    }
                </div>
                <input type="submit" value="Register" />
            </form>
            {
                error && <p>{error}</p>
            }
            <Link to="/login">Aleady have an account? Go login.</Link>
        </StyledReg>
    );
}

export default Register;