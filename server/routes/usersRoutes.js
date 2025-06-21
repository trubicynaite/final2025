import { Router } from "express";

import { login, loginAuto, register, editUser } from "../controllers/usersController.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();

// login - check if user exists with given name and password
router.post('/login', login);

// login with JWT - login automatically if user has valid JWT
router.get('/loginAuto', loginAuto);

// register - add new user
router.post('/register', register);

// edit - edit user
router.patch('/edit', verifyJWT, editUser);

export default router;