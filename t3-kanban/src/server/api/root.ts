import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter } from "@/server/api/trpc";
import { KanbanRouter } from "@/server/api/routers/kanban";
import { TaskRouter } from "@/server/api/routers/task";
import { ColumnRouter } from "@/server/api/routers/columns";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  kanban: KanbanRouter,
  task: TaskRouter,
  column: ColumnRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
