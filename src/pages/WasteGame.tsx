import { motion } from "framer-motion";
import WasteWarriorsGame from "@/components/WasteWarriorsGame";
import { Card, CardContent } from "@/components/ui/card";

export default function WasteGame() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900"
          >
            Waste Warriors – Sorting Challenge
          </motion.h1>
          <p className="text-gray-600 mt-1">
            Sort items into Recycling, Composting, or Landfill. Learn proper segregation while you play!
          </p>
        </div>
      </header>

      <main className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 sm:p-6">
              <WasteWarriorsGame />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
