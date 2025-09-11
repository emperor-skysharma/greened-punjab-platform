import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Users, 
  TrendingUp,
  Calendar,
  Award,
  Zap,
  Clock,
  Star,
  ArrowRight,
  Play
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");

  // Fetch user data
  const modules = useQuery(api.modules.getModules);
  const userProgress = useQuery(api.modules.getUserProgress);
  const challenges = useQuery(api.challenges.getChallenges, {});
  const userSubmissions = useQuery(api.challenges.getUserSubmissions);
  const leaderboard = useQuery(api.challenges.getLeaderboard, { limit: 5 });
  const userBadges = useQuery(api.users.getUserBadges);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    navigate("/auth");
    return null;
  }

  const completedModules = userProgress?.filter(p => p.completed).length || 0;
  const totalModules = modules?.length || 0;
  const progressPercentage = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  const approvedSubmissions = userSubmissions?.filter(s => s.status === "approved").length || 0;
  const pendingSubmissions = userSubmissions?.filter(s => s.status === "pending").length || 0;

  const userLevel = Math.floor((user.totalPoints || 0) / 100) + 1;
  const pointsToNextLevel = (userLevel * 100) - (user.totalPoints || 0);

  const recentActivities = [
    { type: "module", title: "Completed Climate Change module", time: "2 hours ago", points: 50 },
    { type: "challenge", title: "Submitted Tree Planting challenge", time: "1 day ago", points: 100 },
    { type: "badge", title: "Earned Bronze Explorer badge", time: "2 days ago", points: 0 },
    { type: "quiz", title: "Scored 95% on Environmental Quiz", time: "3 days ago", points: 25 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="flex items-center space-x-2"
              >
                <div className="bg-green-600 p-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">GreenEd Punjab</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user.name?.charAt(0) || "U"}
                  </span>
                </div>
                <span className="text-gray-700">{user.name || "Student"}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {greeting}, {user.name || "Environmental Champion"}! 🌱
          </h1>
          <p className="text-gray-600">
            Ready to continue your environmental learning journey?
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Points</p>
                    <p className="text-2xl font-bold text-green-600">{user.totalPoints || 0}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Level</p>
                    <p className="text-2xl font-bold text-blue-600">{userLevel}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Modules Completed</p>
                    <p className="text-2xl font-bold text-purple-600">{completedModules}/{totalModules}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Badges Earned</p>
                    <p className="text-2xl font-bold text-yellow-600">{userBadges?.length || 0}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Learning Progress</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Points to Next Level</span>
                        <span>{pointsToNextLevel} points</span>
                      </div>
                      <Progress 
                        value={((user.totalPoints || 0) % 100)} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Continue your learning journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => navigate("/learn")}
                      className="h-20 flex-col bg-green-600 hover:bg-green-700"
                    >
                      <BookOpen className="h-6 w-6 mb-2" />
                      Continue Learning
                    </Button>
                    
                    <Button
                      onClick={() => navigate("/challenges")}
                      variant="outline"
                      className="h-20 flex-col border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <Target className="h-6 w-6 mb-2" />
                      Take Challenge
                    </Button>
                    
                    <Button
                      onClick={() => navigate("/forums")}
                      variant="outline"
                      className="h-20 flex-col border-purple-600 text-purple-600 hover:bg-purple-50"
                    >
                      <Users className="h-6 w-6 mb-2" />
                      Join Community
                    </Button>
                    
                    <Button
                      onClick={() => navigate("/portfolio")}
                      variant="outline"
                      className="h-20 flex-col border-orange-600 text-orange-600 hover:bg-orange-50"
                    >
                      <Award className="h-6 w-6 mb-2" />
                      View Portfolio
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            activity.type === 'module' ? 'bg-green-100' :
                            activity.type === 'challenge' ? 'bg-blue-100' :
                            activity.type === 'badge' ? 'bg-yellow-100' :
                            'bg-purple-100'
                          }`}>
                            {activity.type === 'module' && <BookOpen className="h-4 w-4 text-green-600" />}
                            {activity.type === 'challenge' && <Target className="h-4 w-4 text-blue-600" />}
                            {activity.type === 'badge' && <Award className="h-4 w-4 text-yellow-600" />}
                            {activity.type === 'quiz' && <Star className="h-4 w-4 text-purple-600" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                        {activity.points > 0 && (
                          <Badge className="bg-green-100 text-green-800">
                            +{activity.points} pts
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                    Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboard?.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {entry.rank}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{entry.name}</p>
                            <p className="text-xs text-gray-500">{entry.school}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {entry.totalPoints} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/challenges")}
                    className="w-full mt-4"
                  >
                    View Full Leaderboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-purple-600" />
                    Recent Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userBadges && userBadges.length > 0 ? (
                    <div className="space-y-3">
                      {userBadges.slice(0, 3).map((badge: any, index: number) => (
                        <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                            <Award className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{badge.title}</p>
                            <p className="text-xs text-gray-500">{badge.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Award className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No badges yet</p>
                      <p className="text-gray-400 text-xs">Complete challenges to earn your first badge!</p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/portfolio")}
                    className="w-full mt-4"
                  >
                    View All Badges
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Challenges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-green-600" />
                    Featured Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {challenges && challenges.length > 0 ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <img
                          src={challenges[0].imageUrl || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300"}
                          alt={challenges[0].title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Badge className="absolute top-2 right-2 bg-green-600">
                          +{challenges[0].points} pts
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-medium">{challenges[0].title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {challenges[0].description}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => navigate("/challenges")}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Challenge
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Target className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No challenges available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
