import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { contents } from "../../db/schema";
import { eq } from "drizzle-orm";

export const contentRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(contents);
  }),

  getByKey: publicQuery
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(contents)
        .where(eq(contents.key, input.key))
        .limit(1);
      return result[0] ?? null;
    }),

  create: adminQuery
    .input(
      z.object({
        key: z.string().min(1),
        title: z.string().min(1),
        body: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(contents).values({
        key: input.key,
        title: input.title,
        body: input.body ?? null,
      });
      const inserted = await db
        .select()
        .from(contents)
        .where(eq(contents.id, Number(result[0].insertId)))
        .limit(1);
      return inserted[0];
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        key: z.string().optional(),
        title: z.string().optional(),
        body: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const updateData: Record<string, unknown> = {};
      if (data.key !== undefined) updateData.key = data.key;
      if (data.title !== undefined) updateData.title = data.title;
      if (data.body !== undefined) updateData.body = data.body;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;

      await db.update(contents).set(updateData).where(eq(contents.id, id));
      const result = await db
        .select()
        .from(contents)
        .where(eq(contents.id, id))
        .limit(1);
      return result[0];
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(contents).where(eq(contents.id, input.id));
      return { success: true };
    }),
});
