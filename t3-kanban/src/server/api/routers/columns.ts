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
      const columnData = await ctx.db.column.delete({
        where: { id: input.id },
      });
      return columnData;
    }),
});
