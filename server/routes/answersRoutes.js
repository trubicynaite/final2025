import { Router } from "express";

import { addAnswer, editAnswer, deleteAnswer } from "../controllers/answersController.js"

const router = Router();

// add an answer - add a new answer to a specific question by question ID
router.post('/:id/answers', addAnswer);

// edit an answer by answer ID
router.patch('/:id', editAnswer);

// delete answer by ID
router.delete('/:id', deleteAnswer);

export default router;