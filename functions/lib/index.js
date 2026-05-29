"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purgeDeletedWorkspaces = void 0;
const app_1 = require("firebase-admin/app");
const purge_deleted_workspaces_1 = require("./scheduled/purge-deleted-workspaces");
Object.defineProperty(exports, "purgeDeletedWorkspaces", { enumerable: true, get: function () { return purge_deleted_workspaces_1.purgeDeletedWorkspaces; } });
(0, app_1.initializeApp)();
//# sourceMappingURL=index.js.map