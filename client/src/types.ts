export type ChildrenElementProp = { children: React.ReactElement };
export type ChildrenNodeProp = { children: React.ReactNode };

export type UserFull = {
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

export type User = Omit<UserFull, 'password' | 'passwordText'>

export type UsersReducerActionTypes =
    { type: 'setData', data: User[] } |
    { type: 'addUser', newUser: User } |
    { type: 'editUser', updatedUser: Partial<User> & { _id: string } } |
    { type: 'logUserOut' };

export type UserContextTypes = {
    users: User[],
    loggedInUser: User | null,
    logOut: () => void,
    login: (credentials: { username: string; password: string }, keepLoggedIn: boolean) => Promise<{ error: string } | { success: string }>,
    editUser: ({ keyWord, newValue }: {
        keyWord: keyof Omit<User, "_id" | "username" | "dob" | "createDate" | "createdQuestions" | "answeredQuestions" | "likedQuestions" | "dislikedQuestions">;
        newValue: string;
    }) => void,
    dispatch: React.Dispatch<UsersReducerActionTypes>,
    setLoggedInUser: React.Dispatch<React.SetStateAction<Omit<User, 'password' | 'passwordText'> | null>>
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
    creatorUsername: string,
    createDate: string,
    category: string,
    questionHeader: string,
    questionText: string,
    likeCount: number,
    dislikeCount: number,
    answerCount: number,
    lastEdited: string
};

export type QuestionsReducerActionTypes =
    { type: 'setData', data: Question[] } |
    { type: 'addQuestion', newQuestion: Question } |
    { type: 'editQuestion', updatedQuestion: Partial<Question> & { _id: string } } |
    { type: 'deleteQuestion', _id: string };

export type QuestionsContextTypes = {
    questions: Question[];
    dispatch: React.Dispatch<QuestionsReducerActionTypes>;
    addQuestion: (newQuestion: Question) => void;
    editQuestion: (updatedQuestion: Partial<Question> & { _id: string }) => void;
    deleteQuestion: (_id: string) => void;
    fetchData: () => void;
    fetchFiltered: (filters?: {
        answered?: 'true' | 'false',
        sortBy?: 'createDate' | 'answerCount',
        order?: 'asc' | 'desc',
        category?: string,
        title?: string
    }) => Promise<Question[] | undefined>;
};

export type Answer = {
    _id: string,
    creatorId: string,
    questionId: string,
    answerText: string,
    createDate: string,
    creatorUsername: string,
    lastEdited: string
};

export type ConfirmModal = {
    isOpen: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};
