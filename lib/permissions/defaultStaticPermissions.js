import { APP_MODULES } from "../../models/v1/AppModule.js";
import { USER_ROLE } from "../../models/v1/User.js";
import defaultStaticModules from "./defaultStaticModules.js";

// NOTE: These permissions are not stored in the database.
const permissions = [
  {
    key: defaultStaticModules.DASHBOARD,
    userRoles: [
      USER_ROLE.SYSTEM_OWNER,
      USER_ROLE.SUPER_ADMIN,
      USER_ROLE.ADMIN,
      USER_ROLE.SUPER_MASTER,
      USER_ROLE.MASTER,
      USER_ROLE.AGENT,
    ],
  },
  {
    key: APP_MODULES.ACCOUNT_MODULE,
    userRoles: [
      USER_ROLE.SYSTEM_OWNER,
      USER_ROLE.SUPER_ADMIN,
      USER_ROLE.ADMIN,
      USER_ROLE.SUPER_MASTER,
      USER_ROLE.MASTER,
    ],
  },
  {
    key: APP_MODULES.USER_MODULE,
    userRoles: [
      USER_ROLE.SYSTEM_OWNER,
      USER_ROLE.SUPER_ADMIN,
      USER_ROLE.ADMIN,
      USER_ROLE.SUPER_MASTER,
      USER_ROLE.MASTER,
      USER_ROLE.AGENT,
    ],
  },
  {
    key: defaultStaticModules.MULTI_LOGIN,
    userRoles: [USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.SUPER_MASTER, USER_ROLE.MASTER, USER_ROLE.AGENT],
  },
  {
    key: defaultStaticModules.CURRENCIES,
    userRoles: [USER_ROLE.SYSTEM_OWNER],
  },
  {
    key: defaultStaticModules.SPORTS,
    userRoles: [USER_ROLE.SYSTEM_OWNER],
  },
  {
    key: defaultStaticModules.COMPETITIONS,
    userRoles: [USER_ROLE.SYSTEM_OWNER],
  },
  {
    key: defaultStaticModules.EVENTS,
    userRoles: [USER_ROLE.SYSTEM_OWNER],
  },
  {
    key: defaultStaticModules.ADD_EVENT,
    userRoles: [USER_ROLE.SYSTEM_OWNER],
  },
  {
    key: APP_MODULES.THEME_USER_MODULE,
    userRoles: [USER_ROLE.SUPER_ADMIN],
  },
  {
    key: APP_MODULES.TRANSACTION_PANEL_USER_MODULE,
    userRoles: [USER_ROLE.MASTER],
  },
  {
    key: APP_MODULES.BANK_MODULE,
    userRoles: [
      USER_ROLE.SYSTEM_OWNER,
      USER_ROLE.SUPER_ADMIN,
      USER_ROLE.ADMIN,
      USER_ROLE.SUPER_MASTER,
      USER_ROLE.MASTER,
      USER_ROLE.AGENT,
    ],
  },
  {
    key: APP_MODULES.REPORT_MODULE,
    userRoles: [
      USER_ROLE.SYSTEM_OWNER,
      USER_ROLE.SUPER_ADMIN,
      USER_ROLE.ADMIN,
      USER_ROLE.SUPER_MASTER,
      USER_ROLE.MASTER,
      USER_ROLE.AGENT,
    ],
  },
  {
    key: defaultStaticModules.CASINO,
    userRoles: [USER_ROLE.SYSTEM_OWNER],
  },
  {
    key: defaultStaticModules.CASINO_GAME,
    userRoles: [USER_ROLE.SYSTEM_OWNER],
  },
];

export default permissions;
