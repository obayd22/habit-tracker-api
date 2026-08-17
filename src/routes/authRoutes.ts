import {Router} from 'express'; 

const router = Router();

router.post('/register', (req, res) => {
    res.json({message: "Registered"}).status(201);
})

router.post('/login', (req, res) => {
    res.json({message: "Logged in"}).status(201);
})

export default router;