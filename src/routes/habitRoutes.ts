import { Router } from "express";
import {validateBody} from '../middleware/validation.ts';
import {z} from 'zod';

const router = Router();

router.get('/', (req, res) => {
    res.json({messgage: "Habits"}).status(200)
})

router.get('/:id', (req, res) => {
    res.json({message: "Habit:"}).status(200)
})

router.post('/', (req, res) => {
    res.json({message: "habit created!"}).status(201)
})

router.delete('/:id', (req, res) => {
    res.json({message: "habit deleted"}).status(201)
})

router.post('/:id/completed', (req, res) => {
    res.json({message: "completed habit"}).status(201)
})

export default router