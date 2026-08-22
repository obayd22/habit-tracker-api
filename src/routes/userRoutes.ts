import { Router } from "express";
import { authenticateToken } from "../middleware/auth.ts";

const router = Router(); 

router.use(authenticateToken)

router.get('/', (req, res) => {
    res.json({message: "users"}).status(200)
})

router.get('/:id', (req, res) => {
    res.json({message: "got user"}).status(200)
})


router.put('/:id', (req, res) => {
    res.json({message: "user updated"}).status(201)
})

router.delete('/:id', (req, res) => {
    res.json({message: "user deleted"}).status(201)
})

export default router