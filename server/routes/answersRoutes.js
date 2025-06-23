import { Router } from "express";

import { getAnswersByQuestionId, addAnswer, editAnswer, deleteAnswer } from "../controllers/answersController.js"

const router = Router();

// answers - get all answers by question ID
router.get('/questions/:id/answers', getAnswersByQuestionId);

// add an answer - add a new answer to a specific question by question ID
router.post('/questions/:id/answers', addAnswer);

// edit an answer by answer ID
router.patch('/:id', editAnswer);

// delete answer by ID
router.delete('/:id', deleteAnswer);

export default router;