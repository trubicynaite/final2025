import { Router } from "express";

import { getQuestions, addQuestion, ediQuestion, deleteQuestion, getQuestionById, getAnswersByQuestionId } from "../controllers/questionsController.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

// questions - show all questions
router.get('/', getQuestions);

// questions - get a specific question by ID
router.get('/:id', getQuestionById);

// add a question - ask a question
router.post('/', verifyJWT, addQuestion);

// edit a question - edit an existig question
router.patch('/:id', verifyJWT, ediQuestion);

// delete a question - delete selected question from database
router.delete('/:id', verifyJWT, deleteQuestion);

// answers - get all answers by question ID
router.get('/:id/answers', getAnswersByQuestionId);

export default router;