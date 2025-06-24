import { Router } from "express";

import { getQuestions, addQuestion, editQuestion, deleteQuestion, getQuestionById, getAnswersByQuestionId } from "../controllers/questionsController.js";
import { verifyJWT } from "../middleware/auth.js";
import { addAnswer } from "../controllers/answersController.js";

const router = Router();

// questions - show all questions
router.get('/', getQuestions);

// questions - get a specific question by ID
router.get('/:id', getQuestionById);

// add a question - ask a question
router.post('/', verifyJWT, addQuestion);

// edit a question - edit an existig question
router.patch('/:id', verifyJWT, editQuestion);

// delete a question - delete selected question from database
router.delete('/:id', verifyJWT, deleteQuestion);

// answers - get all answers by question ID
router.get('/:id/answers', getAnswersByQuestionId);

// add an answer - add a new answer to a specific question by question ID
router.post('/:id/answers', verifyJWT, addAnswer);

export default router;