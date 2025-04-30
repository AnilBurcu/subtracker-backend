import {Router} from "express";
import  {signUp,signIn,signOut} from '../controllers/auth.controller.js'

const authRouter = Router()

// Path: /api/v1/auth/sign-up (POST)
authRouter.post('/sign-up',signUp)

// Path: /api/v1/auth/sign-in (POST)
authRouter.post('/sign-in',signIn)

// Path: /api/v1/auth/sign-out (POST)
authRouter.post('/sign-out',signOut)


export default authRouter;