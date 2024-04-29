export enum Endpoints {
    USERS = '/users',
    USERS_LOGIN = '/users/login',
    USERS_ME = '/users/me',
    USERS_ME_PROFILEPIC = '/users/me/profilePic',
    USERS_ID_PROFILEPIC = '/users/:id/profilePic',
    USERS_LOGOUT = '/users/me/logout',
    USERS_LOGOUTALL = '/users/me/logoutAll',
    USERS_ME_CONNECTIONS = '/users/me/connections',
    USERS_ME_CONNECTIONS_SENT = '/users/me/connections/sent',
    USERS_ME_CONNECTIONS_RECEIVED = '/users/me/connections/received',
    USERS_ME_CONNECTIONS_ID = '/users/me/connections/:id',
    USERS_ME_CONNECTIONS_ACCEPT_ID = '/users/me/connections/accept/:id',
    USERS_ME_CONNECTIONS_DECLINE_ID = '/users/me/connections/decline/:id',
    USERS_ME_CONNECTIONS_REMOVE_ID = '/users/me/connections/remove/:id',

    SESSIONRPE = '/sessionRPE',
    SESSIONRPE_ID = '/sessionRPE/:id',
    SESSIONRPE_COACH_AID = '/sessionRPE/coach/:aid',
    SESSIONRPE_COACH_AID_SID = '/sessionRPE/coach/:aid/:sid',

    POMS = '/poms',
    POMS_ID = '/poms/:id',
    POMS_COACH_AID = '/poms/coach/:aid',
    POMS_COACH_AID_SID = 'poms/coach/:aid/:pid',

    NOTIFICATIONS = '/notifications',
    NOTIFICATIONS_ID = '/notifications/:id',

    GROUPS = '/groups',
    GROUPS_ID = '/groups/:groupId',
    GROUPS_ID_MEMBERS_MODID = '/groups/:groupId/members/:modId',
    GROUPS_ID_MEMBERS_MEMBERID = '/groups/:groupId/members/:memberId',

    POSTS = '/posts',
    POST_POSTID = '/posts/:postId',
    POSTS_GROUP_ID = '/posts/group/:groupId',
    POSTS_GENERAL = '/posts/general',
    POSTS_GENERAL_ID = '/posts/general/:id',
    POSTS_POSTID_GROUP_GROUPID = '/posts/:postId/group/:groupId'
}

