import { query } from "./_generated/server";
import { v } from "convex/values";

// Get opportunities
export const getOpportunities = query({
  args: { 
    type: v.optional(v.string()),
    category: v.optional(v.string()),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("opportunities").withIndex("by_active", (q) => q.eq("isActive", true));
    
    const opportunities = await query.take(args.limit || 20);
    
    let filtered = opportunities;
    
    if (args.type) {
      filtered = filtered.filter(opp => opp.type === args.type);
    }
    
    if (args.category) {
      filtered = filtered.filter(opp => opp.category === args.category);
    }
    
    return filtered;
  },
});

// Get opportunity by ID
export const getOpportunity = query({
  args: { opportunityId: v.id("opportunities") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.opportunityId);
  },
});
