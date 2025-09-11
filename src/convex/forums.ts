import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

// Get forum posts
export const getForumPosts = query({
  args: { 
    category: v.optional(v.string()),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const base = ctx.db.query("forumPosts");
    const posts = args.category
      ? await base
          .withIndex("by_category", (q: any) => q.eq("category", args.category!))
          .order("desc")
          .take(args.limit || 20)
      : await base.order("desc").take(args.limit || 20);
    
    // Get user info for each post
    const postsWithUsers = await Promise.all(
      posts.map(async (post) => {
        const user = await ctx.db.get(post.userId);
        return {
          ...post,
          author: {
            name: user?.name || "Anonymous",
            image: user?.image,
            role: user?.role,
          },
        };
      })
    );

    return postsWithUsers;
  },
});

// Create forum post
export const createForumPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    category: v.string(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const postId = await ctx.db.insert("forumPosts", {
      userId: user._id,
      title: args.title,
      content: args.content,
      category: args.category,
      tags: args.tags,
      likes: 0,
      views: 0,
      isPinned: false,
      isLocked: false,
    });

    return postId;
  },
});

// Get forum post with replies
export const getForumPost = query({
  args: { postId: v.id("forumPosts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) return null;

    // Get author info
    const author = await ctx.db.get(post.userId);
    
    // Get replies
    const replies = await ctx.db
      .query("forumReplies")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    // Get reply authors
    const repliesWithAuthors = await Promise.all(
      replies.map(async (reply) => {
        const replyAuthor = await ctx.db.get(reply.userId);
        return {
          ...reply,
          author: {
            name: replyAuthor?.name || "Anonymous",
            image: replyAuthor?.image,
            role: replyAuthor?.role,
          },
        };
      })
    );

    return {
      ...post,
      author: {
        name: author?.name || "Anonymous",
        image: author?.image,
        role: author?.role,
      },
      replies: repliesWithAuthors,
    };
  },
});

// Create forum reply
export const createForumReply = mutation({
  args: {
    postId: v.id("forumPosts"),
    content: v.string(),
    parentReplyId: v.optional(v.id("forumReplies")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const replyId = await ctx.db.insert("forumReplies", {
      postId: args.postId,
      userId: user._id,
      content: args.content,
      likes: 0,
      parentReplyId: args.parentReplyId,
    });

    return replyId;
  },
});
