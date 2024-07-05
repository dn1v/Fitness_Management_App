import { describe, expect, test } from '@jest/globals';
import { sum } from './sum';
import { App } from '../src/app';

import { SessionRPERouter } from '../src/routes/sRPE';
import { POMSRouter } from '../src/routes/POMS';
import { NotificationsRouter } from '../src/routes/notifications';
import { PostRouter } from '../src/routes/post';
import { UserRouter } from '../src/routes/user';
import { GroupRouter } from '../src/routes/group';
import { beforeAll } from '@jest/globals';
import supertest, { SuperTest, Test } from 'supertest';
import { it } from '@jest/globals';

describe('App', () => {
    it('should initialize with routers', () => {
        const app = new App([new UserRouter()]);
        expect(app).toBeDefined();
        // Add more assertions as needed
    });
});