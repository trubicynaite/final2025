import { Router } from "express";

import { getQuestions, addQuestion, ediQuestion, deleteQuestion } from "../controllers/questionsController.js";

const router = Router();

// questions - show all questions
router.get('/showAll', getQuestions);

// add question - ask a question
router.post('/add', addQuestion);

// edit question - edit an existig question
router.patch('/edit', ediQuestion);

// delete question - delete selected question from database
router.delete('/delete', deleteQuestion);

export default router;