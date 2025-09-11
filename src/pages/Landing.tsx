import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  Users, 
  Trophy, 
  BookOpen, 
  Target, 
  Globe,
  ArrowRight,
  Play,
  Star,
  Award,
  Zap,
  Heart
} from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-green-600" />,
      title: "Interactive Learning",
      titlePunjabi: "ਇੰਟਰਐਕਟਿਵ ਸਿੱਖਿਆ",
      description: "Engaging modules on environmental science, climate change, and sustainability",
      descriptionPunjabi: "ਵਾਤਾਵਰਣ ਵਿਗਿਆਨ, ਜਲਵਾਯੂ ਤਬਦੀਲੀ ਅਤੇ ਸਥਿਰਤਾ 'ਤੇ ਦਿਲਚਸਪ ਮਾਡਿਊਲ"
    },
    {
      icon: <Trophy className="h-8 w-8 text-yellow-600" />,
      title: "Gamified Experience",
      titlePunjabi: "ਗੇਮੀਫਾਈਡ ਅਨੁਭਵ",
      description: "Earn points, badges, and compete on leaderboards while learning",
      descriptionPunjabi: "ਸਿੱਖਦੇ ਸਮੇਂ ਪੁਆਇੰਟ, ਬੈਜ ਕਮਾਓ ਅਤੇ ਲੀਡਰਬੋਰਡ 'ਤੇ ਮੁਕਾਬਲਾ ਕਰੋ"
    },
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: "Real-world Challenges",
      titlePunjabi: "ਅਸਲ ਸੰਸਾਰ ਦੀਆਂ ਚੁਣੌਤੀਆਂ",
      description: "Complete eco-tasks and projects that make a real environmental impact",
      descriptionPunjabi: "ਈਕੋ-ਟਾਸਕ ਅਤੇ ਪ੍ਰੋਜੈਕਟ ਪੂਰੇ ਕਰੋ ਜੋ ਅਸਲ ਵਾਤਾਵਰਣ ਪ੍ਰਭਾਵ ਬਣਾਉਂਦੇ ਹਨ"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Community Collaboration",
      titlePunjabi: "ਭਾਈਚਾਰਕ ਸਹਿਯੋਗ",
      description: "Connect with peers, share projects, and learn together",
      descriptionPunjabi: "ਸਾਥੀਆਂ ਨਾਲ ਜੁੜੋ, ਪ੍ਰੋਜੈਕਟ ਸਾਂਝੇ ਕਰੋ ਅਤੇ ਇਕੱਠੇ ਸਿੱਖੋ"
    },
    {
      icon: <Award className="h-8 w-8 text-orange-600" />,
      title: "Career Development",
      titlePunjabi: "ਕਰੀਅਰ ਵਿਕਾਸ",
      description: "Build your portfolio and discover green career opportunities",
      descriptionPunjabi: "ਆਪਣਾ ਪੋਰਟਫੋਲੀਓ ਬਣਾਓ ਅਤੇ ਹਰੇ ਕਰੀਅਰ ਦੇ ਮੌਕੇ ਖੋਜੋ"
    },
    {
      icon: <Globe className="h-8 w-8 text-teal-600" />,
      title: "Multilingual Support",
      titlePunjabi: "ਬਹੁ-ਭਾਸ਼ਾਈ ਸਹਾਇਤਾ",
      description: "Learn in English or Punjabi with full language support",
      descriptionPunjabi: "ਪੂਰੀ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਨਾਲ ਅੰਗਰੇਜ਼ੀ ਜਾਂ ਪੰਜਾਬੀ ਵਿੱਚ ਸਿੱਖੋ"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Students", labelPunjabi: "ਵਿਦਿਆਰਥੀ" },
    { number: "500+", label: "Schools", labelPunjabi: "ਸਕੂਲ" },
    { number: "50+", label: "Challenges", labelPunjabi: "ਚੁਣੌਤੀਆਂ" },
    { number: "25+", label: "Modules", labelPunjabi: "ਮਾਡਿਊਲ" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      school: "Government Senior Secondary School, Amritsar",
      quote: "This platform made learning about environment so engaging! I earned my first badge in just one week.",
      quotePunjabi: "ਇਸ ਪਲੇਟਫਾਰਮ ਨੇ ਵਾਤਾਵਰਣ ਬਾਰੇ ਸਿੱਖਣਾ ਬਹੁਤ ਦਿਲਚਸਪ ਬਣਾ ਦਿੱਤਾ! ਮੈਂ ਸਿਰਫ਼ ਇੱਕ ਹਫ਼ਤੇ ਵਿੱਚ ਆਪਣਾ ਪਹਿਲਾ ਬੈਜ ਕਮਾਇਆ।",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Rajveer Singh",
      school: "DAV Public School, Jalandhar",
      quote: "The real-world challenges helped me understand how I can make a difference in my community.",
      quotePunjabi: "ਅਸਲ ਸੰਸਾਰ ਦੀਆਂ ਚੁਣੌਤੀਆਂ ਨੇ ਮੈਨੂੰ ਸਮਝਾਇਆ ਕਿ ਮੈਂ ਆਪਣੇ ਭਾਈਚਾਰੇ ਵਿੱਚ ਕਿਵੇਂ ਫਰਕ ਲਿਆ ਸਕਦਾ ਹਾਂ।",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Simran Kaur",
      school: "Khalsa College, Patiala",
      quote: "I love the Punjabi language support. It makes complex topics easier to understand.",
      quotePunjabi: "ਮੈਨੂੰ ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਦੀ ਸਹਾਇਤਾ ਪਸੰਦ ਹੈ। ਇਹ ਗੁੰਝਲਦਾਰ ਵਿਸ਼ਿਆਂ ਨੂੰ ਸਮਝਣਾ ਆਸਾਨ ਬਣਾਉਂਦਾ ਹੈ।",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-green-600 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">GreenEd Punjab</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Button 
                  onClick={() => navigate("/dashboard")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={() => navigate("/auth")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
              <Zap className="h-3 w-3 mr-1" />
              Empowering Punjab's Future Environmental Leaders
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Learn. Act. Lead.
              <span className="block text-green-600">Save Our Planet.</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join Punjab's premier gamified environmental education platform. 
              Complete challenges, earn badges, and build the skills to create 
              a sustainable future for our communities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Button 
                  size="lg"
                  onClick={() => navigate("/dashboard")}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Continue Learning
                </Button>
              ) : (
                <Button 
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Your Journey
                </Button>
              )}
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/learn")}
                className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg"
              >
                Explore Modules
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose GreenEd Punjab?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge gamification with real-world environmental action
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from Punjab's environmental champions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-gray-600 mb-4 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="h-10 w-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.school}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join thousands of students across Punjab who are already learning, 
              acting, and leading the environmental movement.
            </p>
            
            {isAuthenticated ? (
              <Button 
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg"
              >
                <Heart className="mr-2 h-5 w-5" />
                Continue Your Impact
              </Button>
            ) : (
              <Button 
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg"
              >
                <Heart className="mr-2 h-5 w-5" />
                Start Making Impact Today
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">GreenEd Punjab</span>
              </div>
              <p className="text-gray-400">
                Empowering Punjab's students to become environmental leaders through 
                gamified learning and real-world action.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/learn" className="hover:text-white transition-colors">Learning Modules</a></li>
                <li><a href="/challenges" className="hover:text-white transition-colors">Challenges</a></li>
                <li><a href="/forums" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="/internships" className="hover:text-white transition-colors">Opportunities</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GreenEd Punjab. All rights reserved. Built with ❤️ for Punjab's future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}