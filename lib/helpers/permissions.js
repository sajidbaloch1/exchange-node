import { APP_MODULES } from "../../models/v1/AppModule.js";

const appModules = [
  // Account Permissions
  {
    name: "Account Module",
    key: APP_MODULES.ACCOUNT_MODULE,
  },
  {
    name: "Create",
    key: APP_MODULES.ACCOUNT_CREATE,
  },
  {
    name: "Update",
    key: APP_MODULES.ACCOUNT_UPDATE,
  },
  {
    name: "Delete",
    key: APP_MODULES.ACCOUNT_DELETE,
  },
  {
    name: "Deposit",
    key: APP_MODULES.ACCOUNT_DEPOSIT,
  },
  {
    name: "Withdraw",
    key: APP_MODULES.ACCOUNT_WITHDRAW,
  },

  // User Permission
  {
    name: "User Module",
    key: APP_MODULES.USER_MODULE,
  },
  {
    name: "Create",
    key: APP_MODULES.USER_CREATE,
  },
  {
    name: "Update",
    key: APP_MODULES.USER_UPDATE,
  },
  {
    name: "Delete",
    key: APP_MODULES.USER_DELETE,
  },
  {
    name: "Status Update",
    key: APP_MODULES.USER_STATUS_UPDATE,
  },
  {
    name: "Bet Update",
    key: APP_MODULES.USER_BET_UPDATE,
  },

  // Theme User Permissions
  {
    name: "Theme User Module",
    key: APP_MODULES.THEME_USER_MODULE,
  },
  {
    name: "Create",
    key: APP_MODULES.THEME_USER_CREATE,
  },
  {
    name: "Update",
    key: APP_MODULES.THEME_USER_UPDATE,
  },
  {
    name: "Delete",
    key: APP_MODULES.THEME_USER_DELETE,
  },

  // Bank Permission
  {
    name: "Bank Module",
    key: APP_MODULES.BANK_MODULE,
  },
  {
    name: "Deposit",
    key: APP_MODULES.BANK_DEPOSIT,
  },
  {
    name: "Withdraw",
    key: APP_MODULES.BANK_WITHDRAW,
  },

  // Report Permissions
  {
    name: "Report Module",
    key: APP_MODULES.REPORT_MODULE,
  },
  {
    name: "Account Statement",
    key: APP_MODULES.REPORT_ACCOUNT_STATEMENT,
  },
];

const permissions = [
  // Account Permissions
  {
    key: APP_MODULES.ACCOUNT_MODULE,
    active: false,
    subModules: [
      {
        key: APP_MODULES.ACCOUNT_CREATE,
        active: false,
      },
      {
        key: APP_MODULES.ACCOUNT_UPDATE,
        active: false,
      },
      {
        key: APP_MODULES.ACCOUNT_DELETE,
        active: false,
      },
      {
        key: APP_MODULES.ACCOUNT_DEPOSIT,
        active: false,
      },
      {
        key: APP_MODULES.ACCOUNT_WITHDRAW,
        active: false,
      },
    ],
  },

  // User Permission
  {
    key: APP_MODULES.USER_MODULE,
    active: false,
    subModules: [
      {
        key: APP_MODULES.USER_CREATE,
        active: false,
      },
      {
        key: APP_MODULES.USER_UPDATE,
        active: false,
      },
      {
        key: APP_MODULES.USER_DELETE,
        active: false,
      },
      {
        key: APP_MODULES.USER_STATUS_UPDATE,
        active: false,
      },
      {
        key: APP_MODULES.USER_BET_UPDATE,
        active: false,
      },
    ],
  },

  // Theme User Permissions
  {
    key: APP_MODULES.THEME_USER_MODULE,
    active: false,
    subModules: [
      {
        key: APP_MODULES.THEME_USER_CREATE,
        active: false,
      },
      {
        key: APP_MODULES.THEME_USER_UPDATE,
        active: false,
      },
      {
        key: APP_MODULES.THEME_USER_DELETE,
        active: false,
      },
    ],
  },

  // Bank Permission
  {
    key: APP_MODULES.BANK_MODULE,
    active: false,
    subModules: [
      {
        key: APP_MODULES.BANK_DEPOSIT,
        active: false,
      },
      {
        key: APP_MODULES.BANK_WITHDRAW,
        active: false,
      },
    ],
  },

  // Report Permission
  {
    key: APP_MODULES.REPORT_MODULE,
    active: false,
    subModules: [
      {
        key: APP_MODULES.REPORT_ACCOUNT_STATEMENT,
        active: false,
      },
    ],
  },
];

export const defaultModules = appModules;
export const defaultPermissions = permissions;
