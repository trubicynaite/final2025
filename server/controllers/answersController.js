import { ObjectId } from "mongodb";
import { connectDB } from "./helper.js"

export const addAnswer = async (req, res) => {
    const client = await connectDB();
    try {
        const questionId = req.params.id;
        if (!ObjectId.isValid(questionId)) {
            return res.status(400).send({ error: "Invalid question ID." });
        }
        const user = await client.db('final').collection('users').findOne({ _id: ObjectId.createFromHexString(req.userId) });

        const newAnswer = {
            questionId: questionId,
            creatorId: req.userId,
            answerText: req.body.answerText,
            createDate: new Date(),
            creatorUsername: user.username
        };

        const result = await client.db('final').collection('answers').insertOne(newAnswer);

        await client.db('final').collection('questions').updateOne(
            { _id: ObjectId.createFromHexString(questionId) },
            { $inc: { answerCount: 1 } }
        );

        await client.db('final').collection('users').updateOne(
            { _id: ObjectId.createFromHexString(req.userId) },
            { $addToSet: { answeredQuestions: questionId } }
        );

        res.status(201).send({ success: 'Answer added successfully.', answer: { ...newAnswer, _id: result.insertedId } });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err, message: `Something went wrong, please try again later.` });
    } finally {
        await client.close();
    }
};

export const editAnswer = async (req, res) => {

    const client = await connectDB();
    try {
        const answerId = req.params.id;
        if (!ObjectId.isValid(answerId)) {
            return res.status(400).send({ error: "Invalid answer ID." });
        }

        const updates = {
            answerText: req.body.answerText,
            lastEdited: new Date()
        };

        const result = await client.db('final').collection('answers').findOneAndUpdate(
            { _id: ObjectId.createFromHexString(answerId) },
            { $set: updates },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({ error: "Answer not found." });
        }

        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err, message: `Something went wrong, please try again later.` });
    } finally {
        await client.close();
    }
};

export const deleteAnswer = async (req, res) => {
    const client = await connectDB();
    try {
        const answerId = req.params.id;
        if (!ObjectId.isValid(answerId)) {
            return res.status(400).send({ error: "Invalid answer ID." });
        }

        const answer = await client.db('final').collection('answers').findOne({ _id: ObjectId.createFromHexString(answerId) });

        const deleteResult = await client.db('final').collection('answers').deleteOne({ _id: ObjectId.createFromHexString(answerId) });

        if (deleteResult.deletedCount === 0) {
            return res.status(404).send({ error: "Failed to delete answer." });
        }

        if (answer) {
            await client.db('final').collection('questions').updateOne(
                { _id: ObjectId.createFromHexString(answer.questionId) },
                { $inc: { answerCount: -1 } }
            );
        }

        res.send({ success: "Answer deleted successfully." });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err, message: `Something went wrong, please try again later.` });
    } finally {
        await client.close();
    }
};