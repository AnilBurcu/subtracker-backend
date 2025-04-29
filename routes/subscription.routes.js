import { Router } from 'express';

const subscriptionRouter = Router();

subscriptionRouter.get('/',(req,res)=>res.send({title:'GET all subscriptions'}))

subscriptionRouter.get('/:id',(req,res)=>res.send({title:'GET subscriptions details'}))

subscriptionRouter.post('/',(req,res)=>res.send({title:'CREATE subscriptions'}))

subscriptionRouter.put('/',(req,res)=>res.send({title:'UPDATE subscriptions'}))

subscriptionRouter.delete('/:id',(req,res)=>res.send({title:'DELETE subscriptions'}))

subscriptionRouter.get('/user/:id',(req,res)=>res.send({title:'GET all user subscriptions'}))

subscriptionRouter.put('/:id/cancel',(req,res)=>res.send({title:'CANCEL subscriptions'}))

subscriptionRouter.get('/upcoming-renewals',(req,res)=>res.send({title:'GET upcoming renewals'}))


export default subscriptionRouter;