// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { imageRouter } from "./image";
import { postRouter } from "./post";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("image.", imageRouter)
  .merge("post.", postRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
