import express from 'express'
import { Express } from 'express-serve-static-core'
import dbManager from '../db'
import routes from '../routes'
import cors from 'cors'
import { JwtPayload } from '../middleware/jwt'
import { errorHandler } from '../middleware/error-handling'
import authService, { AuthenticationService } from '../services/authentication'
// import { TUser } from '../models/user'

export default function makeServer(): Promise<Express> {
    const server = express()
    server.use(express.json())
    server.use(cors())
    server.use((req, res) => {
        console.log(req)
        console.log(req)
        const testing = AuthenticationService.compare('this', 'that')

        console.log('testing:', testing)
        return res.send('Hello  ???  :D ')
    })
    server.use(routes)
    server.use(errorHandler)
    return Promise.resolve(server)
}

declare global {
    namespace Express {
        interface Request {
            jwtPayload?: JwtPayload,
            // user?: TUser
        }
    }

}