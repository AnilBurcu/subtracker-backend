import { Router } from 'express';
import authorize from "../middlewares/auth.middleware.js";
import {createSubscription, getUserSubscriptions,} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/',(req,res)=>res.send({title:'GET all subscriptions'}))

subscriptionRouter.get('/:id',(req,res)=>res.send({title:'GET subscriptions details'}))

subscriptionRouter.post('/',authorize, createSubscription)

subscriptionRouter.put('/',(req,res)=>res.send({title:'UPDATE subscriptions'}))

subscriptionRouter.delete('/:id',(req,res)=>res.send({title:'DELETE subscriptions'}))

subscriptionRouter.get('/user/:id',authorize, getUserSubscriptions)

subscriptionRouter.put('/:id/cancel',(req,res)=>res.send({title:'CANCEL subscriptions'}))

subscriptionRouter.get('/upcoming-renewals',(req,res)=>res.send({title:'GET upcoming renewals'}))


export default subscriptionRouter;