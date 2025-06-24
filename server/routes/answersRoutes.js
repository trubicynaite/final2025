import { Router } from "express";

import { editAnswer, deleteAnswer } from "../controllers/answersController.js"

const router = Router();

// edit an answer by answer ID
router.patch('/:id', editAnswer);

// delete answer by ID
router.delete('/:id', deleteAnswer);

export default router;