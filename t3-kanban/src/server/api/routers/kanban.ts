import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const KanbanRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const kanbanData = await ctx.db.kanban.findUnique({
        where: { id: input.id },
        include: {
          columns: {
            select: {
              id: true,
              title: true,
              createdAt: true,
              updatedAt: true,
              kanbanId: true,
              tasks: {
                select: {
                  id: true,
                  title: true,
                  contentId: true,
                  createdAt: true,
                  updatedAt: true,
                  columnId: true,
                  taskContent: {
                    select: {
                      id: true,
                      text: true,
                      links: true,
                    },
                  },
                  // Here we can add other fields as needed, but for now, we are following the schema as is.
                },
              },
            },
          },
          // We can include other fields from the Kanban model if necessary
          // For example:
          // id: true,
          // title: true,
          // createdAt: true,
          // updatedAt: true,
          // We're excluding the 'owner' field as it's commented out in your schema
        },
      });
      if (!kanbanData) throw new Error("Kanban not found");

      return kanbanData;
    }),
});
