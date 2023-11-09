import express, { Request, Response, Express, NextFunction } from 'express'
import dotenv from 'dotenv'
import { Database } from './db/mongoose'
import { AthleteRouter } from './routes/athlete'
import { SessionRPERouter } from './routes/sRPE'
import { POMSRouter } from './routes/POMS'
import { CoachRouter } from './routes/coach'

export class App {
    app: Express
    port: string | undefined
    athleteRouter: AthleteRouter
    coachRouter: CoachRouter
    sessionRPERouter: SessionRPERouter
    POMSRouter: POMSRouter

    constructor() {
        this.app = express()
        this.athleteRouter = new AthleteRouter()
        this.coachRouter = new CoachRouter()
        this.sessionRPERouter = new SessionRPERouter()
        this.POMSRouter = new POMSRouter()
        this.enviromentVariables()
        this.port = process.env.PORT
        this.init()
    }

    init(): void {
        this.database()
        this.middlewares()
        this.listening()
    }

    listening(): void {
        this.app.listen(this.port, () => {
            console.log('Server is up on port', this.port)
        })
    }

    enviromentVariables(): void {
        dotenv.config()
    }

    middlewares(): void {
        this.app.use(express.json())
        this.app.use(function (req: Request, res: Response, next: NextFunction) {
            res.header("Access-Control-Allow-Origin", process.env.CORS_URL);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
            next();
        })
        this.routes()
    }

    database(): void {
        new Database()
    }

    routes(): void {
        this.app.use(this.coachRouter.registerRoutes())
            .use(this.athleteRouter.registerRoutes())
            .use(this.sessionRPERouter.registerRoutes())
            .use(this.POMSRouter.registerRoutes())
    }
}

