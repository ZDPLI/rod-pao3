import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { services, categories } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export const serviceRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          categoryId: z.number().optional(),
          categorySlug: z.string().optional(),
          isActive: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();

      if (input?.categorySlug) {
        const cat = await db
          .select()
          .from(categories)
          .where(eq(categories.slug, input.categorySlug))
          .limit(1);
        if (!cat[0]) return [];
        return db
          .select()
          .from(services)
          .where(eq(services.categoryId, cat[0].id))
          .orderBy(services.sortOrder);
      }

      if (input?.categoryId) {
        const conditions = [eq(services.categoryId, input.categoryId)];
        if (input.isActive !== undefined) {
          conditions.push(eq(services.isActive, input.isActive));
        }
        return db
          .select()
          .from(services)
          .where(and(...conditions))
          .orderBy(services.sortOrder);
      }

      if (input?.isActive !== undefined) {
        return db
          .select()
          .from(services)
          .where(eq(services.isActive, input.isActive))
          .orderBy(services.sortOrder);
      }

      return db.select().from(services).orderBy(services.sortOrder);
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(services)
        .where(eq(services.slug, input.slug))
        .limit(1);
      return result[0] ?? null;
    }),

  create: adminQuery
    .input(
      z.object({
        categoryId: z.number(),
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        price: z.string().optional(),
        duration: z.string().optional(),
        requirements: z.string().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(services).values({
        categoryId: input.categoryId,
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        shortDescription: input.shortDescription ?? null,
        price: input.price ?? null,
        duration: input.duration ?? null,
        requirements: input.requirements ?? null,
        sortOrder: input.sortOrder ?? 0,
      });
      const inserted = await db
        .select()
        .from(services)
        .where(eq(services.id, Number(result[0].insertId)))
        .limit(1);
      return inserted[0];
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        categoryId: z.number().optional(),
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        price: z.string().optional(),
        duration: z.string().optional(),
        requirements: z.string().optional(),
        isActive: z.boolean().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const updateData: Record<string, unknown> = {};
      if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
      if (data.name !== undefined) updateData.name = data.name;
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
      if (data.price !== undefined) updateData.price = data.price;
      if (data.duration !== undefined) updateData.duration = data.duration;
      if (data.requirements !== undefined) updateData.requirements = data.requirements;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;
      if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

      await db.update(services).set(updateData).where(eq(services.id, id));
      const result = await db
        .select()
        .from(services)
        .where(eq(services.id, id))
        .limit(1);
      return result[0];
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(services).where(eq(services.id, input.id));
      return { success: true };
    }),
});
