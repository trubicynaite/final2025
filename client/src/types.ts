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
    createDate: string,
    createdQuestions: Question[],
    answeredQuestions: Question[],
    likedQuestions: Question[],
    dislikedQuestions: Question[]
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
}