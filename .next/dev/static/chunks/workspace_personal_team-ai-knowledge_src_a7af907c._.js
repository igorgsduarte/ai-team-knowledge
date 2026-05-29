(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/workspace/personal/team-ai-knowledge/src/lib/firebase/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "firebaseClientApp",
    ()=>firebaseClientApp,
    "getFirebaseClientApp",
    ()=>getFirebaseClientApp,
    "getFirebaseClientAuth",
    ()=>getFirebaseClientAuth,
    "isFirebaseClientConfigured",
    ()=>isFirebaseClientConfigured
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/node_modules/.pnpm/next@16.0.2_@opentelemetry+api@1.9.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/node_modules/@firebase/app/dist/esm/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
;
;
function isFirebaseClientConfigured() {
    return Boolean(("TURBOPACK compile-time value", "AIzaSyCMe-spGpNrXDpZNxq8-OJIzpC_bgRlHsc") && ("TURBOPACK compile-time value", "team-ai-knowledge-app.firebaseapp.com") && ("TURBOPACK compile-time value", "team-ai-knowledge-app") && ("TURBOPACK compile-time value", "team-ai-knowledge-app.firebasestorage.app") && ("TURBOPACK compile-time value", "4802621617") && ("TURBOPACK compile-time value", "1:4802621617:web:4aa3bc953d5f4b20fdf290"));
}
function buildClientConfig() {
    return {
        apiKey: ("TURBOPACK compile-time value", "AIzaSyCMe-spGpNrXDpZNxq8-OJIzpC_bgRlHsc") ?? "",
        authDomain: ("TURBOPACK compile-time value", "team-ai-knowledge-app.firebaseapp.com") ?? "",
        projectId: ("TURBOPACK compile-time value", "team-ai-knowledge-app") ?? "",
        storageBucket: ("TURBOPACK compile-time value", "team-ai-knowledge-app.firebasestorage.app") ?? "",
        messagingSenderId: ("TURBOPACK compile-time value", "4802621617") ?? "",
        appId: ("TURBOPACK compile-time value", "1:4802621617:web:4aa3bc953d5f4b20fdf290") ?? "",
        measurementId: ("TURBOPACK compile-time value", "G-1BXCPS4YRD")
    };
}
function getFirebaseClientApp() {
    if (!isFirebaseClientConfigured()) {
        throw new Error("FIREBASE_CONFIG_MISSING: missing NEXT_PUBLIC_FIREBASE_*");
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApps"])().length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApp"])() : (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeApp"])(buildClientConfig());
}
const firebaseClientApp = isFirebaseClientConfigured() ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApps"])().length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApp"])() : (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeApp"])(buildClientConfig()) : null;
function getFirebaseClientAuth() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuth"])(getFirebaseClientApp());
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/workspace/personal/team-ai-knowledge/src/app/(auth)/sign-in/sign-in-form.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SignInForm",
    ()=>SignInForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/node_modules/.pnpm/next@16.0.2_@opentelemetry+api@1.9.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/node_modules/.pnpm/next@16.0.2_@opentelemetry+api@1.9.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/node_modules/.pnpm/next@16.0.2_@opentelemetry+api@1.9.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/node_modules/.pnpm/next@16.0.2_@opentelemetry+api@1.9.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/workspace/personal/team-ai-knowledge/src/lib/firebase/client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function writeAuthCookies(input) {
    const workspaceId = ("TURBOPACK compile-time value", "acme") || "default";
    const maxAge = 60 * 60 * 8;
    document.cookie = `tk_auth_token=${encodeURIComponent(input.token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
    document.cookie = `tk_user_id=${encodeURIComponent(input.userId)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
    document.cookie = `tk_workspace_id=${encodeURIComponent(workspaceId)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
    document.cookie = `tk_email=${encodeURIComponent(input.email || "")}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}
function SignInForm() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const credentials = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithEmailAndPassword"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$src$2f$lib$2f$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirebaseClientAuth"])(), email, password);
            const token = await credentials.user.getIdToken();
            writeAuthCookies({
                userId: credentials.user.uid,
                email: credentials.user.email,
                token
            });
            router.replace("/dashboard");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Falha ao autenticar.");
        } finally{
            setLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "space-y-4 rounded-lg border bg-white p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-xl font-semibold",
                children: "Entrar"
            }, void 0, false, {
                fileName: "[project]/workspace/personal/team-ai-knowledge/src/app/(auth)/sign-in/sign-in-form.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "text-sm font-medium",
                        htmlFor: "email",
                        children: "Email"
                    }, void 0, false, {
                        fileName: "[project]/workspace/personal/team-ai-knowledge/src/app/(auth)/sign-in/sign-in-form.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: "email",
                        type: "email",
                        value: email,
                        onChange: (e)=>setEmail(e.target.value),
                        className: "w-full rounded border px-3 py-2",
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/workspace/personal/team-ai-knowledge/src/app/(auth)/sign-in/sign-in-form.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/workspace/personal/team-ai-knowledge/src/app/(auth)/sign-in/sign-in-form.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "text-sm font-medium",
                        htmlFor: "password",
                        children: "Senha"
                    }, void 0, false, {
                        fileName: "[project]/workspace/personal/team-ai-knowledge/src/app/(auth)/sign-in/sign-in-form.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: "password",
                        type: "password",
                        value: password,
                        onChange: (e)=>setPassword(e.target.value),
                        className: "w-full rounded border px-3 py-2",
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/workspace/personal/team-ai-knowledge/src/app/(auth)/sign-in/sign-in-form.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/workspace/personal/team-ai-knowledge/src/app/(auth)/sign-in/sign-in-form.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-red-600",
                children: error
            }, void 0, false, {
                fileName: "[project]/workspace/personal/team-ai-knowledge/src/app/(auth)/sign-in/sign-in-form.tsx",
                lineNumber: 59,
                columnNumber: 16
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "submit",
                disabled: loading,
                className: "w-full rounded bg-black px-4 py-2 text-white disabled:opacity-70",
                children: loading ? "Entrando..." : "Entrar"
            }, void 0, false, {
                fileName: "[project]/workspace/personal/team-ai-knowledge/src/app/(auth)/sign-in/sign-in-form.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/workspace/personal/team-ai-knowledge/src/app/(auth)/sign-in/sign-in-form.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(SignInForm, "qLRAvULox2e5SIfxRJdviIkHCSA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$workspace$2f$personal$2f$team$2d$ai$2d$knowledge$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$2_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = SignInForm;
var _c;
__turbopack_context__.k.register(_c, "SignInForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=workspace_personal_team-ai-knowledge_src_a7af907c._.js.map