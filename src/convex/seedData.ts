import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing data (optional - remove in production)
    // await clearAllTables(ctx);

    // Seed modules
    const moduleIds = await seedModules(ctx);
    
    // Seed quizzes
    await seedQuizzes(ctx, moduleIds);
    
    // Seed challenges
    await seedChallenges(ctx);
    
    // Seed opportunities
    await seedOpportunities(ctx);

    return { success: true, message: "Database seeded successfully" };
  },
});

async function seedModules(ctx: any) {
  const modules = [
    {
      title: "Introduction to Environmental Science",
      titlePunjabi: "ਵਾਤਾਵਰਣ ਵਿਗਿਆਨ ਦੀ ਜਾਣ-ਪਛਾਣ",
      description: "Learn the basics of environmental science and ecology",
      descriptionPunjabi: "ਵਾਤਾਵਰਣ ਵਿਗਿਆਨ ਅਤੇ ਵਾਤਾਵਰਣ ਵਿਗਿਆਨ ਦੀਆਂ ਬੁਨਿਆਦੀ ਗੱਲਾਂ ਸਿੱਖੋ",
      content: "Environmental science is an interdisciplinary field that combines physical, biological, and information sciences to study the environment and solve environmental problems...",
      contentPunjabi: "ਵਾਤਾਵਰਣ ਵਿਗਿਆਨ ਇੱਕ ਅੰਤਰ-ਅਨੁਸ਼ਾਸਨੀ ਖੇਤਰ ਹੈ...",
      imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500",
      difficulty: "beginner",
      estimatedTime: 30,
      points: 50,
      category: "basics",
      isPublished: true,
      order: 1,
    },
    {
      title: "Climate Change and Global Warming",
      titlePunjabi: "ਜਲਵਾਯੂ ਤਬਦੀਲੀ ਅਤੇ ਗਲੋਬਲ ਵਾਰਮਿੰਗ",
      description: "Understanding climate change, its causes, and impacts",
      descriptionPunjabi: "ਜਲਵਾਯੂ ਤਬਦੀਲੀ, ਇਸਦੇ ਕਾਰਨ ਅਤੇ ਪ੍ਰਭਾਵਾਂ ਨੂੰ ਸਮਝਣਾ",
      content: "Climate change refers to long-term shifts in global temperatures and weather patterns...",
      contentPunjabi: "ਜਲਵਾਯੂ ਤਬਦੀਲੀ ਦਾ ਮਤਲਬ ਗਲੋਬਲ ਤਾਪਮਾਨ ਅਤੇ ਮੌਸਮੀ ਪੈਟਰਨ ਵਿੱਚ ਲੰਬੇ ਸਮੇਂ ਦੀ ਤਬਦੀਲੀ ਹੈ...",
      imageUrl: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=500",
      difficulty: "intermediate",
      estimatedTime: 45,
      points: 75,
      category: "climate",
      isPublished: true,
      order: 2,
    },
    {
      title: "Biodiversity and Conservation",
      titlePunjabi: "ਜੈਵ ਵਿਭਿੰਨਤਾ ਅਤੇ ਸੰਰਖਿਆ",
      description: "Explore biodiversity, ecosystems, and conservation strategies",
      descriptionPunjabi: "ਜੈਵ ਵਿਭਿੰਨਤਾ, ਵਾਤਾਵਰਣ ਪ੍ਰਣਾਲੀਆਂ ਅਤੇ ਸੰਰਖਿਆ ਰਣਨੀਤੀਆਂ ਦੀ ਖੋਜ ਕਰੋ",
      content: "Biodiversity refers to the variety of life on Earth at all its levels...",
      contentPunjabi: "ਜੈਵ ਵਿਭਿੰਨਤਾ ਦਾ ਮਤਲਬ ਧਰਤੀ ਉੱਤੇ ਜੀਵਨ ਦੀ ਵਿਭਿੰਨਤਾ ਹੈ...",
      imageUrl: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=500",
      difficulty: "intermediate",
      estimatedTime: 40,
      points: 70,
      category: "biodiversity",
      isPublished: true,
      order: 3,
    },
  ];

  const moduleIds = [];
  for (const module of modules) {
    const id = await ctx.db.insert("modules", module);
    moduleIds.push(id);
  }
  
  return moduleIds;
}

async function seedQuizzes(ctx: any, moduleIds: any[]) {
  const quizzes = [
    {
      moduleId: moduleIds[0],
      title: "Environmental Science Basics Quiz",
      titlePunjabi: "ਵਾਤਾਵਰਣ ਵਿਗਿਆਨ ਬੁਨਿਆਦੀ ਕਵਿਜ਼",
      questions: [
        {
          question: "What is the study of interactions between organisms and their environment called?",
          questionPunjabi: "ਜੀਵਾਂ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਵਾਤਾਵਰਣ ਵਿਚਕਾਰ ਪਰਸਪਰ ਕਿਰਿਆ ਦੇ ਅਧਿਐਨ ਨੂੰ ਕੀ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?",
          options: ["Biology", "Ecology", "Chemistry", "Physics"],
          optionsPunjabi: ["ਜੀਵ ਵਿਗਿਆਨ", "ਵਾਤਾਵਰਣ ਵਿਗਿਆਨ", "ਰਸਾਇਣ ਵਿਗਿਆਨ", "ਭੌਤਿਕ ਵਿਗਿਆਨ"],
          correctAnswer: 1,
          explanation: "Ecology is the study of interactions between organisms and their environment.",
          explanationPunjabi: "ਵਾਤਾਵਰਣ ਵਿਗਿਆਨ ਜੀਵਾਂ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਵਾਤਾਵਰਣ ਵਿਚਕਾਰ ਪਰਸਪਰ ਕਿਰਿਆ ਦਾ ਅਧਿਐਨ ਹੈ।",
        },
        {
          question: "Which of the following is a renewable resource?",
          questionPunjabi: "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਨਵਿਆਉਣਯੋਗ ਸਰੋਤ ਹੈ?",
          options: ["Coal", "Solar energy", "Natural gas", "Oil"],
          optionsPunjabi: ["ਕੋਲਾ", "ਸੂਰਜੀ ਊਰਜਾ", "ਕੁਦਰਤੀ ਗੈਸ", "ਤੇਲ"],
          correctAnswer: 1,
          explanation: "Solar energy is renewable as it comes from the sun which is constantly available.",
          explanationPunjabi: "ਸੂਰਜੀ ਊਰਜਾ ਨਵਿਆਉਣਯੋਗ ਹੈ ਕਿਉਂਕਿ ਇਹ ਸੂਰਜ ਤੋਂ ਆਉਂਦੀ ਹੈ ਜੋ ਲਗਾਤਾਰ ਉਪਲਬਧ ਹੈ।",
        },
      ],
      timeLimit: 300,
      passingScore: 70,
      points: 25,
    },
  ];

  for (const quiz of quizzes) {
    await ctx.db.insert("quizzes", quiz);
  }
}

async function seedChallenges(ctx: any) {
  const challenges = [
    {
      title: "Plant a Tree Challenge",
      titlePunjabi: "ਰੁੱਖ ਲਗਾਓ ਚੁਣੌਤੀ",
      description: "Plant a tree in your community and document the process",
      descriptionPunjabi: "ਆਪਣੇ ਭਾਈਚਾਰੇ ਵਿੱਚ ਇੱਕ ਰੁੱਖ ਲਗਾਓ ਅਤੇ ਪ੍ਰਕਿਰਿਆ ਦਾ ਦਸਤਾਵੇਜ਼ੀਕਰਣ ਕਰੋ",
      type: "eco_task",
      category: "conservation",
      difficulty: "beginner",
      points: 100,
      imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500",
      instructions: [
        "Choose an appropriate location for planting",
        "Select a native tree species",
        "Dig a proper hole and plant the tree",
        "Take photos of the process",
        "Submit your documentation"
      ],
      instructionsPunjabi: [
        "ਲਗਾਉਣ ਲਈ ਢੁਕਵੀਂ ਜਗ੍ਹਾ ਚੁਣੋ",
        "ਇੱਕ ਦੇਸੀ ਰੁੱਖ ਦੀ ਕਿਸਮ ਚੁਣੋ",
        "ਢੁਕਵਾਂ ਟੋਆ ਪੁੱਟੋ ਅਤੇ ਰੁੱਖ ਲਗਾਓ",
        "ਪ੍ਰਕਿਰਿਆ ਦੀਆਂ ਫੋਟੋਆਂ ਲਓ",
        "ਆਪਣਾ ਦਸਤਾਵੇਜ਼ੀਕਰਣ ਜਮ੍ਹਾਂ ਕਰੋ"
      ],
      isActive: true,
      requiresVerification: true,
    },
    {
      title: "Waste Reduction Week",
      titlePunjabi: "ਰਦੀ ਘਟਾਉਣ ਹਫ਼ਤਾ",
      description: "Track and reduce your household waste for one week",
      descriptionPunjabi: "ਇੱਕ ਹਫ਼ਤੇ ਲਈ ਆਪਣੇ ਘਰੇਲੂ ਰਦੀ ਦਾ ਪਤਾ ਲਗਾਓ ਅਤੇ ਘਟਾਓ",
      type: "eco_task",
      category: "waste",
      difficulty: "intermediate",
      points: 75,
      imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500",
      instructions: [
        "Measure your daily waste production",
        "Implement waste reduction strategies",
        "Document your progress with photos",
        "Calculate total waste reduced",
        "Share your results"
      ],
      instructionsPunjabi: [
        "ਆਪਣੇ ਰੋਜ਼ਾਨਾ ਰਦੀ ਉਤਪਾਦਨ ਨੂੰ ਮਾਪੋ",
        "ਰਦੀ ਘਟਾਉਣ ਦੀਆਂ ਰਣਨੀਤੀਆਂ ਲਾਗੂ ਕਰੋ",
        "ਫੋਟੋਆਂ ਨਾਲ ਆਪਣੀ ਪ੍ਰਗਤੀ ਦਾ ਦਸਤਾਵੇਜ਼ੀਕਰਣ ਕਰੋ",
        "ਕੁੱਲ ਘਟਾਈ ਗਈ ਰਦੀ ਦੀ ਗਣਨਾ ਕਰੋ",
        "ਆਪਣੇ ਨਤੀਜੇ ਸਾਂਝੇ ਕਰੋ"
      ],
      isActive: true,
      requiresVerification: true,
    },
    {
      title: "Environmental Quiz Championship",
      titlePunjabi: "ਵਾਤਾਵਰਣ ਕਵਿਜ਼ ਚੈਂਪੀਅਨਸ਼ਿਪ",
      description: "Complete all environmental quizzes with 90% or higher score",
      descriptionPunjabi: "90% ਜਾਂ ਵੱਧ ਸਕੋਰ ਨਾਲ ਸਾਰੇ ਵਾਤਾਵਰਣ ਕਵਿਜ਼ ਪੂਰੇ ਕਰੋ",
      type: "quiz",
      category: "knowledge",
      difficulty: "advanced",
      points: 150,
      imageUrl: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500",
      instructions: [
        "Complete all available environmental quizzes",
        "Achieve 90% or higher on each quiz",
        "Submit screenshot of your results",
        "Maintain consistent high performance"
      ],
      instructionsPunjabi: [
        "ਸਾਰੇ ਉਪਲਬਧ ਵਾਤਾਵਰਣ ਕਵਿਜ਼ ਪੂਰੇ ਕਰੋ",
        "ਹਰ ਕਵਿਜ਼ ਵਿੱਚ 90% ਜਾਂ ਵੱਧ ਪ੍ਰਾਪਤ ਕਰੋ",
        "ਆਪਣੇ ਨਤੀਜਿਆਂ ਦਾ ਸਕ੍ਰੀਨਸ਼ਾਟ ਜਮ੍ਹਾਂ ਕਰੋ",
        "ਲਗਾਤਾਰ ਉੱਚ ਪ੍ਰਦਰਸ਼ਨ ਬਣਾਈ ਰੱਖੋ"
      ],
      isActive: true,
      requiresVerification: false,
    },
  ];

  for (const challenge of challenges) {
    await ctx.db.insert("challenges", challenge);
  }
}

async function seedOpportunities(ctx: any) {
  const opportunities = [
    {
      title: "Green Tech Internship Program",
      titlePunjabi: "ਗ੍ਰੀਨ ਟੈਕ ਇੰਟਰਨਸ਼ਿਪ ਪ੍ਰੋਗਰਾਮ",
      description: "3-month internship program focused on sustainable technology solutions",
      descriptionPunjabi: "ਟਿਕਾਊ ਤਕਨਾਲੋਜੀ ਹੱਲਾਂ 'ਤੇ ਕੇਂਦ੍ਰਿਤ 3-ਮਹੀਨੇ ਦਾ ਇੰਟਰਨਸ਼ਿਪ ਪ੍ਰੋਗਰਾਮ",
      organization: "EcoTech Solutions",
      location: "Chandigarh, Punjab",
      type: "internship",
      category: "technology",
      requirements: [
        "Currently enrolled in engineering or environmental science",
        "Basic programming knowledge",
        "Passion for environmental sustainability",
        "Good communication skills"
      ],
      applicationUrl: "https://ecotech.example.com/apply",
      deadline: "2024-06-30",
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500",
      contactEmail: "internships@ecotech.example.com",
    },
    {
      title: "Environmental Research Volunteer",
      titlePunjabi: "ਵਾਤਾਵਰਣ ਖੋਜ ਸਵੈਸੇਵਕ",
      description: "Volunteer opportunity to assist in environmental research projects",
      descriptionPunjabi: "ਵਾਤਾਵਰਣ ਖੋਜ ਪ੍ਰੋਜੈਕਟਾਂ ਵਿੱਚ ਸਹਾਇਤਾ ਕਰਨ ਦਾ ਸਵੈਸੇਵਕ ਮੌਕਾ",
      organization: "Punjab Environmental Research Institute",
      location: "Ludhiana, Punjab",
      type: "volunteer",
      category: "research",
      requirements: [
        "Interest in environmental science",
        "Ability to work in field conditions",
        "Flexible schedule",
        "Team collaboration skills"
      ],
      applicationUrl: "https://peri.example.com/volunteer",
      deadline: "2024-07-15",
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500",
      contactEmail: "volunteer@peri.example.com",
    },
    {
      title: "Sustainable Agriculture Scholarship",
      titlePunjabi: "ਟਿਕਾਊ ਖੇਤੀਬਾੜੀ ਸਕਾਲਰਸ਼ਿਪ",
      description: "Scholarship for students pursuing sustainable agriculture studies",
      descriptionPunjabi: "ਟਿਕਾਊ ਖੇਤੀਬਾੜੀ ਅਧਿਐਨ ਕਰਨ ਵਾਲੇ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਸਕਾਲਰਸ਼ਿਪ",
      organization: "Punjab Agricultural University",
      location: "Ludhiana, Punjab",
      type: "scholarship",
      category: "agriculture",
      requirements: [
        "Enrolled in agriculture or related field",
        "Minimum 75% academic performance",
        "Demonstrated interest in sustainability",
        "Financial need documentation"
      ],
      applicationUrl: "https://pau.example.com/scholarship",
      deadline: "2024-08-01",
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500",
      contactEmail: "scholarships@pau.example.com",
    },
  ];

  for (const opportunity of opportunities) {
    await ctx.db.insert("opportunities", opportunity);
  }
}
