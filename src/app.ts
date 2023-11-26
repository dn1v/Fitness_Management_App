import express, { Request, Response, Express, NextFunction } from 'express'
import dotenv from 'dotenv'
import { Database } from './db/mongoose'
import { AthleteRouter } from './routes/athlete'
import { SessionRPERouter } from './routes/sRPE'
import { POMSRouter } from './routes/POMS'
import { CoachRouter } from './routes/coach'
import { HttpException } from './exceptions/httpExceptions'
import { ErrorMessages } from './constants/errorMessages'
import { NotificationsRouter } from './routes/notifications'
import http, { Server } from 'http'

export class App {
    private app: Express
    private server: Server
    private port: string | undefined
    private athleteRouter: AthleteRouter
    private coachRouter: CoachRouter
    private sessionRPERouter: SessionRPERouter
    private POMSRouter: POMSRouter
    private notificationsRouter: NotificationsRouter

    constructor() {
        this.app = express()
        this.athleteRouter = new AthleteRouter()
        this.coachRouter = new CoachRouter()
        this.sessionRPERouter = new SessionRPERouter()
        this.POMSRouter = new POMSRouter()
        this.notificationsRouter = new NotificationsRouter()
        this.enviromentVariables()
        this.port = process.env.PORT
        this.server = http.createServer(this.app)
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
        this.app.use(this.coachRouter.registerRoutes())
            .use(this.athleteRouter.registerRoutes())
            .use(this.sessionRPERouter.registerRoutes())
            .use(this.POMSRouter.registerRoutes())
            .use(this.notificationsRouter.registerRoutes())
    }
}

