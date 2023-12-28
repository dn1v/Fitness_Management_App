export enum Endpoints {
    USERS = '/users',
    USERS_LOGIN = '/users/login',
    USERS_ME = '/users/me',
    USERS_ME_PROFILEPIC = '/users/me/profilePic',
    USERS_ID_PROFILEPIC = '/users/:id/profilePic',
    USERS_LOGOUT = '/users/me/logout',
    USERS_LOGOUTALL = '/users/me/logoutAll',
    USERS_ME_CONNECTIONS = '/users/me/connections',
    USERS_ME_CONNECTIONS_ID = '/users/me/connections/:id',
    USERS_ME_CONNECTIONS_ACCEPT_ID = '/users/me/connections/accept/:id',
    USERS_ME_CONNECTIONS_DECLINE_ID = '/users/me/connections/decline/:id',
    USERS_ME_CONNECTIONS_REMOVE_ID = '/users/me/connections/remove/:id',

    ATHLETES = '/athletes',
    ATHLETES_LOGIN = '/login',
    ATHLETES_LOGOUT = '/athletes/logout',
    ATHLETES_LOGOUTALL = '/athletes/logoutAll',
    ATHLETES_ME = '/athletes/me',
    ATHLETES_ME_PROFILEPIC = '/athletes/me/profilePic',
    ATHLETES_ID_PROFILEPIC = '/athletes/:id/profilePic',

    ATHLETES_ME_CONNECTIONS = '/athletes/me/connections',
    ATHLETES_ME_CONNECTIONS_ID = '/athletes/me/connections/:id',
    ATHLETES_ME_CONNECTIONS_ACCEPT_ID = '/athletes/me/connections/accept/:id',
    ATHLETES_ME_CONNECTIONS_DECLINE_ID = '/athletes/me/connections/decline/:id',
    ATHLETES_ME_CONNECTIONS_REMOVE_ID = '/athletes/me/connections/remove/:id',

    COACHES = '/coaches',
    COACHES_ME = '/coaches/me',
    COACHES_ME_PROFILEPIC = '/coaches/me/profilePic',
    COACHES_ID_PROFILEPIC = '/coaches/:id/profilePic',
    COACHES_ME_CONNECTIONS = '/coaches/me/connections',
    COACHES_ME_CONNECTIONS_ID = '/coaches/me/connections/:id',
    COACHES_ME_CONNECTIONS_ACCEPT_ID = '/coaches/me/connections/accept/:id',
    COACHES_ME_CONNECTIONS_DECLINE_ID = '/coaches/me/connections/decline/:id',
    COACHES_ME_CONNECTIONS_REMOVE_ID = '/coaches/me/connections/remove/:id',
    COACHES_LOGIN = 'coaches/login',
    COACHES_LOGOUT = 'coaches/logout',
    COACHES_LOGOUTALL = 'coaches/logoutAll',

    SESSIONRPE = '/sessionRPE',
    SESSIONRPE_ID = '/sessionRPE/:id',
    SESSIONRPE_COACH_AID = '/sessionRPE/coach/:aid',
    SESSIONRPE_COACH_AID_SID = '/sessionRPE/coach/:aid/:sid',

    POMS = '/poms',
    POMS_ID = '/poms/:id',
    POMS_COACH_AID = '/poms/coach/:aid',
    POMS_COACH_AID_SID = 'poms/coach/:aid/:pid',

    NOTIFICATIONS = '/notifications',
    NOTIFICATIONS_ID = '/notifications/:id'
}

