import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import UsersContext from "../../contexts/UsersContext";
import { UserContextTypes } from "../../types";

const StyledSection = styled.section`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  color: white;
  border-radius: 6px;

  >h2 {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  input, button {
    width: 100%;
    padding: 8px 12px;
    margin-bottom: 15px;
    border-radius: 6px;
    border: none;
    font-size: 1rem;
  }

  input {
    background: transparent;
    color: #eb88ca;
    border: 1px solid #eb88ca;
  }

  input:disabled {
  background: #6e0561;
  color: white;
  border: none;
  cursor: default;}
  

  button {
    background: transparent;
    color: #eb88ca;
    border: 1px solid #EB88CA;
    cursor: pointer;

    &:hover {
        color: white;
        border: 1px solid white;  
      }
  }

  .nonEditable {
    background: #6e0561;
    padding: 8px 12px;
    border-radius: 6px;
    margin-bottom: 15px;
  }
`;

const User = () => {
    const { loggedInUser, setLoggedInUser } = useContext(UsersContext) as UserContextTypes;

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        dob: "",
        createDate: "",
        username: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (loggedInUser) {
            setFormData({
                email: loggedInUser.email || "",
                firstName: loggedInUser.firstName || "",
                lastName: loggedInUser.lastName || "",
                dob: "",
                createDate: "",
                username: "",
                password: ""
            });
        }
    }, [loggedInUser]);

    if (!loggedInUser) {
        return (
            <StyledSection>
                <h2>Please log in to view your profile.</h2>
            </StyledSection>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const body = {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                ...(formData.password.trim() !== "" && {
                    password: formData.password,
                    passwordText: formData.password
                })
            };

            const res = await fetch(`http://localhost:5500/users/me`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessJWT")}`
                },
                body: JSON.stringify(body),
            });

            const updatedUser = await res.json();
            setLoggedInUser(updatedUser);
            setFormData(prev => ({ ...prev, password: "" }));
            setIsEditing(false);
            setMessage("Profile updated successfully!");
        } catch (error) {
            setMessage(`Error: ${(error as Error).message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledSection>
            <h2>User Profile</h2>

            <div className="nonEditable">
                <label>Username:</label>
                <div>{loggedInUser.username}</div>
            </div>

            <div className="nonEditable">
                <label>Date of Birth:</label>
                <div>{loggedInUser.dob}</div>
            </div>

            <div className="nonEditable">
                <label>Account create date:</label>
                <div>{loggedInUser.createDate}</div>
            </div>

            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                />

                <label htmlFor="firstName">First Name:</label>
                <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                />

                <label htmlFor="lastName">Last Name:</label>
                <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                />

                <label htmlFor="password">New Password:</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={!isEditing}
                    autoComplete="new-password"
                />

                {isEditing ? (
                    <>
                        <button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setFormData({
                                    email: loggedInUser.email || "",
                                    firstName: loggedInUser.firstName || "",
                                    lastName: loggedInUser.lastName || "",
                                    dob: loggedInUser.dob || "",
                                    createDate: loggedInUser.createDate || "",
                                    username: loggedInUser.username || "",
                                    password: ""
                                });
                                setIsEditing(false);
                                setMessage("");
                            }}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button type="button" onClick={() => setIsEditing(true)}>
                        Edit
                    </button>
                )}
            </form>

            {message && <p>{message}</p>}
        </StyledSection>
    );
}

export default User;