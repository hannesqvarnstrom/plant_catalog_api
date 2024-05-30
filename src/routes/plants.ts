import { Router } from 'express'
import { requireJwt } from '../middleware/jwt'
import userService from '../services/user'
import plantService from '../services/plant'
import { postPlantSchema } from './schemas'
import { validateRequest } from 'zod-express-middleware'

const plantsRouter = Router()

plantsRouter.use('/', requireJwt, async (req, _res, next) => {
    const userId = req.jwtPayload?.userId
    if (!userId) {
        return next(401) // jwt malformed
    }

    const user = await userService.getById(userId)
    req.user = user

    next()
})

plantsRouter.get('/', async (req, res, next) => {
    try {
        const plants = await plantService.getByUser(req.user!)
        return res.send(plants)
    } catch (error) {
        return next(error)
    }
})

plantsRouter.post('/',
    validateRequest({ body: postPlantSchema }),
    async (req, res, next) => {
        try {
            const { fontSize, name } = req.body
            const newPlant = await plantService.createPlant({ fontSize, name, userId: req.user!.id })

            return res.status(201).send(newPlant)
        } catch (error) {
            console.log('error:', error)
            return next(error)
        }
    })

export default plantsRouter

