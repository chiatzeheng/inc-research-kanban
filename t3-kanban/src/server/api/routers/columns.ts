import { z } from "zod";
import type { Column } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const ColumnRouter = createTRPCRouter({
  addColumn: publicProcedure
    .input(
      z.object({
        title: z.string(),
        kanbanId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Changed from query to mutation
      const columnData = await ctx.db.column.create({
        data: {
          title: input.title,
          kanbanId: input.kanbanId,
        },
      });
      return columnData;
    }),

  updateColumn: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Changed from query to mutation
      const columnData = await ctx.db.column.update({
        where: { id: input.id },
        data: {
          title: input.title,
        },
      });
      return columnData;
    }),

  deleteColumn: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Changed from query to mutation

      // const columnData = await ctx.db.column.delete({
      //   where: { id: input.id },
      //   include: {
      //     tasks: true, // Include tasks to fetch them
      //   },
      // });

      // return columnData;

      const tasks = await ctx.db.task.findMany({
        where: { columnId: input.id },
      });

      // Then, delete all the tasks
      await Promise.all(
        tasks.map((task) => ctx.db.task.delete({ where: { id: task.id } })),
      );

      // Finally, delete the column
      const deletedColumn = await ctx.db.column.delete({
        where: { id: input.id },
      });

      return deletedColumn;
    }),
});
