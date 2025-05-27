
// Files Imports
import * as configure from "@api/configure";
import * as API_000 from "@api/root/src/api/buildings/GET.js";
import * as API_001 from "@api/root/src/api/buildings/[id]/GET.js";

// Public RESTful API Methods and Paths
// This section describes the available HTTP methods and their corresponding endpoints (paths).
// GET /api/buildings/        src/api/buildings/GET.js
// GET /api/buildings/:id/    src/api/buildings/[id]/GET.js

const internal  = [
  API_000.default  && { cb: API_000.default , method: "get" , route: "/buildings/"     , url: "/api/buildings/"     , source: "src/api/buildings/GET.js"      },
  API_001.default  && { cb: API_001.default , method: "get" , route: "/buildings/:id/" , url: "/api/buildings/:id/" , source: "src/api/buildings/[id]/GET.js" }
].filter(it => it);

export const routers = internal.map((it) => {
  const { method, route, url, source } = it;
  return { method, url, route, source };
});

export const endpoints = internal.map(
  (it) => it.method?.toUpperCase() + "\t" + it.url
);

export const applyRouters = (applyRouter) => {
  internal.forEach((it) => {
    it.cb = configure.callbackBefore?.(it.cb, it) || it.cb;
    applyRouter(it);
  });
};

