import { Toaster } from "@/components/ui/sonner";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import AuthPage from "@/pages/Auth.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";
import Landing from "./pages/Landing.tsx";
import NotFound from "./pages/NotFound.tsx";
import "./types/global.d.ts";
import Dashboard from "@/pages/Dashboard.tsx";
import ChatWidget from "@/components/ChatWidget";
import Challenges from "@/pages/Challenges.tsx";
import WasteGame from "@/pages/WasteGame.tsx";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);



function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <InstrumentationProvider>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <RouteSyncer />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<AuthPage redirectAfterAuth="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/challenges" element={<Challenges />} />
            {/* New standalone route for Waste Warriors game */}
            <Route path="/waste-game" element={<WasteGame />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* Add site-wide floating chat widget */}
          <ChatWidget />
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </InstrumentationProvider>
  </StrictMode>,
);