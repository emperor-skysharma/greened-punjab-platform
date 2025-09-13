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
import { useState, useMemo, useEffect, useRef } from "react";
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

  // Add ref for the 3D deforestation section
  const deforestRef = useRef<HTMLDivElement | null>(null);

  // Add missing constants and data to stabilize the page
  // ---------------------------------------------------
  // Phase-based class removed; keep empty to avoid runtime error
  const phaseClass = "";

  // Stub out What-if AI references to avoid errors (feature disabled here)
  // REPLACE STUBS WITH REAL STATE AND A LOCAL GENERATOR
  const [whatIfInput, setWhatIfInput] = useState<string>("");
  const [whatIfLoading, setWhatIfLoading] = useState<boolean>(false);
  const [whatIfResponse, setWhatIfResponse] = useState<string>("");

  // Local generator to simulate AI responses without backend
  const whatIfAction: (
    args: { prompt: string; mode: "story" | "video"; model: string }
  ) => Promise<{ success: true; content: string } | { success: false; error: string }> = async ({
    prompt,
    mode,
  }) => {
    const cleaned = prompt.trim();
    if (!cleaned) return { success: false, error: "Please enter a prompt." };

    const now = new Date().toLocaleString();
    const baseIntro =
      mode === "story"
        ? `Here's a short, realistic story about the impact of "${cleaned}":\n\n`
        : `Here's a concise video script about the impact of "${cleaned}":\n\n`;

    const bodyStory = `Act 1 — Today:
• Choice: ${cleaned}
• Immediate impact: a bit more energy, a bit more waste, a bit more emissions.

Act 2 — Ripple Effects:
• Over a month: measurably higher CO₂ footprint, more landfill, more air pollution.
• Community: habits spread; small choices scale when many people do the same.

Act 3 — If We Change:
• Swap with greener alternatives (public transit, reusables, efficient devices).
• Result: lower bills, cleaner air, healthier communities.

Takeaway:
Small, repeated actions become big outcomes. Track, reduce, and share your wins.`;

    const bodyVideo = `Hook (0–5s):
"What if ${cleaned} became our daily default?"

Setup (5–20s):
• Each action emits CO₂, uses resources, and creates waste.
• Alone it seems small; together it scales fast.

Impact (20–40s):
• Monthly: higher emissions and costs.
• City-wide: noticeable smog days, fuller landfills, stressed grids.

Better Choice (40–55s):
• Swap: efficient habits, shared transport, reusables.
• Visual: meter dropping, skies clearing.

CTA (55–60s):
"Try one swap this week. Share your impact."`;

    const content =
      baseIntro +
      (mode === "story" ? bodyStory : bodyVideo) +
      `\n\nGenerated at: ${now}`;

    return { success: true, content };
  };

  // Minimal data for sections
  const stats = [
    { number: "25K+", label: "Students Engaged" },
    { number: "1.2K", label: "Challenges Completed" },
    { number: "120+", label: "Schools Onboarded" },
    { number: "300+", label: "Community Projects" },
  ];

  const features = [
    {
      icon: <Users className="h-6 w-6 text-green-600" />,
      title: "Community Learning",
      description: "Collaborate with peers and mentors to build sustainable habits.",
    },
    {
      icon: <Trophy className="h-6 w-6 text-green-600" />,
      title: "Gamified Progress",
      description: "Earn badges and track your growth through fun challenges.",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-green-600" />,
      title: "Curated Modules",
      description: "Learn climate science with engaging, local-context lessons.",
    },
    {
      icon: <Target className="h-6 w-6 text-green-600" />,
      title: "Action-Oriented",
      description: "Translate learning into measurable actions in your community.",
    },
    {
      icon: <Globe className="h-6 w-6 text-green-600" />,
      title: "Real Impact",
      description: "Reduce emissions and improve local environments together.",
    },
    {
      icon: <Award className="h-6 w-6 text-green-600" />,
      title: "Recognition",
      description: "get recognized for consistency and initiative.",
    },
  ];

  const testimonials = [
    {
      quote: "The challenges made climate action feel achievable and fun.",
      name: "Simran Kaur",
      school: "Govt. Sr. Sec. School, Ludhiana",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&q=80&auto=format&fit=crop",
    },
    {
      quote: "Our eco-club grew rapidly after using this platform.",
      name: "Rahul Mehta",
      school: "DAV Public School, Amritsar",
      avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=96&q=80&auto=format&fit=crop",
    },
    {
      quote: "I learned practical tips we could apply at home immediately.",
      name: "Aisha Khan",
      school: "Sacred Heart School, Jalandhar",
      avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=96&q=80&auto=format&fit=crop",
    },
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

  // Scroll-driven CSS var updater for the 3D section
  useEffect(() => {
    const el = deforestRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      const total = rect.height - viewportH; // scrollable length inside section
      const visibleTop = Math.min(Math.max(-rect.top, 0), total > 0 ? total : 1);
      const progress = total > 0 ? visibleTop / total : 0;
      el.style.setProperty("--progress", String(progress));
      const pct = Math.round(progress * 100);
      const meter = el.querySelector<HTMLElement>("#destructionPct");
      if (meter) meter.textContent = String(pct);
    };

    // Initial and on scroll
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

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
    <div className="page-root min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
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
              {/* ADD: What if! nav button */}
              <Button variant="ghost" onClick={() => document.getElementById("whatif")?.scrollIntoView({ behavior: "smooth" })}>
                What if!
              </Button>
              <Button variant="ghost" onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}>
                Carbon Calculator
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

      {/* What if! Section */}
      <section id="whatif" className="py-0 scroll-mt-24">
        <style>
          {`
            .whatif-hero {
              background: radial-gradient(1200px 400px at 20% -10%, rgba(34,197,94,.35), transparent 60%),
                          radial-gradient(1000px 500px at 120% 10%, rgba(59,130,246,.35), transparent 60%);
            }
            .whatif-grid { background-image: linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                                            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
                           background-size: 40px 40px; }
          `}
        </style>

        <div className="whatif-hero text-white min-h-[90vh] md:min-h-[100vh] flex items-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-35 whatif-grid" />
          <div className="relative max-w-5xl mx-auto px-6 py-20 z-10 w-full">
            <div className="text-center mb-10">
              <h2 className="text-5xl md:text-6xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-emerald-300 via-white to-sky-300 bg-clip-text text-transparent">what if!</span>
              </h2>
              <p className="mt-4 text-emerald-100/90 max-w-2xl mx-auto">
                Ask about real-life consequences of daily actions. Get a story or a quick video script.
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/30 shadow-2xl ring-1 ring-emerald-300/30">
              <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                <input
                  value={whatIfInput}
                  onChange={(e) => setWhatIfInput(e.target.value)}
                  placeholder="e.g., What if I drive 10km daily instead of taking the bus?"
                  className="flex-1 px-4 py-4 md:py-5 rounded-xl bg-white/90 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-base md:text-lg"
                />
                <div className="flex gap-2">
                  <button
                    disabled={whatIfLoading || !whatIfInput.trim()}
                    onClick={() => handleWhatIf("story")}
                    className="px-5 md:px-6 py-3.5 md:py-4 rounded-xl font-semibold bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 shadow-lg hover:shadow-emerald-500/30 transition-transform hover:scale-[1.02]"
                  >
                    {whatIfLoading ? "Generating..." : "Story"}
                  </button>
                  <button
                    disabled={whatIfLoading || !whatIfInput.trim()}
                    onClick={() => handleWhatIf("video")}
                    className="px-5 md:px-6 py-3.5 md:py-4 rounded-xl font-semibold bg-sky-500 hover:bg-sky-600 disabled:opacity-50 shadow-lg hover:shadow-sky-500/30 transition-transform hover:scale-[1.02]"
                  >
                    {whatIfLoading ? "Generating..." : "Video"}
                  </button>
                </div>
              </div>

              {whatIfResponse && (
                <div className="mt-6 bg-white/80 text-gray-800 rounded-2xl p-5 md:p-6 max-h-[420px] overflow-auto">
                  <pre className="whitespace-pre-wrap leading-relaxed">{whatIfResponse}</pre>
                </div>
              )}
            </div>
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
                    <span className="block bg-gradient-to-r from-white via-orange-200 to-amber-300 bg-clip-text text-transparent animate-pulse">
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