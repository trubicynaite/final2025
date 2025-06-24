import { Router } from "express";

import { editAnswer, deleteAnswer } from "../controllers/answersController.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

// edit an answer by answer ID
router.patch('/:id', verifyJWT, editAnswer);

// delete answer by ID
router.delete('/:id', verifyJWT, deleteAnswer);

export default router;