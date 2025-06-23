import { Router } from "express";

import { getQuestions, addQuestion, ediQuestion, deleteQuestion, getQuestionById } from "../controllers/questionsController.js";

const router = Router();

// questions - show all questions
router.get('/', getQuestions);

// questions - get a specific question by ID
router.get('/:id', getQuestionById);

// add a question - ask a question
router.post('/', addQuestion);

// edit a question - edit an existig question
router.patch('/:id', ediQuestion);

// delete a question - delete selected question from database
router.delete('/:id', deleteQuestion);

export default router;