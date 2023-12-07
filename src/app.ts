import express, { Request, Response, Express, NextFunction } from 'express'
import dotenv from 'dotenv'
import { Database } from './db/mongoose'
import { HttpException } from './exceptions/httpExceptions'
import { ErrorMessages } from './constants/errorMessages'
import http, { Server } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { AppRouter } from './routes/appRouter'

export class App {
    private app: Express
    private server: Server
    private io: SocketIOServer
    private port: string | undefined
    private routers: AppRouter[]

    constructor(routers: AppRouter[]) {
        this.app = express()
        this.routers = routers
        this.enviromentVariables()
        this.port = process.env.PORT
        this.server = http.createServer(this.app)
        this.io = new SocketIOServer(this.server)
        this.init()
    }

    private init(): void {
        this.database()
        this.middlewares()
        this.listening()
    }

    private listening(): void {
        this.server.listen(this.port, () => {
            console.log('Server is up on port', this.port)
        })
        //this.io.listen()
    }

    private enviromentVariables(): void {
        dotenv.config()
    }

    private middlewares(): void {
        this.app.use(express.json())
        this.app.use(function (req: Request, res: Response, next: NextFunction) {
            res.header("Access-Control-Allow-Origin", process.env.CORS_URL);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
            next();
        })
        this.routes()
        this.errorHandler()
    }

    private errorHandler(): void {
        this.app.use((err: HttpException<any>, req: Request, res: Response, next: NextFunction): void => {
            const { status = 500, message = ErrorMessages.INTERNAL_SERVER_ERROR, data } = err;
            res.status(status).send({ error: { message, data } })
        })
    }

    private database(): void {
        new Database()
    }

    private routes(): void {        
        this.routers.forEach((router: AppRouter) => this.app.use(router.registerRoutes()))
    }
}

