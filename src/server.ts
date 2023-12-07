import { App } from './app'
import { AthleteRouter } from './routes/athlete'
import { CoachRouter } from './routes/coach'
import { SessionRPERouter } from './routes/sRPE'
import { POMSRouter } from './routes/POMS'
import { NotificationsRouter } from './routes/notifications'

new App([
    new AthleteRouter(),
    new CoachRouter(),
    new SessionRPERouter(),
    new POMSRouter(),
    new NotificationsRouter()
])