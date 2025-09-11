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
import { useState, useMemo, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Landing() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Carbon calculator state
  const [householdSize, setHouseholdSize] = useState<number>(4);
  const [electricityKwh, setElectricityKwh] = useState<number>(150);
  const [vehicleKm, setVehicleKm] = useState<number>(50);
  const [meatMealsPerWeek, setMeatMealsPerWeek] = useState<number>(6);

  // Simple "clean the park" game state
  const [trash, setTrash] = useState<Array<{ id: number; x: number; y: number }>>(
    Array.from({ length: 10 }).map((_, i) => ({
      id: i + 1,
      x: Math.random() * 80 + 10,
      y: Math.random() * 40 + 10,
    }))
  );
  const [cleaned, setCleaned] = useState<number>(0);

  // Add What If! local state just after other state hooks
  const [whatIfInput, setWhatIfInput] = useState<string>("");
  const [whatIfLoading, setWhatIfLoading] = useState<boolean>(false);
  const [whatIfResponse, setWhatIfResponse] = useState<string>("");

  // Prepare convex action
  const whatIfAction = useAction(api.ai.whatIf);

  const resetGame = () => {
    setTrash(
      Array.from({ length: 10 }).map((_, i) => ({
        id: i + 1,
        x: Math.random() * 80 + 10,
        y: Math.random() * 40 + 10,
      }))
    );
    setCleaned(0);
  };

  const handleClean = (id: number) => {
    setTrash((t) => t.filter((item) => item.id !== id));
    setCleaned((c) => c + 1);
  };

  // Add a helper to scroll to What If section
  function scrollToWhatIf() {
    const el = document.getElementById("whatif");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Carbon score calculation (very simplified, illustrative only)
  const carbonScore = useMemo(() => {
    const elec = electricityKwh * 0.82; // kg CO2 / kWh approximation (varies by grid)
    const travel = vehicleKm * 0.12; // kg CO2 / km for small car
    const diet = meatMealsPerWeek * 3.3; // kg CO2 / meal
    const perCapita = (elec + travel + diet) / Math.max(1, householdSize);
    return Math.round(perCapita);
  }, [electricityKwh, vehicleKm, meatMealsPerWeek, householdSize]);

  const recommendedTasks = useMemo(() => {
    if (carbonScore < 30) {
      return [
        "Plant 1 tree this month",
        "Host a cleanliness drive in your locality",
        "Cycle or walk for short trips (under 2 km)",
      ];
    }
    if (carbonScore < 70) {
      return [
        "Replace 5 bulbs with LEDs",
        "Carpool 2 days per week",
        "Eat 2 meat-free days per week",
        "Segregate waste and compost wet waste",
      ];
    }
    return [
      "Install a smart power strip to reduce standby usage",
      "Use public transport 3 days a week",
      "Switch to a pressure cooker/induction for daily cooking",
      "Pledge to plant 3 trees this season",
    ];
  }, [carbonScore]);

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

  // Add helper functions and init for the advanced calculator section
  // ---------------------------------------------------------------
  // Add calculator helpers (animated counters, progress bars, etc)
  function animateCounter(element: HTMLElement, target: number) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = String(target);
        clearInterval(timer);
      } else {
        element.textContent = String(Math.floor(current));
      }
    }, 20);
  }

  function startCounters() {
    const counters = document.querySelectorAll<HTMLElement>(".counter");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target as HTMLElement;
            const target = parseInt(counter.getAttribute("data-target") || "0");
            animateCounter(counter, target);
            observer.unobserve(counter);
          }
        });
      },
      { threshold: 0.5, rootMargin: "0px 0px -100px 0px" }
    );
    counters.forEach((c) => observer.observe(c));
  }

  function animateProgressBars() {
    const bars = document.querySelectorAll<HTMLElement>(".progress-bar");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target as HTMLElement;
            const width = bar.getAttribute("data-width") || "0";
            setTimeout(() => {
              bar.style.width = width + "%";
            }, 500);
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.5 }
    );
    bars.forEach((b) => observer.observe(b));
  }

  function initializeAnimations() {
    // hover lift to white/10 blocks
    document.querySelectorAll<HTMLElement>(".bg-white\\/10").forEach((card) => {
      card.classList.add("hover-lift");
    });

    // parallax for particles
    const onScroll = () => {
      const scrolled = window.pageYOffset;
      const particles = document.querySelectorAll<HTMLElement>(".particle");
      const speed = 0.5;
      particles.forEach((el) => {
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Quick helpers used by buttons
  function scrollToCalculator() {
    const el = document.querySelector("#carbonForm");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function showQuickFacts() {
    alert(
      "🌍 Quick Facts:\n\n• India produces 7% of global CO₂ emissions\n• Average Indian emits 1.9 tons CO₂/year\n• Rural Indians emit only 0.6 tons/year\n• India aims for Net Zero by 2070\n• 70% of electricity will be renewable by 2030"
    );
  }

  function displayResults(total: number, energy: number, transport: number, food: number, lifestyle: number, digital: number) {
    const setText = (id: string, val: string) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setText("totalFootprint", total.toFixed(1));
    setText("energyFootprint", energy.toFixed(1));
    setText("transportFootprint", transport.toFixed(1));
    setText("foodFootprint", food.toFixed(1));
    setText("lifestyleFootprint", lifestyle.toFixed(1));
    setText("digitalFootprint", digital.toFixed(1));

    const results = document.getElementById("results");
    if (results) {
      results.classList.remove("hidden");
      results.classList.add("result-animation");
      results.scrollIntoView({ behavior: "smooth" });
    }
  }

  function generateRecommendations(
    electricity: number,
    gas: number,
    vehicle: number,
    fuel: number,
    flights: number,
    diet: number,
    waste: number,
    shopping: number,
    cooling: number,
    digital: number
  ) {
    const recs: Array<string> = [];
    if (electricity > 2000) recs.push("💡 Switch to LED bulbs and use ISI marked energy efficient appliances");
    if (gas > 600) recs.push("🔥 Use pressure cookers and solar cookers to reduce LPG consumption");
    if (cooling > 8) recs.push("❄️ Use fans with AC, set AC to 24°C, and ensure proper insulation");
    if (vehicle >= 3 && fuel > 2500) recs.push("🚲 Use public transport, carpool, or consider switching to CNG/Electric vehicle");
    if (flights > 3) recs.push("🚂 Choose trains over flights for domestic travel when possible");
    if (diet >= 4) recs.push("🥗 Try having vegetarian meals 2-3 days a week (शाकाहारी भोजन)");
    if (waste < 3) recs.push("♻️ Start segregating waste - wet, dry, and recyclable (कचरा अलग करें)");
    if (shopping >= 4) recs.push("🛍️ Buy local products and avoid excessive packaging");
    if (digital >= 3) recs.push("📱 Reduce screen time and use WiFi instead of mobile data when possible");

    recs.push("🌱 Plant trees during monsoon season and support local environmental initiatives");
    recs.push("☀️ Consider solar water heaters and rooftop solar panels");
    recs.push("🚰 Install rainwater harvesting system if possible");
    recs.push("🚌 Use Metro, local trains, and buses - India's public transport is eco-friendly");

    const list = document.getElementById("recommendationsList");
    if (list) {
      list.innerHTML = recs
        .map(
          (rec) =>
            `<div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p class="text-gray-700">${rec}</p>
            </div>`
        )
        .join("");
    }
  }

  async function handleWhatIf(mode: "story" | "video") {
    if (!whatIfInput.trim() || whatIfLoading) return;
    setWhatIfLoading(true);
    try {
      const res = await whatIfAction({
        prompt: whatIfInput.trim(),
        mode,
        model: "google/gemini-pro",
      });
      if (!res?.success) {
        setWhatIfResponse(res?.error || "Could not generate a response. Please try again.");
      } else {
        setWhatIfResponse(res.content);
      }
    } catch {
      setWhatIfResponse("Unexpected error. Please try again.");
    } finally {
      setWhatIfLoading(false);
    }
  }

  function calculateFootprint() {
    const valNum = (id: string, def = 0) => parseFloat((document.getElementById(id) as HTMLInputElement | null)?.value || String(def)) || def;
    const valInt = (id: string, def = 0) => parseInt((document.getElementById(id) as HTMLSelectElement | null)?.value || String(def)) || def;

    const electricity = valNum("electricity", 0);
    const gas = valNum("gas", 0);
    const cookingFuel = valNum("cookingFuel", 1);
    const cooling = valNum("cooling", 0);
    const vehicle = valInt("vehicle", 0);
    const fuel = valNum("fuel", 0);
    const publicTransport = valInt("publicTransport", 0);
    const flights = valNum("flights", 0);
    const diet = valInt("diet", 1);
    const meatType = valInt("meatType", 1);
    const localFood = valInt("localFood", 2);
    const foodWaste = valInt("foodWaste", 2);
    const household = valNum("household", 1);
    const housing = valNum("housing", 2);
    const waste = valInt("waste", 2);
    const shopping = valInt("shopping", 2);
    const water = valInt("water", 3);
    const digital = valInt("digital", 2);

    // Energy (tons CO2 per year) — India-adjusted
    const electricityEmissions = electricity * 12 * 0.00004;
    const gasEmissions = gas * 12 * 0.00018 * cookingFuel;
    const coolingEmissions = cooling * 0.001 * 120; // ~4 months
    const energyEmissions = electricityEmissions + gasEmissions + coolingEmissions;

    // Transport
    const vehicleMultipliers = [0, 0, 0.4, 0.5, 0.6, 0.35, 0.05]; // per ₹1000 fuel
    const vehicleEmissions = fuel * 12 * (vehicleMultipliers[vehicle] || 0) * 0.0006;
    const flightEmissions = flights * 0.11;
    const publicTransportReduction = publicTransport * 0.05;
    const transportEmissions = Math.max(0, vehicleEmissions + flightEmissions - publicTransportReduction);

    // Food
    const dietEmissions = [0, 0.8, 1.0, 1.2, 1.8, 2.5, 3.2][diet] || 0.8;
    const meatTypeMultiplier = [1, 1, 1.2, 1.5, 2.0][meatType] || 1;
    const localFoodReduction = localFood * 0.05;
    const wasteMultiplier = [1, 1, 1.2, 1.4, 1.6][foodWaste] || 1.2;
    const foodEmissions = Math.max(0.4, dietEmissions * meatTypeMultiplier * wasteMultiplier - localFoodReduction);

    // Lifestyle
    const housingEmissions = housing * 0.3;
    const shoppingEmissions = shopping * 0.2;
    const waterEmissions = water * 0.1;
    const wasteReduction = waste * 0.05;
    const lifestyleEmissions = Math.max(0, housingEmissions + shoppingEmissions + waterEmissions - wasteReduction);

    // Digital
    const digitalEmissions = digital * 0.15;

    const totalEmissions = (energyEmissions + transportEmissions + foodEmissions + lifestyleEmissions + digitalEmissions) / Math.max(1, household);

    displayResults(
      totalEmissions,
      energyEmissions / household,
      transportEmissions / household,
      foodEmissions / household,
      lifestyleEmissions / household,
      digitalEmissions / household
    );

    generateRecommendations(electricity, gas, vehicle, fuel, flights, diet, waste, shopping, cooling, digital);
  }

  // Initialize animations on mount
  // ---------------------------------------------------------------
  useEffect(() => {
    initializeAnimations();
    startCounters();
    animateProgressBars();
  }, []);

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
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => document.getElementById("videos")?.scrollIntoView({ behavior: "smooth" })}>
                Watch Videos
              </Button>
              <Button variant="ghost" onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}>
                Carbon Calculator
              </Button>
              <Button variant="ghost" onClick={() => document.getElementById("game")?.scrollIntoView({ behavior: "smooth" })}>
                Play Game
              </Button>
              <Button variant="ghost" onClick={() => navigate("/waste-game")}>
                Sorting Game
              </Button>
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                Challenges
              </Button>
              {isAuthenticated ? (
                <Button 
                  onClick={() => navigate("/dashboard")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Dashboard
                </Button>
              ) : (
                <Button 
                  onClick={() => navigate("/auth")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Login / Sign up
                </Button>
              )}
              <Button variant="ghost" onClick={scrollToWhatIf}>
                What if!
              </Button>
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

      {/* What If! Section */}
      <section id="whatif" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h2 className="text-5xl md:text-6xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent">
                what if!
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Ask about real-life consequences of daily actions. Get a short story or video-style outline with actionable tips.
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={whatIfInput}
                onChange={(e) => setWhatIfInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !whatIfLoading && whatIfInput.trim()) handleWhatIf("story");
                }}
                placeholder='e.g., "What if I leave the fan on all day?" or "What if I drink bottled water daily?"'
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                aria-label="Ask What if!"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => handleWhatIf("story")}
                  disabled={whatIfLoading || !whatIfInput.trim()}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {whatIfLoading ? "Thinking..." : "Generate Story"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleWhatIf("video")}
                  disabled={whatIfLoading || !whatIfInput.trim()}
                >
                  {whatIfLoading ? "Thinking..." : "Video Outline"}
                </Button>
              </div>
            </div>

            {whatIfResponse && (
              <div className="mt-6">
                <Card className="border-0 shadow-md">
                  <CardContent className="prose max-w-none p-6">
                    <pre className="whitespace-pre-wrap text-gray-800">{whatIfResponse}</pre>
                  </CardContent>
                </Card>
              </div>
            )}
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

      {/* Watch Videos Section */}
      <section id="videos" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Watch & Learn
            </h2>
            <p className="text-gray-600">
              Handpicked environmental videos to inspire action
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle>Climate Change Basics</CardTitle>
                <CardDescription>Understand the science in minutes</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/ffjIyms1BX4"
                    title="Climate Change Basics"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle>Plastic Pollution</CardTitle>
                <CardDescription>How plastics affect our ecosystems</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/9m9XQFQ9R0E"
                    title="Plastic Pollution Explained"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Carbon Footprint Calculator — REPLACED with advanced version */}
      <section id="calculator" className="py-0">
        <style>
          {`
            .gradient-bg { background: linear-gradient(135deg, #ff9933 0%, #138808 50%, #000080 100%); }
            .card-shadow { box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
            .result-animation { animation: slideUp 0.5s ease-out; }
            .floating-particles { position: absolute; width: 100%; height: 100%; overflow: hidden; }
            .particle { position: absolute; background: rgba(255, 255, 255, 0.1); border-radius: 50%; animation: float 6s ease-in-out infinite; }
            .particle-1 { width: 8px; height: 8px; top: 20%; left: 10%; animation-delay: 0s; }
            .particle-2 { width: 12px; height: 12px; top: 60%; left: 80%; animation-delay: 1s; }
            .particle-3 { width: 6px; height: 6px; top: 80%; left: 20%; animation-delay: 2s; }
            .particle-4 { width: 10px; height: 10px; top: 30%; left: 70%; animation-delay: 3s; }
            .particle-5 { width: 14px; height: 14px; top: 70%; left: 50%; animation-delay: 4s; }
            .particle-6 { width: 8px; height: 8px; top: 40%; left: 30%; animation-delay: 5s; }
            @keyframes float { 0%,100%{ transform: translateY(0) rotate(0); opacity: .3 } 50%{ transform: translateY(-20px) rotate(180deg); opacity: .8 } }
            .grid-pattern {
              background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
              background-size: 50px 50px; width: 100%; height: 100%; animation: gridMove 20s linear infinite;
            }
            @keyframes gridMove { 0% { transform: translate(0,0) } 100% { transform: translate(50px,50px) } }
            .flag-container { perspective: 1000px; }
            .indian-flag { width: 60px; height: 40px; position: relative; transform-style: preserve-3d; animation: flagWave 3s ease-in-out infinite; cursor: pointer; transition: transform .3s ease; }
            .indian-flag:hover { transform: scale(1.1) rotateY(10deg); }
            .flag-stripe { height: 33.33%; width: 100%; position: relative; }
            .saffron { background: linear-gradient(45deg, #FF9933, #FF6600); }
            .white { background: white; display: flex; align-items: center; justify-content: center; }
            .green { background: linear-gradient(45deg, #138808, #006600); }
            .chakra { width: 12px; height: 12px; border: 1px solid #000080; border-radius: 50%; position: relative; animation: spin 4s linear infinite; }
            .chakra::before { content: ''; position: absolute; top: 50%; left: 50%; width: 8px; height: 8px; background: radial-gradient(circle, #000080 1px, transparent 1px); background-size: 2px 2px; transform: translate(-50%, -50%); border-radius: 50%; }
            @keyframes flagWave { 0%,100%{ transform: rotateY(0) rotateX(0) } 25%{ transform: rotateY(5deg) rotateX(2deg) } 75%{ transform: rotateY(-5deg) rotateX(-2deg) } }
            @keyframes spin { from { transform: rotate(0) } to { transform: rotate(360deg) } }
            .earth-container { width: 120px; height: 120px; perspective: 1000px; }
            .earth-globe { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; animation: earthRotate 20s linear infinite; }
            .earth-surface { width: 100%; height: 100%; background: radial-gradient(circle at 30% 30%, #4ade80, #22c55e, #16a34a, #15803d); border-radius: 50%; position: relative; overflow: hidden; }
            .earth-surface::before { content: ''; position: absolute; top: 20%; left: 10%; width: 30%; height: 40%; background: #1e40af; border-radius: 50% 20% 40% 30%; opacity: .8; }
            .earth-surface::after { content: ''; position: absolute; top: 60%; right: 20%; width: 25%; height: 30%; background: #1e40af; border-radius: 40% 50% 20% 60%; opacity: .8; }
            .earth-atmosphere { position: absolute; top: -10px; left: -10px; right: -10px; bottom: -10px; border-radius: 50%; background: radial-gradient(circle, transparent 60%, rgba(59,130,246,.3) 70%, rgba(59,130,246,.1) 100%); animation: atmosphereGlow 3s ease-in-out infinite alternate; }
            @keyframes earthRotate { from{ transform: rotateY(0) } to{ transform: rotateY(360deg) } }
            @keyframes atmosphereGlow { from { opacity: .5 } to { opacity: 1 } }
            .typing-animation { position: relative; overflow: hidden; }
            .typing-animation::after { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 2px; background: currentColor; animation: blink 1s infinite; }
            @keyframes blink { 0%,50%{ opacity: 1 } 51%,100%{ opacity: 0 } }
            .counter { transition: all .3s ease; }
            .progress-bar { width: 0%; transition: width 2s ease-in-out; }
            @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
            .hover-lift { transition: transform .3s ease, box-shadow .3s ease; }
            .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
            @media (max-width: 768px) {
              .earth-container { width: 80px; height: 80px; }
              .particle { display: none; }
            }
          `}
        </style>

        <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 text-white min-h-screen flex items-center relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="floating-particles">
              <div className="particle particle-1" />
              <div className="particle particle-2" />
              <div className="particle particle-3" />
              <div className="particle particle-4" />
              <div className="particle particle-5" />
              <div className="particle particle-6" />
            </div>
            <div className="absolute inset-0 opacity-20">
              <div className="grid-pattern" />
            </div>
            <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full blur-xl opacity-30 animate-pulse" />
            <div className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-40 animate-bounce" />
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-r from-white to-green-300 rounded-full blur-lg opacity-50 animate-ping" />
          </div>

          {/* Earth */}
          <div className="absolute top-10 right-10 earth-container">
            <div className="earth-globe">
              <div className="earth-surface" />
              <div className="earth-atmosphere" />
            </div>
          </div>

          {/* Header Content */}
          <div className="relative max-w-7xl mx-auto px-6 py-20 z-10 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div className="space-y-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="flag-container">
                    <div className="indian-flag">
                      <div className="flag-stripe saffron" />
                      <div className="flag-stripe white">
                        <div className="chakra" />
                      </div>
                      <div className="flag-stripe green" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
                    भारत के लिए
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-6xl md:text-7xl font-black leading-tight">
                    <span className="block bg-gradient-to-r from-white via-orange-2 00 to-amber-300 bg-clip-text text-transparent animate-pulse">
                      Carbon
                    </span>
                    <span className="block bg-gradient-to-r from-orange-300 via-white to-green-300 bg-clip-text text-transparent typing-animation">
                      Footprint
                    </span>
                    <span className="block text-4xl md:text-5xl bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                      Calculator
                    </span>
                  </h1>
                </div>

                <div className="space-y-4">
                  <p className="text-xl md:text-2xl text-orange-200 font-medium">🌍 Track • Reduce • Impact</p>
                  <p className="text-lg text-green-100 opacity-90 max-w-lg leading-relaxed">
                    Join millions of Indians in the fight against climate change. Calculate your carbon footprint and discover personalized ways to reduce it.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={scrollToCalculator}
                    className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl font-bold text-lg overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl"
                  >
                    <span className="relative z-10">Start Calculating 🚀</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  </button>
                  <button
                    onClick={showQuickFacts}
                    className="px-8 py-4 border-2 border-white/30 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  >
                    Quick Facts 📊
                  </button>
                </div>
              </div>

              {/* Right dashboards */}
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold mb-6 text-center">🇮🇳 India's Climate Impact</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-black text-orange-200 counter" data-target="1900">1</div>
                      <div className="text-sm opacity-80">Avg CO₂ (Kg/person/year)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-green-200 counter" data-target="2030">0</div>
                      <div className="text-sm opacity-80">Net Zero Target</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-cyan-200 counter" data-target="140">0</div>
                      <div className="text-sm opacity-80">Crore Population</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-amber-200 counter" data-target="75">0</div>
                      <div className="text-sm opacity-80">% Renewable Goal</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                  <h4 className="font-bold mb-4">🎯 India's Green Progress</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Solar Capacity</span>
                        <span>70 GW</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full progress-bar" data-width="70" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>EV Adoption</span>
                        <span>15%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full progress-bar" data-width="15" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Forest Cover</span>
                        <span>24%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full progress-bar" data-width="24" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Main Calculator */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl card-shadow p-8 mb-8">
            <form
              id="carbonForm"
              className="space-y-8"
              onSubmit={(e) => {
                e.preventDefault();
                calculateFootprint();
              }}
            >
              {/* Energy */}
              <div className="border-b pb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">⚡ Energy Consumption (ऊर्जा खपत)</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Electricity Bill (₹)</label>
                    <input id="electricity" type="number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="2500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly LPG/Gas Bill (₹)</label>
                    <input id="gas" type="number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="800" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cooking Fuel Type</label>
                    <select id="cookingFuel" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="0.7">LPG Gas</option>
                      <option value="1">Electric Induction</option>
                      <option value="1.5">Wood/Coal (चूल्हा)</option>
                      <option value="0.5">Solar Cooker</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">AC/Cooler Usage (hours/day in summer)</label>
                    <input id="cooling" type="number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="6" />
                  </div>
                </div>
              </div>

              {/* Transport */}
              <div className="border-b pb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">🚗 Transportation (परिवहन)</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Vehicle</label>
                    <select id="vehicle" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="0">No personal vehicle</option>
                      <option value="1">Bicycle</option>
                      <option value="2">Two-wheeler (Bike/Scooter)</option>
                      <option value="3">Car (Petrol)</option>
                      <option value="4">Car (Diesel)</option>
                      <option value="5">Car (CNG)</option>
                      <option value="6">Electric Vehicle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Fuel Expense (₹)</label>
                    <input id="fuel" type="number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="3000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Public Transport Usage</label>
                    <select id="publicTransport" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="0">Never</option>
                      <option value="1">Rarely (Auto/Taxi occasionally)</option>
                      <option value="2">Sometimes (Bus/Metro 1-2 times/week)</option>
                      <option value="3">Often (Bus/Metro 3-5 times/week)</option>
                      <option value="4">Daily (Bus/Metro/Local train)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Domestic Flights per Year</label>
                    <input id="flights" type="number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="2" />
                  </div>
                </div>
              </div>

              {/* Diet */}
              <div className="border-b pb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">🍽️ Diet & Food (आहार)</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preference</label>
                    <select id="diet" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="1">Pure Vegetarian (शुद्ध शाकाहारी)</option>
                      <option value="2">Lacto-Vegetarian</option>
                      <option value="3">Eggetarian</option>
                      <option value="4">Occasional Non-Veg (1-2 times/week)</option>
                      <option value="5">Regular Non-Veg (3-5 times/week)</option>
                      <option value="6">Daily Non-Veg</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Non-Veg Type (if applicable)</label>
                    <select id="meatType" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="1">Fish/Seafood only</option>
                      <option value="2">Chicken/Poultry</option>
                      <option value="3">Mutton/Goat</option>
                      <option value="4">All types including Beef</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Local/Seasonal Food %</label>
                    <select id="localFood" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="4">80-100% (Local markets, seasonal)</option>
                      <option value="3">60-80%</option>
                      <option value="2">40-60%</option>
                      <option value="1">20-40%</option>
                      <option value="0">0-20% (Mostly packaged/imported)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Food Wastage</label>
                    <select id="foodWaste" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="1">Minimal (finish everything)</option>
                      <option value="2">Low (rarely waste food)</option>
                      <option value="3">Moderate</option>
                      <option value="4">High (often throw away food)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Lifestyle */}
              <div className="border-b pb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">🏠 Lifestyle (जीवनशैली)</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Family Size</label>
                    <input id="household" type="number" min={1} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="4" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Housing Type</label>
                    <select id="housing" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="1">1 BHK Apartment</option>
                      <option value="2">2-3 BHK Apartment</option>
                      <option value="3">Independent House (Small)</option>
                      <option value="4">Large House/Villa</option>
                      <option value="0.5">Shared accommodation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Waste Segregation</label>
                    <select id="waste" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="4">Always segregate (wet/dry/recyclable)</option>
                      <option value="3">Often segregate</option>
                      <option value="2">Sometimes segregate</option>
                      <option value="1">Rarely segregate</option>
                      <option value="0">Never segregate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shopping Habits</label>
                    <select id="shopping" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="1">Minimal (only necessities)</option>
                      <option value="2">Conservative (monthly shopping)</option>
                      <option value="3">Moderate (bi-weekly)</option>
                      <option value="4">Frequent (weekly)</option>
                      <option value="5">High (online shopping regularly)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Water Usage</label>
                    <select id="water" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="1">Very conservative (bucket bath, rainwater harvesting)</option>
                      <option value="2">Conservative (limited shower time)</option>
                      <option value="3">Average</option>
                      <option value="4">Above average (long showers)</option>
                      <option value="5">High usage (no water conservation)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Digital Usage</label>
                    <select id="digital" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="1">Basic (calls, minimal internet)</option>
                      <option value="2">Moderate (social media, streaming occasionally)</option>
                      <option value="3">High (frequent streaming, gaming)</option>
                      <option value="4">Very high (multiple devices, constant usage)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Calculate My Carbon Footprint 🌱
                </button>
              </div>
            </form>
          </div>

          {/* Results */}
          <div id="results" className="hidden bg-white rounded-2xl card-shadow p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Carbon Footprint Results</h2>
              <div id="totalFootprint" className="text-6xl font-bold text-orange-600 mb-2">0</div>
              <p className="text-gray-600 text-lg">tons CO₂ per year</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <div className="text-2xl mb-2">⚡</div>
                <div id="energyFootprint" className="text-xl font-bold text-red-600">0</div>
                <div className="text-xs text-gray-600">Energy</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl mb-2">🚗</div>
                <div id="transportFootprint" className="text-xl font-bold text-blue-600">0</div>
                <div className="text-xs text-gray-600">Transport</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl mb-2">🍽️</div>
                <div id="foodFootprint" className="text-xl font-bold text-green-600">0</div>
                <div className="text-xs text-gray-600">Food</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl mb-2">🏠</div>
                <div id="lifestyleFootprint" className="text-xl font-bold text-purple-600">0</div>
                <div className="text-xs text-gray-600">Lifestyle</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <div className="text-2xl mb-2">📱</div>
                <div id="digitalFootprint" className="text-xl font-bold text-yellow-600">0</div>
                <div className="text-xs text-gray-600">Digital</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">How do you compare?</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>India Average:</span>
                  <span className="font-semibold">1.9 tons CO₂/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>World Average:</span>
                  <span className="font-semibold">4.8 tons CO₂/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Paris Agreement Target:</span>
                  <span className="font-semibold text-green-600">2.3 tons CO₂/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Rural India Average:</span>
                  <span className="font-semibold">0.6 tons CO₂/year</span>
                </div>
              </div>
            </div>

            <div id="recommendations" className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-green-800">💡 Personalized Recommendations (सुझाव)</h3>
              <div id="recommendationsList" className="space-y-3" />
            </div>
          </div>
        </div>
      </section>

      {/* Game: Clean the Park */}
      <section id="game" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Game: Clean the Park
            </h2>
            <p className="text-gray-600">
              Click the litter to clean up! Score: {cleaned} / 10
            </p>
          </motion.div>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="relative h-72 rounded-xl overflow-hidden"
                   style={{
                     backgroundImage:
                       "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80&auto=format&fit=crop')",
                     backgroundSize: "cover",
                     backgroundPosition: "center",
                   }}>
                {trash.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleClean(t.id)}
                    className="absolute h-8 w-8 rounded-full bg-yellow-400/90 hover:bg-yellow-500 border border-yellow-600 shadow"
                    style={{ left: `${t.x}%`, top: `${t.y}%` }}
                    aria-label="Pick up litter"
                    title="Pick up litter"
                  />
                ))}
                {trash.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/80 backdrop-blur p-6 rounded-lg text-center">
                      <p className="text-xl font-semibold text-green-700 mb-2">Great job!</p>
                      <p className="text-gray-700 mb-4">The park is clean again 🌿</p>
                      <Button onClick={resetGame} className="bg-green-600 hover:bg-green-700">
                        Play Again
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" onClick={resetGame}>Reset</Button>
                <Button variant="outline" onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}>
                  Reduce Your Real Impact
                </Button>
              </div>
            </CardContent>
          </Card>
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