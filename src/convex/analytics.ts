import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

// Track analytics event
export const trackEvent = mutation({
  args: {
    eventType: v.string(),
    eventData: v.object({
      action: v.string(),
      category: v.optional(v.string()),
      value: v.optional(v.number()),
      metadata: v.optional(v.record(v.string(), v.any())),
    }),
    sessionId: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    
    await ctx.db.insert("analyticsEvents", {
      userId: user?._id,
      eventType: args.eventType,
      eventData: args.eventData,
      sessionId: args.sessionId,
      userAgent: args.userAgent,
    });
  },
});

// Get dashboard analytics
export const getDashboardAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Get total users by role
    const allUsers = await ctx.db.query("users").collect();
    const usersByRole = allUsers.reduce((acc, user) => {
      const role = user.role || "student";
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get total submissions by status
    const allSubmissions = await ctx.db.query("submissions").collect();
    const submissionsByStatus = allSubmissions.reduce((acc, submission) => {
      acc[submission.status] = (acc[submission.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get recent activity
    const recentEvents = await ctx.db
      .query("analyticsEvents")
      .order("desc")
      .take(10);

    return {
      totalUsers: allUsers.length,
      usersByRole,
      totalSubmissions: allSubmissions.length,
      submissionsByStatus,
      recentActivity: recentEvents,
    };
  },
});
