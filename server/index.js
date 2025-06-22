import e from "express";
import cors from 'cors';
import 'dotenv/config';

import usersRoutes from "./routes/usersRoutes.js"
import questionsRoutes from './routes/questionsRoutes.js'

const PORT = process.env.PORT || 5501;

const corsOptions = {
    origin: "http://localhost:5173",
    exposedHeaders: ['Authorization']
};

const app = e();

app.use(e.json());
app.use(cors(corsOptions));

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port`);
});

//ROUTES
//USERS
app.use('/users', usersRoutes);

//QUESTIONS
app.use('/questions', questionsRoutes);

//ANSWERS
// error
app.use((req, res) => {
    res.status(404).send({ error: `Your requested route does not exist.` });
});