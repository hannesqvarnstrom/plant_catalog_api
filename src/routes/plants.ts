import { Router } from 'express'
import { requireJwt } from '../middleware/jwt'
import userService from '../services/user'
import plantService from '../services/plant'
import { postPlantSchema, putPlantSchema } from './schemas'
import { validateRequest } from 'zod-express-middleware'
import { validateOwnership } from '../middleware/ownership'
import { ShallowPlant } from '../models/plant'
import { AppError } from '../utils/errors'

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

plantsRouter.put('/:plantId', validateRequest({ body: putPlantSchema }),
    validateOwnership,
    async (req, res, next) => {
        try {
            const { fontSize, name } = req.body
            const validatedName: ShallowPlant['name'] = validateName(name as ClientNamePayload)
            const updatedPlant = await plantService.updatePlant(req.params.plantId, { fontSize: fontSize, name: validatedName })
            return res.status(201).send(updatedPlant)
        } catch (err) {
            console.error('err', err)
            return next(err)
        }
    })
export default plantsRouter

type ClientNamePayload = Partial<ShallowPlant['name']> & {
    name1a?: {
        species?: boolean,
        name?: string
    },
    name1b?: {
        species?: boolean,
        name?: string
    },
    name2a?: {
        species?: boolean,
        name?: string
    },
    name2b?: {
        species?: boolean,
        name?: string
    },
}

function validateName(name: Partial<ShallowPlant['name']>): ShallowPlant['name'] {
    const { genusName, speciesName, varietyName, name1a, name1b, name2a, name2b } = name
    if (!genusName) throw new AppError('Missing genus name', 400)

    const validatedName: ShallowPlant['name'] = {
        genusName,
        speciesName,
        varietyName,
    }

    const name1aValidated = name1a
    if (name1aValidated) {
        const name1aValid = name1aValidated.name && name1aValidated.species !== undefined
        if (!name1aValid) {
            throw new AppError('Name1a invalid', 400)
        }
        validatedName.name1a = name1aValidated
    }

    const name1bValidated = name1b
    if (name1bValidated) {
        const name1bValid = name1bValidated.name && name1bValidated.species !== undefined
        if (!name1bValid) {
            throw new AppError('Name1b invalid', 400)
        }
        validatedName.name1b = name1bValidated
    }

    const name2aValidated = name2a
    if (name2aValidated) {
        const name2aValid = name2aValidated.name && name2aValidated.species !== undefined
        if (!name2aValid) {
            throw new AppError('Name2a invalid', 400)
        }
        validatedName.name2a = name2aValidated
    }

    const name2bValidated = name2b
    if (name2bValidated) {
        const name2bValid = name2bValidated.name && name2bValidated.species !== undefined
        if (!name2bValid) {
            throw new AppError('Name2b invalid', 400)
        }
        validatedName.name2b = name2bValidated
    }

    return validatedName
}

