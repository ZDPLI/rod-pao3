import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../../db/connection";
import { orders, orderItems } from "../../db/schema";

export const orderRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        type: z.enum(["request", "order"]).default("request"),
        clientName: z.string().min(1),
        clientPhone: z.string().min(1),
        clientEmail: z.string().email().optional(),
        organization: z.string().optional(),
        inn: z.string().optional(),
        comment: z.string().optional(),
        items: z.array(
          z.object({
            serviceId: z.number().optional(),
            serviceName: z.string().min(1),
            price: z.number().default(0),
            quantity: z.number().default(1),
          })
        ).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const totalPrice = input.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;

      const [order] = await db
        .insert(orders)
        .values({
          type: input.type,
          clientName: input.clientName,
          clientPhone: input.clientPhone,
          clientEmail: input.clientEmail,
          organization: input.organization,
          inn: input.inn,
          comment: input.comment,
          totalPrice,
        })
        .returning();

      if (input.items && input.items.length > 0) {
        await db.insert(orderItems).values(
          input.items.map((item) => ({
            orderId: order.id,
            serviceId: item.serviceId,
            serviceName: item.serviceName,
            price: item.price,
            quantity: item.quantity,
          }))
        );
      }

      return order;
    }),

  list: publicQuery
    .input(
      z.object({
        status: z.enum(["new", "processing", "completed", "cancelled"]).optional(),
        type: z.enum(["request", "order"]).optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const where = [];
      if (input?.status) where.push(eq(orders.status, input.status));
      if (input?.type) where.push(eq(orders.type, input.type));

      const list = await db
        .select()
        .from(orders)
        .where(where.length > 0 ? where[0] : undefined)
        .orderBy(desc(orders.createdAt))
        .limit(input?.limit || 50)
        .offset(input?.offset || 0);

      const [{ count }] = await db
        .select({ count: db.$count(orders) })
        .from(orders);

      return { list, total: count };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id));

      if (!order) return null;

      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, input.id));

      return { ...order, items };
    }),

  updateStatus: publicQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "processing", "completed", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [updated] = await db
        .update(orders)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(orders.id, input.id))
        .returning();
      return updated;
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(orderItems).where(eq(orderItems.orderId, input.id));
      await db.delete(orders).where(eq(orders.id, input.id));
      return { success: true };
    }),
});
