module.exports = [
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/firebase-admin/app [external] (firebase-admin/app, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("firebase-admin/app");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/firebase-admin/auth [external] (firebase-admin/auth, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("firebase-admin/auth");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("firebase-admin/firestore");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/firebase-admin/storage [external] (firebase-admin/storage, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("firebase-admin/storage");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/workspace/personal/team-ai-knowledge/src/lib/firebase/admin.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "firebaseAdmin",
    ()=>firebaseAdmin,
    "getFirebaseAdminApp",
    ()=>getFirebaseAdminApp,
    "getFirebaseAdminAuth",
    ()=>getFirebaseAdminAuth,
    "getFirebaseAdminDb",
    ()=>getFirebaseAdminDb,
    "getFirebaseAdminStorage",
    ()=>getFirebaseAdminStorage,
    "isFirebaseAdminConfigured",
    ()=>isFirebaseAdminConfigured
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase-admin/app [external] (firebase-admin/app, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase-admin/auth [external] (firebase-admin/auth, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$storage__$5b$external$5d$__$28$firebase$2d$admin$2f$storage$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase-admin/storage [external] (firebase-admin/storage, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$storage__$5b$external$5d$__$28$firebase$2d$admin$2f$storage$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$storage__$5b$external$5d$__$28$firebase$2d$admin$2f$storage$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
function getRequiredServerEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`FIREBASE_CONFIG_MISSING: missing ${name}`);
    }
    return value;
}
function isFirebaseAdminConfigured() {
    return Boolean((process.env.FIREBASE_PROJECT_ID || ("TURBOPACK compile-time value", "team-ai-knowledge-app")) && (process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY));
}
function getProjectId() {
    return process.env.FIREBASE_PROJECT_ID ?? getRequiredServerEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
}
function readServiceAccountJson() {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!raw) {
        return null;
    }
    const value = raw.trim();
    const json = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["existsSync"])(value) ? (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["readFileSync"])(value, "utf8") : value;
    return JSON.parse(json);
}
function getCredential(projectId) {
    const serviceAccount = readServiceAccountJson();
    if (serviceAccount) {
        return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["cert"])({
            projectId: serviceAccount.project_id ?? serviceAccount.projectId ?? projectId,
            clientEmail: serviceAccount.client_email ?? serviceAccount.clientEmail,
            privateKey: String(serviceAccount.private_key ?? serviceAccount.privateKey ?? "").replace(/\\n/g, "\n")
        });
    }
    if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["cert"])({
            projectId,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        });
    }
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["applicationDefault"])();
}
function getFirebaseAdminApp() {
    if ((0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["getApps"])().length) {
        return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["getApps"])()[0];
    }
    const projectId = getProjectId();
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["initializeApp"])({
        credential: getCredential(projectId),
        projectId,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? ("TURBOPACK compile-time value", "team-ai-knowledge-app.firebasestorage.app")
    });
}
function getFirebaseAdminAuth() {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$29$__["getAuth"])(getFirebaseAdminApp());
}
function getFirebaseAdminDb() {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["getFirestore"])(getFirebaseAdminApp());
}
function getFirebaseAdminStorage() {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$storage__$5b$external$5d$__$28$firebase$2d$admin$2f$storage$2c$__esm_import$29$__["getStorage"])(getFirebaseAdminApp());
}
const firebaseAdmin = {
    projectId: process.env.FIREBASE_PROJECT_ID ?? ("TURBOPACK compile-time value", "team-ai-knowledge-app") ?? "unknown-project",
    ready: isFirebaseAdminConfigured()
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/workspace/personal/team-ai-knowledge/src/lib/firebase/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "getAuthContext",
    ()=>getAuthContext,
    "requireAuthContext",
    ()=>requireAuthContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/node_modules/.pnpm/next@16.0.2_@opentelemetry+api@1.9.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/src/lib/firebase/admin.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function getAuthContext() {
    const jar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const workspaceId = jar.get("tk_workspace_id")?.value;
    if (!workspaceId) {
        return null;
    }
    const sessionCookie = jar.get("__session")?.value;
    if (sessionCookie && (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isFirebaseAdminConfigured"])()) {
        try {
            const decoded = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFirebaseAdminAuth"])().verifySessionCookie(sessionCookie, true);
            return {
                userId: decoded.uid,
                workspaceId,
                email: decoded.email
            };
        } catch  {
            return null;
        }
    }
    const token = jar.get("tk_auth_token")?.value;
    if (token && (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isFirebaseAdminConfigured"])()) {
        try {
            const decoded = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFirebaseAdminAuth"])().verifyIdToken(token);
            return {
                userId: decoded.uid,
                workspaceId,
                email: decoded.email
            };
        } catch  {
            return null;
        }
    }
    const userId = jar.get("tk_user_id")?.value;
    if (!userId) {
        return null;
    }
    return {
        userId,
        workspaceId,
        email: jar.get("tk_email")?.value
    };
}
async function requireAuthContext() {
    const auth = await getAuthContext();
    if (!auth) {
        throw new Error("UNAUTHENTICATED");
    }
    return auth;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/workspace/personal/team-ai-knowledge/src/lib/firebase/firestore.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "firestoreCollections",
    ()=>firestoreCollections,
    "getFirestoreDb",
    ()=>getFirestoreDb
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/src/lib/firebase/admin.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
function getFirestoreDb() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFirebaseAdminDb"])();
}
const firestoreCollections = {
    users: "users",
    workspaces: "workspaces",
    memberships: "memberships",
    boards: "boards",
    knowledge: "knowledge",
    skills: "skills",
    comments: "comments",
    files: "files",
    agents: "agents",
    mcpKeys: "mcp_keys",
    mcpWorkspaceSettings: "mcp_workspace_settings"
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/workspace/personal/team-ai-knowledge/src/lib/firebase/storage.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "buildStoragePath",
    ()=>buildStoragePath,
    "readWorkspaceFile",
    ()=>readWorkspaceFile,
    "uploadWorkspaceFile",
    ()=>uploadWorkspaceFile
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/src/lib/firebase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/src/lib/firebase/firestore.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
function buildStoragePath(workspaceId, entityType, entityId, version) {
    return `workspaces/${workspaceId}/${entityType}/${entityId}/v${version}.md`;
}
async function uploadWorkspaceFile(input) {
    const existing = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFirestoreDb"])().collection(__TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreCollections"].files).where("workspaceId", "==", input.workspaceId).where("entityType", "==", input.entityType).where("entityId", "==", input.entityId).orderBy("version", "desc").limit(1).get();
    const lastVersion = existing.empty ? 0 : Number(existing.docs[0].data().version ?? 0);
    const version = lastVersion + 1;
    const path = buildStoragePath(input.workspaceId, input.entityType, input.entityId, version);
    const bucket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFirebaseAdminStorage"])().bucket();
    await bucket.file(path).save(input.content, {
        contentType: input.contentType ?? "text/markdown"
    });
    const item = {
        id: crypto.randomUUID(),
        workspaceId: input.workspaceId,
        entityType: input.entityType,
        entityId: input.entityId,
        path,
        version,
        authorId: input.authorId,
        contentHash: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["createHash"])("sha256").update(input.content).digest("hex"),
        contentType: input.contentType ?? "text/markdown",
        createdAt: new Date().toISOString()
    };
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFirestoreDb"])().collection(__TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreCollections"].files).doc(item.id).set(item);
    return item;
}
async function readWorkspaceFile(path) {
    const bucket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFirebaseAdminStorage"])().bucket();
    const file = bucket.file(path);
    const [exists] = await file.exists();
    if (!exists) {
        return null;
    }
    const [buffer] = await file.download();
    return buffer.toString("utf8");
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/workspace/personal/team-ai-knowledge/src/lib/repositories/knowledge-repository.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "knowledgeRepository",
    ()=>knowledgeRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/src/lib/firebase/firestore.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const knowledgeRepository = {
    async list (workspaceId) {
        const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFirestoreDb"])().collection(__TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreCollections"].knowledge).where("workspaceId", "==", workspaceId).get();
        return snapshot.docs.map((doc)=>doc.data()).sort((a, b)=>b.createdAt.localeCompare(a.createdAt));
    },
    async get (workspaceId, id) {
        const doc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFirestoreDb"])().collection(__TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreCollections"].knowledge).doc(id).get();
        if (!doc.exists) {
            return null;
        }
        const item = doc.data();
        return item.workspaceId === workspaceId ? item : null;
    },
    async create (workspaceId, input) {
        const now = new Date().toISOString();
        const item = {
            id: crypto.randomUUID(),
            workspaceId,
            createdAt: now,
            updatedAt: now,
            ...input
        };
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFirestoreDb"])().collection(__TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$firestore$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreCollections"].knowledge).doc(item.id).set(item);
        return item;
    }
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/workspace/personal/team-ai-knowledge/src/app/actions/knowledge.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/* __next_internal_action_entry_do_not_use__ [{"40843c61635c23708bc55fdbceaa864ac017a578de":"createKnowledge"},"",""] */ __turbopack_context__.s([
    "createKnowledge",
    ()=>createKnowledge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/node_modules/.pnpm/next@16.0.2_@opentelemetry+api@1.9.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/node_modules/.pnpm/next@16.0.2_@opentelemetry+api@1.9.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/src/lib/firebase/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$storage$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/src/lib/firebase/storage.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$repositories$2f$knowledge$2d$repository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/src/lib/repositories/knowledge-repository.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/node_modules/.pnpm/next@16.0.2_@opentelemetry+api@1.9.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$storage$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$repositories$2f$knowledge$2d$repository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$storage$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$repositories$2f$knowledge$2d$repository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
async function createKnowledge(formData) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAuthContext"])();
    const item = await __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$repositories$2f$knowledge$2d$repository$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["knowledgeRepository"].create(auth.workspaceId, {
        title: String(formData.get("title") || "Untitled"),
        body: String(formData.get("body") || ""),
        tags: [],
        createdBy: auth.userId
    });
    const file = formData.get("fileContent");
    if (typeof file === "string" && file.length) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$storage$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uploadWorkspaceFile"])({
            workspaceId: auth.workspaceId,
            entityType: "knowledge",
            entityId: item.id,
            content: file,
            authorId: auth.userId
        });
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/knowledge");
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createKnowledge
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createKnowledge, "40843c61635c23708bc55fdbceaa864ac017a578de", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/workspace/personal/team-ai-knowledge/.next-internal/server/app/(app)/knowledge/page/actions.js { ACTIONS_MODULE0 => \"[project]/workspace/personal/team-ai-knowledge/src/app/actions/knowledge.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$app$2f$actions$2f$knowledge$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/src/app/actions/knowledge.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$app$2f$actions$2f$knowledge$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$app$2f$actions$2f$knowledge$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/workspace/personal/team-ai-knowledge/.next-internal/server/app/(app)/knowledge/page/actions.js { ACTIONS_MODULE0 => \"[project]/workspace/personal/team-ai-knowledge/src/app/actions/knowledge.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "40843c61635c23708bc55fdbceaa864ac017a578de",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$app$2f$actions$2f$knowledge$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createKnowledge"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f2e$next$2d$internal$2f$server$2f$app$2f28$app$292f$knowledge$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$app$2f$actions$2f$knowledge$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/workspace/personal/team-ai-knowledge/.next-internal/server/app/(app)/knowledge/page/actions.js { ACTIONS_MODULE0 => "[project]/workspace/personal/team-ai-knowledge/src/app/actions/knowledge.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$app$2f$actions$2f$knowledge$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/src/app/actions/knowledge.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f2e$next$2d$internal$2f$server$2f$app$2f28$app$292f$knowledge$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$app$2f$actions$2f$knowledge$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$app$2f$actions$2f$knowledge$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f2e$next$2d$internal$2f$server$2f$app$2f28$app$292f$knowledge$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$app$2f$actions$2f$knowledge$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$app$2f$actions$2f$knowledge$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2465b7c9._.js.map