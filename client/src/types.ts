export type ChildrenElementProp = { children: React.ReactElement };
export type ChildrenNodeProp = { children: React.ReactNode };

export type User = {
    _id: string,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    dob: string,
    password: string,
    passwordText: string,
    createDate: string,
    createdQuestions: string[],
    answeredQuestions: string[],
    likedQuestions: string[],
    dislikedQuestions: string[]
};

export type UsersReducerActionTypes =
    { type: 'setData', data: User[] } |
    { type: 'addUser', newUser: User } |
    { type: 'editUser', updatedUser: Partial<User> & { _id: string } } |
    { type: 'logUserOut' };

export type UserContextTypes = {
    users: User[],
    loggedInUser: Omit<User, 'password' | "passwordText"> | null,
    logOut: () => void,
    login: ({ username, password }: Pick<User, "username" | "password">, keepLoggedIn: boolean) => Promise<{ error: string } | { success: string }>,
    editUser: ({ keyWord, newValue }: {
        keyWord: keyof Omit<User, "_id" | "username" | "dob" | "createDate" | "createdQuestions" | "answeredQuestions" | "likedQuestions" | "dislikedQuestions">;
        newValue: string;
    }) => void,
    dispatch: React.Dispatch<UsersReducerActionTypes>,
    setLoggedInUser: React.Dispatch<React.SetStateAction<User | null>>
};

export type RegisterFormValues = {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    dob: string;
    password: string;
    passwordRepeat: string;
};

export type Question = {
    _id: string,
    creatorId: User['_id'],
    createDate: string,
    category: string,
    questionHeader: string,
    questionText: string,
    likeCount: number,
    dislikeCount: number,
    answerCount: number
};

export type Answer = {
    _id: string,
    creatorId: User['_id'],
    questionId: Question['_id'],
    answerText: string,
    createDate: string
};