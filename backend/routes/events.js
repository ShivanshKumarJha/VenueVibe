import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
    res.send('From event page');
})

export default router;