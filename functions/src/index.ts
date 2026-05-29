import { initializeApp } from "firebase-admin/app";
import { purgeDeletedWorkspaces } from "./scheduled/purge-deleted-workspaces";

initializeApp();

export { purgeDeletedWorkspaces };
