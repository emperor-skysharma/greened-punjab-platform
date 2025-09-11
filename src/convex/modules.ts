import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

// Get all published modules
export const getModules = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("modules")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .order("asc")
      .collect();
  },
});

// Get module by ID
export const getModule = query({
  args: { moduleId: v.id("modules") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.moduleId);
  },
});

// Get user progress for modules
export const getUserProgress = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

// Complete a module
export const completeModule = mutation({
  args: { 
    moduleId: v.id("modules"),
    timeSpent: v.number(),
    score: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const module = await ctx.db.get(args.moduleId);
    if (!module) throw new Error("Module not found");

    // Check if already completed
    const existingProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_user_and_module", (q) => 
        q.eq("userId", user._id).eq("moduleId", args.moduleId)
      )
      .unique();

    if (existingProgress) {
      // Update existing progress
      await ctx.db.patch(existingProgress._id, {
        completed: true,
        completedAt: new Date().toISOString(),
        timeSpent: args.timeSpent,
        score: args.score,
      });
    } else {
      // Create new progress record
      await ctx.db.insert("userProgress", {
        userId: user._id,
        moduleId: args.moduleId,
        completed: true,
        completedAt: new Date().toISOString(),
        timeSpent: args.timeSpent,
        score: args.score,
      });
    }

    // Award points to user
    const currentPoints = user.totalPoints || 0;
    await ctx.db.patch(user._id, {
      totalPoints: currentPoints + module.points,
    });

    // Check for badges
    await checkAndAwardBadges(ctx, user._id, currentPoints + module.points);

    return { success: true, pointsEarned: module.points };
  },
});

// Helper function to check and award badges
async function checkAndAwardBadges(ctx: any, userId: any, totalPoints: number) {
  const badges = [
    { type: "bronze", threshold: 100, title: "Bronze Explorer", description: "Earned 100 points" },
    { type: "silver", threshold: 250, title: "Silver Guardian", description: "Earned 250 points" },
    { type: "gold", threshold: 500, title: "Gold Protector", description: "Earned 500 points" },
    { type: "platinum", threshold: 1000, title: "Platinum Champion", description: "Earned 1000 points" },
  ];

  for (const badge of badges) {
    if (totalPoints >= badge.threshold) {
      // Check if user already has this badge
      const existingBadge = await ctx.db
        .query("userBadges")
        .withIndex("by_user", (q: any) => q.eq("userId", userId))
        .filter((q: any) => q.eq(q.field("badgeType"), badge.type))
        .unique();

      if (!existingBadge) {
        await ctx.db.insert("userBadges", {
          userId,
          badgeType: badge.type as any,
          title: badge.title,
          description: badge.description,
          earnedAt: new Date().toISOString(),
          criteria: `Earn ${badge.threshold} points`,
        });
      }
    }
  }
}
