import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Target, Award, Leaf, Info } from "lucide-react";
import { toast } from "sonner";

type Challenge = {
  _id: string;
  title: string;
  titlePunjabi?: string;
  description: string;
  descriptionPunjabi?: string;
  type: string;
  category?: string;
  difficulty?: "beginner" | "intermediate" | "advanced" | string;
  points: number;
  imageUrl?: string;
  instructions?: string[];
  instructionsPunjabi?: string[];
  isActive?: boolean;
  requiresVerification?: boolean;
};

export default function Challenges() {
  const challenges = useQuery(api.challenges.getChallenges, {});
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Challenge | null>(null);
  const [startingId, setStartingId] = useState<string | null>(null);

  const categories = useMemo(() => {
    if (!challenges) return ["all"];
    const uniques = Array.from(
      new Set(
        challenges
          .map((c: any) => c.category)
          .filter((v: any): v is string => Boolean(v && typeof v === "string"))
      )
    );
    return ["all", ...uniques];
  }, [challenges]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    if (!challenges) return undefined;
    if (selectedCategory === "all") return challenges;
    return challenges.filter((c: any) => c.category === selectedCategory);
  }, [challenges, selectedCategory]);

  const handleView = (c: Challenge) => {
    setSelected(c);
    setOpen(true);
  };

  const handleStart = async (c: Challenge) => {
    setStartingId(c._id);
    // You can wire real submission flow later. For now, provide UX feedback.
    setTimeout(() => {
      toast.success(`Started: ${c.title}`);
      setStartingId(null);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Target className="h-7 w-7 text-green-600" />
              Challenges
            </h1>
            <p className="text-gray-600">
              Take practical eco tasks, earn points, and level up your impact.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className={selectedCategory === cat ? "bg-green-600 hover:bg-green-700" : ""}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {!filtered ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading challenges...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Info className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No challenges found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((c: Challenge) => (
              <Card
                key={c._id}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-white"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-xl">{c.title}</CardTitle>
                    <Badge className="bg-green-600">+{c.points} pts</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{c.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {c.imageUrl && (
                    <img
                      src={c.imageUrl}
                      alt={c.title}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    {c.category && (
                      <Badge variant="outline" className="text-sm">
                        <Leaf className="h-3.5 w-3.5 mr-1" />
                        {c.category}
                      </Badge>
                    )}
                    {c.difficulty && (
                      <Badge variant="outline" className="text-sm">
                        {c.difficulty}
                      </Badge>
                    )}
                    {c.requiresVerification && (
                      <Badge variant="outline" className="text-sm">
                        <Award className="h-3.5 w-3.5 mr-1" />
                        Verification Required
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStart(c)}
                      disabled={startingId === c._id}
                    >
                      {startingId === c._id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Starting...
                        </>
                      ) : (
                        "Start Challenge"
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => handleView(c)}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg" animated>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              {selected?.title || "Challenge"}
            </DialogTitle>
            {selected?.description && (
              <DialogDescription>{selected.description}</DialogDescription>
            )}
          </DialogHeader>
          {selected?.instructions && selected.instructions.length > 0 ? (
            <div className="space-y-2">
              <p className="font-medium">Instructions</p>
              <ol className="list-decimal pl-5 space-y-1">
                {selected.instructions.map((step, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Complete this challenge and submit your evidence to earn points.
            </p>
          )}
          <div className="flex gap-2 pt-2">
            {selected && (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  handleStart(selected);
                  setOpen(false);
                }}
              >
                Start Now (+{selected.points} pts)
              </Button>
            )}
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
