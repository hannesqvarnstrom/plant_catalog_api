import { Router } from "express"
import usersRouter from "./users"
// import moodRatingRouter from "./mood-rating"
import envVars from "../utils/environment"

const router = Router()

router.use((_req, res, next) => {
    res.set('content-type', 'application/json')
    if (envVars.isDev()) {
        // res.set('Access-Control-Allow-Origin', 'http://localhost:5173')
        console.log('Getting request at url', _req.url)
    }

    next()
})

router.get('/', (_req, res) => {
    res.send({ message: 'Welcome to MoodLogger!' })
})

/**
 * Users 
 * - POST /register, 
 * - POST /login, 
 * - GET /me,
 * - PUT /me,
 * 
 * - GET /auth/google
 * - GET /auth/google/redirect
 */
router.use(usersRouter)


/**
 * Mood Ratings
 * (All endpoints are JWT protected)
 * - GET /ratings,
 * - GET /ratings/average,
 * - POST /ratings,
 */
// router.use('/ratings', moodRatingRouter)

export default router
