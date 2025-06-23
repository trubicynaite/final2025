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

export const addQuestion = async (req, res) => {
    const client = await connectDB();
    try {
        const newQuestion = {
            creatorId: req.userId,
            createDate: new Date().toISOString().split('T')[0],
            category: req.body.category,
            questionHeader: req.body.questionHeader,
            questionText: req.body.questionText,
            likeCount: 0,
            dislikeCount: 0,
            answerCount: 0
        }

        const res = await client.db('final').collection('questions').insertOne(newQuestion);
        newQuestion._id = result.insertedId;
        res.status(201).send({ success: 'Question added successfully.', question: newQuestion });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err, message: `Something went wrong, please try again later.` });
    } finally {
        await client.close();
    }
};

export const ediQuestion = async (req, res) => {
    const client = await connectDB();
    try {
        const questionId = req.params.id;
        if (!ObjectId.isValid(questionId)) {
            return res.status(400).send({ error: "Invalid question ID." });
        }

        const updates = { ...req.body };

        delete updates._id;
        delete updates.creatorId;
        delete updates.createDate;
        delete updates.likeCount;
        delete updates.dislikeCount;
        delete updates.answerCount;

        const result = await client.db('final').collection('questions').findOneAndUpdate({ _id: ObjectId.createFromHexString(questionId) },
            { $set: updates },
            { returnDocument: 'after' });

        if (!result.value) {
            return res.status(404).send({ error: "Question not found." });
        }

        res.send(result.value);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err, message: `Something went wrong with servers, please try again later.` });
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

        const res = await client.db('final').collection('questions').deleteOne({ _id: ObjectId.createFromHexString(questionId) });

        if (res.deletedCount) {
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

