import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// User roles for the educational platform
export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher", 
  STUDENT: "student",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.TEACHER),
  v.literal(ROLES.STUDENT),
);
export type Role = Infer<typeof roleValidator>;

// Badge types for gamification
export const BADGE_TYPES = {
  BRONZE: "bronze",
  SILVER: "silver",
  GOLD: "gold",
  PLATINUM: "platinum",
  ECO_WARRIOR: "eco_warrior",
  QUIZ_MASTER: "quiz_master",
  COMMUNITY_LEADER: "community_leader",
} as const;

export const badgeTypeValidator = v.union(
  v.literal(BADGE_TYPES.BRONZE),
  v.literal(BADGE_TYPES.SILVER),
  v.literal(BADGE_TYPES.GOLD),
  v.literal(BADGE_TYPES.PLATINUM),
  v.literal(BADGE_TYPES.ECO_WARRIOR),
  v.literal(BADGE_TYPES.QUIZ_MASTER),
  v.literal(BADGE_TYPES.COMMUNITY_LEADER),
);

// Challenge types
export const CHALLENGE_TYPES = {
  QUIZ: "quiz",
  ECO_TASK: "eco_task",
  PROJECT: "project",
  COMMUNITY: "community",
} as const;

export const challengeTypeValidator = v.union(
  v.literal(CHALLENGE_TYPES.QUIZ),
  v.literal(CHALLENGE_TYPES.ECO_TASK),
  v.literal(CHALLENGE_TYPES.PROJECT),
  v.literal(CHALLENGE_TYPES.COMMUNITY),
);

// Submission status
export const SUBMISSION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  FLAGGED: "flagged",
} as const;

export const submissionStatusValidator = v.union(
  v.literal(SUBMISSION_STATUS.PENDING),
  v.literal(SUBMISSION_STATUS.APPROVED),
  v.literal(SUBMISSION_STATUS.REJECTED),
  v.literal(SUBMISSION_STATUS.FLAGGED),
);

const schema = defineSchema(
  {
    ...authTables,

    // Enhanced users table
    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
      
      // Educational profile fields
      school: v.optional(v.string()),
      grade: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      language: v.optional(v.string()), // "en" or "pa"
      
      // Gamification fields
      totalPoints: v.optional(v.number()),
      level: v.optional(v.number()),
      streak: v.optional(v.number()),
      lastActiveDate: v.optional(v.string()),
      
      // Profile completion
      profileCompleted: v.optional(v.boolean()),
      bio: v.optional(v.string()),
      interests: v.optional(v.array(v.string())),

      // Added: account type and verification fields
      accountType: v.optional(
        v.union(
          v.literal("school_admin"),
          v.literal("student"),
          v.literal("ngo_admin"),
          v.literal("citizen")
        )
      ),
      verified: v.optional(v.boolean()),
      verifiedBy: v.optional(v.id("users")), // verifier userId
      verifiedByOrg: v.optional(v.string()), // org/school/NGO name
      verificationRole: v.optional(
        v.union(
          v.literal("school"),
          v.literal("ngo")
        )
      ),
    }).index("email", ["email"])
      .index("by_role", ["role"])
      .index("by_school", ["school"])
      .index("by_points", ["totalPoints"]),

    // Learning modules
    modules: defineTable({
      title: v.string(),
      titlePunjabi: v.optional(v.string()),
      description: v.string(),
      descriptionPunjabi: v.optional(v.string()),
      content: v.string(),
      contentPunjabi: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
      difficulty: v.string(), // "beginner", "intermediate", "advanced"
      estimatedTime: v.number(), // in minutes
      points: v.number(),
      category: v.string(),
      isPublished: v.boolean(),
      order: v.number(),
    }).index("by_category", ["category"])
      .index("by_difficulty", ["difficulty"])
      .index("by_published", ["isPublished"]),

    // Quizzes
    quizzes: defineTable({
      moduleId: v.id("modules"),
      title: v.string(),
      titlePunjabi: v.optional(v.string()),
      questions: v.array(v.object({
        question: v.string(),
        questionPunjabi: v.optional(v.string()),
        options: v.array(v.string()),
        optionsPunjabi: v.optional(v.array(v.string())),
        correctAnswer: v.number(),
        explanation: v.optional(v.string()),
        explanationPunjabi: v.optional(v.string()),
      })),
      timeLimit: v.optional(v.number()), // in seconds
      passingScore: v.number(), // percentage
      points: v.number(),
    }).index("by_module", ["moduleId"]),

    // Challenges/Tasks
    challenges: defineTable({
      title: v.string(),
      titlePunjabi: v.optional(v.string()),
      description: v.string(),
      descriptionPunjabi: v.optional(v.string()),
      type: challengeTypeValidator,
      category: v.string(),
      difficulty: v.string(),
      points: v.number(),
      imageUrl: v.optional(v.string()),
      instructions: v.array(v.string()),
      instructionsPunjabi: v.optional(v.array(v.string())),
      isActive: v.boolean(),
      startDate: v.optional(v.string()),
      endDate: v.optional(v.string()),
      maxParticipants: v.optional(v.number()),
      requiresVerification: v.boolean(),
    }).index("by_type", ["type"])
      .index("by_category", ["category"])
      .index("by_active", ["isActive"]),

    // User progress on modules
    userProgress: defineTable({
      userId: v.id("users"),
      moduleId: v.id("modules"),
      completed: v.boolean(),
      completedAt: v.optional(v.string()),
      timeSpent: v.optional(v.number()), // in seconds
      score: v.optional(v.number()),
    }).index("by_user", ["userId"])
      .index("by_module", ["moduleId"])
      .index("by_user_and_module", ["userId", "moduleId"]),

    // Quiz attempts
    quizAttempts: defineTable({
      userId: v.id("users"),
      quizId: v.id("quizzes"),
      moduleId: v.id("modules"),
      score: v.number(),
      totalQuestions: v.number(),
      correctAnswers: v.number(),
      timeSpent: v.number(),
      answers: v.array(v.object({
        questionIndex: v.number(),
        selectedAnswer: v.number(),
        isCorrect: v.boolean(),
      })),
      pointsEarned: v.number(),
    }).index("by_user", ["userId"])
      .index("by_quiz", ["quizId"])
      .index("by_user_and_quiz", ["userId", "quizId"]),

    // Challenge submissions
    submissions: defineTable({
      userId: v.id("users"),
      challengeId: v.id("challenges"),
      title: v.string(),
      description: v.string(),
      imageUrl: v.optional(v.string()),
      videoUrl: v.optional(v.string()),
      status: submissionStatusValidator,
      reviewedBy: v.optional(v.id("users")),
      reviewedAt: v.optional(v.string()),
      reviewNotes: v.optional(v.string()),
      pointsEarned: v.optional(v.number()),
      aiVerificationScore: v.optional(v.number()),
      metadata: v.optional(v.object({
        location: v.optional(v.string()),
        weather: v.optional(v.string()),
        plantSpecies: v.optional(v.string()),
      })),
    }).index("by_user", ["userId"])
      .index("by_challenge", ["challengeId"])
      .index("by_status", ["status"])
      .index("by_reviewer", ["reviewedBy"]),

    // User badges
    userBadges: defineTable({
      userId: v.id("users"),
      badgeType: badgeTypeValidator,
      title: v.string(),
      description: v.string(),
      imageUrl: v.optional(v.string()),
      earnedAt: v.string(),
      criteria: v.string(),
    }).index("by_user", ["userId"])
      .index("by_badge_type", ["badgeType"]),

    // Forum posts
    forumPosts: defineTable({
      userId: v.id("users"),
      title: v.string(),
      content: v.string(),
      category: v.string(),
      tags: v.optional(v.array(v.string())),
      likes: v.optional(v.number()),
      views: v.optional(v.number()),
      isPinned: v.optional(v.boolean()),
      isLocked: v.optional(v.boolean()),
    }).index("by_user", ["userId"])
      .index("by_category", ["category"])
      .index("by_pinned", ["isPinned"]),

    // Forum replies
    forumReplies: defineTable({
      postId: v.id("forumPosts"),
      userId: v.id("users"),
      content: v.string(),
      likes: v.optional(v.number()),
      parentReplyId: v.optional(v.id("forumReplies")),
    }).index("by_post", ["postId"])
      .index("by_user", ["userId"])
      .index("by_parent", ["parentReplyId"]),

    // Internships/Opportunities
    opportunities: defineTable({
      title: v.string(),
      titlePunjabi: v.optional(v.string()),
      description: v.string(),
      descriptionPunjabi: v.optional(v.string()),
      organization: v.string(),
      location: v.string(),
      type: v.string(), // "internship", "volunteer", "job", "scholarship"
      category: v.string(),
      requirements: v.array(v.string()),
      applicationUrl: v.optional(v.string()),
      deadline: v.optional(v.string()),
      isActive: v.boolean(),
      imageUrl: v.optional(v.string()),
      contactEmail: v.optional(v.string()),
    }).index("by_type", ["type"])
      .index("by_category", ["category"])
      .index("by_active", ["isActive"]),

    // User certifications
    certifications: defineTable({
      userId: v.id("users"),
      moduleId: v.optional(v.id("modules")),
      title: v.string(),
      description: v.string(),
      issueDate: v.string(),
      certificateUrl: v.optional(v.string()),
      verificationCode: v.string(),
    }).index("by_user", ["userId"])
      .index("by_module", ["moduleId"]),

    // Analytics events
    analyticsEvents: defineTable({
      userId: v.optional(v.id("users")),
      eventType: v.string(),
      eventData: v.object({
        action: v.string(),
        category: v.optional(v.string()),
        value: v.optional(v.number()),
        metadata: v.optional(v.record(v.string(), v.any())),
      }),
      sessionId: v.optional(v.string()),
      userAgent: v.optional(v.string()),
    }).index("by_user", ["userId"])
      .index("by_event_type", ["eventType"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;