import { z } from "zod";
import type { Task } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const TaskRouter = createTRPCRouter({
  addTask: publicProcedure
    .input(
      z.object({
        title: z.string().optional(),
        taskContentText: z.string(), // Assuming you want to receive the text for the content
        columnId: z.string(),
        links: z.string().optional(), // Include if you want to pass links as well
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Changed from query to mutation since we are making changes to the database
      // Create the content first
      const contentData = await ctx.db.content.create({
        data: {
          text: input.taskContentText,
          links: input.links, // Only include this if you're accepting links input
          // You can add any additional fields required for the Content model here
        },
      });

      // Then create the task with a reference to the newly created content
      const taskData = await ctx.db.task.create({
        data: {
          title: input.title, // This is now optional
          contentId: contentData.id, // Use the ID from the created content
          columnId: input.columnId,
          // If there are any additional fields, add them here
        },
      });

      return taskData;
    }),

  updateTask: publicProcedure
    .input(
      z.object({
        id: z.string(), // This should be the ID of the task
        title: z.string().optional(), // Optional title update
        taskContentText: z.string().optional(), // Optional content text update
        links: z.string().optional(), // Optional links update
        // If you also need to update the columnId, uncomment the following line
        // columnId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // First, update the task's title if provided
      let taskUpdateData = {
        title: input.title,
        // If columnId is part of the input, include it in the update
        // ...(input.columnId && { columnId: input.columnId }),
      };

      // Fetch the current task with its associated contentId
      const task = await ctx.db.task.findUnique({
        where: { id: input.id },
        include: { taskContent: true }, // Include the task content
      });

      if (!task) {
        throw new Error("Task not found");
      }

      // Update the task if there are changes in title or columnId
      if (input.title /* || input.columnId */) {
        await ctx.db.task.update({
          where: { id: input.id },
          data: taskUpdateData,
        });
      }

      // Then update the associated content if there are changes
      if (input.taskContentText || input.links) {
        await ctx.db.content.update({
          where: { id: task.contentId ?? undefined }, // Use the correct content ID from the task
          data: {
            text: input.taskContentText, // Update text if provided
            links: input.links, // Update links if provided
            // Include other updates here if necessary
          },
        });
      }

      // Finally, return the updated task with its content
      const updatedTask = await ctx.db.task.findUnique({
        where: { id: input.id },
        include: { taskContent: true },
      });

      return updatedTask;
    }),

  deleteTask: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Changed from query to mutation
      const taskData = await ctx.db.task.delete({
        where: { id: input.id },
      });
      const contentData = await ctx.db.content.delete({
        where: { id: taskData.contentId ?? undefined },
      });
      return taskData;
    }),

  // Add a new procedure to update the task
});
