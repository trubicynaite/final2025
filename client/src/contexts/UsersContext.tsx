import { createContext, useReducer, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { User, UserContextTypes, ChildrenElementProp, UsersReducerActionTypes } from "../types";

const reducer = (state: User[], action: UsersReducerActionTypes): User[] => {
    switch (action.type) {
        case 'setData':
            return action.data;
        case 'addUser':
            return [...state, action.newUser];
        case 'editUser':
            return state.map(user =>
                user._id === action.updatedUser._id
                    ? { ...user, ...action.updatedUser }
                    : user);
        default:
            return state;
    }
}

const UsersContext = createContext<UserContextTypes | undefined>(undefined);

const UserProvider = ({ children }: ChildrenElementProp) => {

    const [users, dispatch] = useReducer(reducer, []);
    const [loggedInUser, setLoggedInUser] = useState<Omit<User, 'password' | 'passwordText'> | null>(null);
    const navigate = useNavigate();

    const logOut = () => {
        setLoggedInUser(null);
        localStorage.removeItem('accessJWT');
        sessionStorage.removeItem('accessJWT');
        navigate('/');
    };

    type BackLoginResponse = { error: string } | { success: string, userData: User };

    const login = async (
        credentials: { username: string; password: string },
        keepLoggedIn: boolean) => {

        const res = await fetch(`http://localhost:5500/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        });

        const authHeader = res.headers.get('Authorization');
        if (authHeader !== null) {
            if (keepLoggedIn) {
                localStorage.setItem('accessJWT', authHeader);
            } else {
                sessionStorage.setItem('accessJWT', authHeader);
            }
        }

        const Back_Response = await res.json() as BackLoginResponse;

        if ('error' in Back_Response) {
            return { error: Back_Response.error };
        }

        if (!users.find(user => user._id === Back_Response.userData._id)) {
            dispatch({ type: 'addUser', newUser: Back_Response.userData });
        }

        return { success: Back_Response.success };
    };

    const editUser = async (
        { keyWord, newValue }:
            { keyWord: keyof Omit<User, '_id' | 'createDate' | 'username'>, newValue: string }) => {
        if (!loggedInUser) return;

        const updatedUser = { _id: loggedInUser._id, [keyWord]: newValue };

        dispatch({
            type: 'editUser',
            updatedUser
        });

        if (loggedInUser._id === updatedUser._id) {
            setLoggedInUser(prev => prev ? { ...prev, ...updatedUser } : null);
        }

        await fetch(`http://localhost:5500/users/${loggedInUser._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessJWT") || sessionStorage.getItem("accessJWT")}`
            },
            body: JSON.stringify(updatedUser)
        });
    };

    useEffect(() => {
        const accessJWT = localStorage.getItem('accessJWT') || sessionStorage.getItem('accessJWT');
        if (accessJWT) {
            fetch(`http://localhost:5500/users/loginAuto`, {
                headers: {
                    Authorization: `Bearer ${accessJWT}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if ('error' in data) {
                        localStorage.removeItem('accessJWT');
                        sessionStorage.removeItem('accessJWT');
                        navigate('/login');
                    } else {
                        setLoggedInUser(data.userData);
                    }
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <UsersContext.Provider
            value={{
                users,
                loggedInUser,
                logOut,
                login,
                editUser,
                dispatch,
                setLoggedInUser
            }}
        >
            {children}
        </UsersContext.Provider>
    )
}

export { UserProvider };
export default UsersContext;