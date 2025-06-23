import { ObjectId } from "mongodb";
import { createAccessJWT, validateJWT } from "../middleware/jwt.js";
import { connectDB } from "./helper.js";
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
    const client = await connectDB();
    try {
        const DB_RESPONSE = await client.db('final').collection('users').findOne({ username: req.body.username });
        if (!DB_RESPONSE) {
            return res.status(404).send({ error: "No user was found with such username or password." });
        }
        if (!bcrypt.compareSync(req.body.password, DB_RESPONSE.password)) {
            return res.status(404).send({ error: "No user was found with such username or password." });
        }
        const { password, ...restUserInfo } = DB_RESPONSE;
        const JWT_accessToken = createAccessJWT(restUserInfo);
        res
            .header('Authorization', JWT_accessToken)
            .send({ success: "Successfully logged user in.", userData: restUserInfo });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err, message: `Something went wrong with servers, please try again later.` });
    } finally {
        await client.close();
    }
}

export const loginAuto = async (req, res) => {
    const client = await connectDB();
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send({ error: "Authorization header missing." });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send({ error: "Access token missing." });
        }
        const verifyResults = validateJWT(token);
        if ("error" in verifyResults) {
            return res.status(401).send(verifyResults);
        }
        const userId = verifyResults._id;
        if (!ObjectId.isValid(userId)) {
            return res.status(400).send({ error: "Invalid user ID in token." });
        }
        const user = await client.db('final').collection('users').findOne({ _id: ObjectId.createFromHexString(userId) });
        if (!user) {
            return res.status(404).send({ error: "User not found." });
        }
        const { password, ...userWithoutPass } = user;
        res.send({ userData: userWithoutPass });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err, message: "Something went wrong with the server, please try again later." });
    }
};

export const register = async (req, res) => {
    const client = await connectDB();
    try {
        const { username, email, firstName, lastName, dob } = req.body;

        const existingUser = await client.db('final').collection('users').findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).send({ error: 'User with such username already exists.' })
        }
        const newUser = {
            username,
            email,
            firstName,
            lastName,
            dob,
            password: bcrypt.hashSync(req.body.password, 10),
            passwordText: req.body.password,
            createDate: new Date().toISOString().split('T')[0],
            createdQuestions: [],
            answeredQuestions: [],
            likedQuestions: [],
            dislikedQuestions: []
        }
        const result = await client.db('final').collection('users').insertOne(newUser);
        newUser._id = result.insertedId;

        const { password, ...userWithoutPass } = newUser;
        const accessJWT = createAccessJWT(userWithoutPass);

        res.status(201).header("Authorization", accessJWT).send({ success: "User registered successfully.", userData: userWithoutPass });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err, message: "Registration failed. Please try again later." });
    } finally {
        await client.close();
    }
};

export const editUser = async (req, res) => {
    const client = await connectDB();
    try {
        const userId = req.userId;
        if (!ObjectId.isValid(userId)) {
            return res.status(400).send({ error: "Invalid user ID." });
        }
        const updates = { ...req.body };

        delete updates._id;
        delete updates.username;
        delete updates.dob;
        delete updates.createDate;
        delete updates.createdQuestions;
        delete updates.answeredQuestions;
        delete updates.likedQuestions;
        delete updates.dislikedQuestions;

        if (updates.password) {
            updates.password = bcrypt.hashSync(updates.password, 10);
        }

        const result = await client.db('final').collection('users').findOneAndUpdate({ _id: ObjectId.createFromHexString(userId) },
            { $set: updates },
            { returnDocument: 'after' });

        if (!result.value) {
            return res.status(404).send({ error: "User not found." });
        }

        const { password, ...userWithoutPass } = result.value;
        res.send(userWithoutPass);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err, message: "Failed to update user." });
    } finally {
        await client.close();
    }
}