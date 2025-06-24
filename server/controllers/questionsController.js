import { ObjectId } from "mongodb";
import { connectDB } from "./helper.js"

export const getQuestions = async (req, res) => {
    const client = await connectDB();
    try {
        const db = client.db('final').collection('questions');

        const {
            sortBy = 'createDate',
            order = 'desc',
            answered,
            title,
            category
        } = req.query;

        const filter = {};

        if (answered === 'true') {
            filter.answerCount = { $gt: 0 }
        } else if (answered === 'false') {
            filter.answerCount = 0;
        }

        if (title) {
            filter.questionHeader = { $regex: title, $options: 'i' };
        }

        if (category) {
            filter.category = category;
        }

        const sortOptions = {};
        const allowedSort = ['createDate', 'answerCount'];
        if (allowedSort.includes(sortBy)) {
            sortOptions[sortBy] = order === 'asc' ? 1 : -1;
        }

        const questions = await db.find(filter).sort(sortOptions).toArray();
        res.send(questions);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err, message: `Something went wrong, please try again later.` });
    } finally {
        await client.close();
    }
};

export const getQuestionById = async (req, res) => {
    const client = await connectDB();
    try {
        const questionId = req.params.id;
        if (!ObjectId.isValid(questionId)) {
            return res.status(400).send({ error: "Invalid question ID." });
        }

        const questionById = await client.db('final').collection('questions').findOne({ _id: ObjectId.createFromHexString(questionId) });

        if (!questionById) {
            return res.status(404).send({ error: "Question not found." });
        }
        const user = await client.db('final').collection('users').findOne(
            { _id: ObjectId.createFromHexString(questionById.creatorId) },
            { projection: { username: 1, _id: 0 } }
        );
        res.send({ ...questionById, creatorUsername: user?.username });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err, message: `Something went wrong, please try again later.` });
    } finally {
        await client.close();
    }
};

export const addQuestion = async (req, res) => {
    const client = await connectDB();
    try {

        const user = await client.db('final').collection('users').findOne({ _id: ObjectId.createFromHexString(req.userId) });

        const newQuestion = {
            creatorId: req.userId,
            createDate: new Date(),
            creatorUsername: user.username,
            category: req.body.category,
            questionHeader: req.body.questionHeader,
            questionText: req.body.questionText,
            likeCount: 0,
            dislikeCount: 0,
            answerCount: 0
        }

        const result = await client.db('final').collection('questions').insertOne(newQuestion);
        res.status(201).send(newQuestion);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err, message: `Something went wrong, please try again later.` });
    } finally {
        await client.close();
    }
};

export const editQuestion = async (req, res) => {
    const client = await connectDB();
    try {
        const questionId = req.params.id;
        if (!ObjectId.isValid(questionId)) {
            return res.status(400).send({ error: "Invalid question ID." });
        }

        const updates = { ...req.body, lastEdited: new Date() };

        delete updates._id;
        delete updates.creatorId;
        delete updates.creatorUsername;
        delete updates.createDate;
        delete updates.likeCount;
        delete updates.dislikeCount;
        delete updates.answerCount;

        const result = await client.db('final').collection('questions').updateOne(
            { _id: ObjectId.createFromHexString(questionId) },
            { $set: updates });

        const updatedQuestion = await client.db('final').collection('questions').findOne({ _id: ObjectId.createFromHexString(questionId) });

        if (!updatedQuestion) {
            return res.status(404).send({ error: "Question not found." });
        }

        res.send(updatedQuestion);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err.toString(), message: "Something went wrong, please try again later." });
    } finally {
        await client.close();
    }
};

export const deleteQuestion = async (req, res) => {
    const client = await connectDB();
    try {
        const questionId = req.params.id;
        if (!ObjectId.isValid(questionId)) {
            return res.status(400).send({ error: "Invalid question ID." });
        }

        const result = await client.db('final').collection('questions').deleteOne({ _id: ObjectId.createFromHexString(questionId) });

        if (result.deletedCount) {
            res.send({ success: `Question with ID ${questionId} was deleted successfully.` });
        } else {
            res.status(404).send({ error: `Failed to delete. No question with ID ${questionId}.` })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err, message: `Something went wrong, please try again later.` });
    } finally {
        await client.close();
    }
};

export const getAnswersByQuestionId = async (req, res) => {
    const client = await connectDB();
    try {
        const questionId = req.params.id;
        if (!ObjectId.isValid(questionId)) {
            return res.status(400).send({ error: "Invalid question ID." });
        }

        const answers = await client.db('final').collection('answers').find({ questionId: questionId }).sort({ createDate: -1 }).toArray();

        res.send(answers);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err, message: `Something went wrong, please try again later.` });
    } finally {
        await client.close();
    }
};

export const questionReaction = async (req, res) => {
    const client = await connectDB();
    try {
        const questionId = req.params.id;
        const userId = req.userId;
        const { reaction } = req.body;

        if (!ObjectId.isValid(questionId)) {
            return res.status(400).send({ error: "Invalid question ID." });
        }

        const user = await client.db('final').collection('users').findOne({ _id: ObjectId.createFromHexString(userId) });
        if (!user) return res.status(404).send({ error: "User not found." });

        const question = await client.db('final').collection('questions').findOne({ _id: ObjectId.createFromHexString(questionId) });
        if (!question) return res.status(404).send({ error: "Question not found." });

        const liked = user.likedQuestions?.includes(questionId);
        const disliked = user.dislikedQuestions?.includes(questionId);

        let questionUpdate = {};
        let userUpdate = { $pull: {}, $addToSet: {} };

        if (reaction === "like") {
            if (liked) {
                questionUpdate.$inc = { likeCount: -1 };
                userUpdate.$pull.likedQuestions = questionId;
            } else {
                questionUpdate.$inc = { likeCount: 1 };
                userUpdate.$addToSet.likedQuestions = questionId;

                if (disliked) {
                    questionUpdate.$inc.dislikeCount = -1;
                    userUpdate.$pull.dislikedQuestions = questionId;
                }
            }
        } else if (reaction === "dislike") {
            if (disliked) {
                questionUpdate.$inc = { dislikeCount: -1 };
                userUpdate.$pull.dislikedQuestions = questionId;
            } else {
                questionUpdate.$inc = { dislikeCount: 1 };
                userUpdate.$addToSet.dislikedQuestions = questionId;

                if (liked) {
                    questionUpdate.$inc.likeCount = -1;
                    userUpdate.$pull.likedQuestions = questionId;
                }
            }
        }

        await client.db('final').collection('questions').updateOne(
            { _id: ObjectId.createFromHexString(questionId) },
            questionUpdate
        );

        if (!Object.keys(userUpdate.$pull).length) delete userUpdate.$pull;
        if (!Object.keys(userUpdate.$addToSet).length) delete userUpdate.$addToSet;

        await client.db('final').collection('users').updateOne(
            { _id: ObjectId.createFromHexString(userId) },
            userUpdate
        );

        const updatedQuestion = await client.db('final').collection('questions').findOne({ _id: ObjectId.createFromHexString(questionId) });

        res.send(updatedQuestion);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.toString(), message: "Something went wrong, please try again later." });
    } finally {
        await client.close();
    }
};