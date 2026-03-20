import { eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, crmLeads, InsertCrmLead, CrmLead, youtubeCredentials, InsertYoutubeCredential, YoutubeCredential } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function upsertYoutubeCredential(cred: InsertYoutubeCredential): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(youtubeCredentials).values(cred).onDuplicateKeyUpdate({
    set: {
      accessToken: cred.accessToken,
      refreshToken: cred.refreshToken,
      expiryDate: cred.expiryDate,
      updatedAt: new Date(),
    }
  });
}

export async function getYoutubeCredentialByUserId(userId: number): Promise<YoutubeCredential | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(youtubeCredentials).where(eq(youtubeCredentials.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ── CRM Lead Helpers ──

export async function insertCrmLeads(leads: InsertCrmLead[]): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Insert in batches of 50 to avoid query size limits
  for (let i = 0; i < leads.length; i += 50) {
    const batch = leads.slice(i, i + 50);
    await db.insert(crmLeads).values(batch);
  }
}

export async function getCrmLeads(opts: {
  search?: string;
  status?: string;
  location?: string;
  limit?: number;
  offset?: number;
}): Promise<{ leads: CrmLead[]; total: number }> {
  const db = await getDb();
  if (!db) return { leads: [], total: 0 };

  const conditions: any[] = [];

  if (opts.search) {
    const term = `%${opts.search}%`;
    conditions.push(
      or(
        like(crmLeads.email, term),
        like(crmLeads.firstName, term),
        like(crmLeads.lastName, term),
        like(crmLeads.companyName, term),
        like(crmLeads.location, term),
      )
    );
  }

  if (opts.status && opts.status !== "all") {
    conditions.push(eq(crmLeads.status, opts.status as any));
  }

  if (opts.location && opts.location !== "all") {
    conditions.push(like(crmLeads.location, `%${opts.location}%`));
  }

  const whereClause = conditions.length > 0
    ? sql`${conditions.reduce((acc, cond, i) => i === 0 ? cond : sql`${acc} AND ${cond}`)}`
    : undefined;

  const limit = opts.limit || 25;
  const offset = opts.offset || 0;

  const [leads, countResult] = await Promise.all([
    whereClause
      ? db.select().from(crmLeads).where(whereClause).limit(limit).offset(offset).orderBy(crmLeads.id)
      : db.select().from(crmLeads).limit(limit).offset(offset).orderBy(crmLeads.id),
    whereClause
      ? db.select({ count: sql<number>`count(*)` }).from(crmLeads).where(whereClause)
      : db.select({ count: sql<number>`count(*)` }).from(crmLeads),
  ]);

  return { leads, total: Number(countResult[0]?.count ?? 0) };
}

export async function getCrmLeadById(id: number): Promise<CrmLead | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(crmLeads).where(eq(crmLeads.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateCrmLeadStatus(id: number, status: string, notes?: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const updateData: Record<string, any> = { status };
  if (notes !== undefined) updateData.notes = notes;
  if (status.includes("sent")) updateData.lastContactedAt = new Date();
  await db.update(crmLeads).set(updateData).where(eq(crmLeads.id, id));
}

export async function getCrmLocations(): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];
  const result = await db
    .selectDistinct({ location: crmLeads.location })
    .from(crmLeads)
    .where(sql`${crmLeads.location} IS NOT NULL AND ${crmLeads.location} != ''`);
  return result.map((r) => r.location!).sort();
}

export async function getCrmStats(): Promise<Record<string, number>> {
  const db = await getDb();
  if (!db) return {};
  const result = await db
    .select({ status: crmLeads.status, count: sql<number>`count(*)` })
    .from(crmLeads)
    .groupBy(crmLeads.status);
  const stats: Record<string, number> = {};
  for (const row of result) {
    stats[row.status] = Number(row.count);
  }
  return stats;
}
