import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

// Get all active challenges
export const getChallenges = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let query = ctx.db.query("challenges").withIndex("by_active", (q) => q.eq("isActive", true));
    
    const challenges = await query.collect();
    
    if (args.category) {
      return challenges.filter(challenge => challenge.category === args.category);
    }
    
    return challenges;
  },
});

// Get challenge by ID
export const getChallenge = query({
  args: { challengeId: v.id("challenges") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.challengeId);
  },
});

// Submit challenge
export const submitChallenge = mutation({
  args: {
    challengeId: v.id("challenges"),
    title: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    metadata: v.optional(v.object({
      location: v.optional(v.string()),
      weather: v.optional(v.string()),
      plantSpecies: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const challenge = await ctx.db.get(args.challengeId);
    if (!challenge) throw new Error("Challenge not found");

    // Create submission
    const submissionId = await ctx.db.insert("submissions", {
      userId: user._id,
      challengeId: args.challengeId,
      title: args.title,
      description: args.description,
      imageUrl: args.imageUrl,
      videoUrl: args.videoUrl,
      status: "pending",
      metadata: args.metadata,
    });

    // If doesn't require verification, auto-approve and award points
    if (!challenge.requiresVerification) {
      await ctx.db.patch(submissionId, {
        status: "approved",
        reviewedAt: new Date().toISOString(),
        pointsEarned: challenge.points,
      });

      // Award points to user
      const currentPoints = user.totalPoints || 0;
      await ctx.db.patch(user._id, {
        totalPoints: currentPoints + challenge.points,
      });

      return { submissionId, pointsEarned: challenge.points, autoApproved: true };
    }

    return { submissionId, pointsEarned: 0, autoApproved: false };
  },
});

// Get user submissions
export const getUserSubmissions = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("submissions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

// Get leaderboard
export const getLeaderboard = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_points")
      .order("desc")
      .take(args.limit || 10);

    return users.map((user, index) => ({
      rank: index + 1,
      name: user.name || "Anonymous",
      school: user.school,
      totalPoints: user.totalPoints || 0,
      level: user.level || 1,
    }));
  },
});
