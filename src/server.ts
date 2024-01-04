import { App } from './app'
import { SessionRPERouter } from './routes/sRPE'
import { POMSRouter } from './routes/POMS'
import { NotificationsRouter } from './routes/notifications'
import { UserRouter } from './routes/user'
import { GroupRouter } from './routes/group'

new App([
    new UserRouter(),
    new SessionRPERouter(),
    new POMSRouter(),
    new NotificationsRouter(),
    new GroupRouter()
])