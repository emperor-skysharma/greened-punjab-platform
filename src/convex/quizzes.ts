import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";

// Get quiz by module ID
export const getQuizByModule = query({
  args: { moduleId: v.id("modules") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quizzes")
      .withIndex("by_module", (q) => q.eq("moduleId", args.moduleId))
      .unique();
  },
});

// Submit quiz attempt
export const submitQuizAttempt = mutation({
  args: {
    quizId: v.id("quizzes"),
    answers: v.array(v.object({
      questionIndex: v.number(),
      selectedAnswer: v.number(),
    })),
    timeSpent: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) throw new Error("Quiz not found");

    // Calculate score
    let correctAnswers = 0;
    const answersWithResults = args.answers.map((answer, index) => {
      const question = quiz.questions[answer.questionIndex];
      const isCorrect = question.correctAnswer === answer.selectedAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        questionIndex: answer.questionIndex,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
      };
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const pointsEarned = score >= quiz.passingScore ? quiz.points : Math.round(quiz.points * 0.5);

    // Save attempt
    const attemptId = await ctx.db.insert("quizAttempts", {
      userId: user._id,
      quizId: args.quizId,
      moduleId: quiz.moduleId,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      timeSpent: args.timeSpent,
      answers: answersWithResults,
      pointsEarned,
    });

    // Update user points
    const currentPoints = user.totalPoints || 0;
    await ctx.db.patch(user._id, {
      totalPoints: currentPoints + pointsEarned,
    });

    return {
      attemptId,
      score,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      pointsEarned,
      passed: score >= quiz.passingScore,
    };
  },
});

// Get user's quiz attempts
export const getUserQuizAttempts = query({
  args: { moduleId: v.optional(v.id("modules")) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    let query = ctx.db.query("quizAttempts").withIndex("by_user", (q) => q.eq("userId", user._id));
    
    if (args.moduleId) {
      const attempts = await query.collect();
      return attempts.filter(attempt => attempt.moduleId === args.moduleId);
    }

    return await query.collect();
  },
});
