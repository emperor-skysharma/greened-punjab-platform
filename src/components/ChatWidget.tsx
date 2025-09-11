import { useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { MessageCircle, Send, Sparkles, Loader2 } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

type Msg = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => [
    {
      role: "assistant",
      content:
        "Hi! I’m EcoMentor. Ask me anything about the environment, challenges, quizzes, or tips to reduce your carbon footprint.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const chatAction = useAction(api.ai.chat);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const sendMessage = async () => {
    if (!canSend) return;
    const userText = input.trim();
    setInput("");
    const next = [...messages, { role: "user" as const, content: userText }];
    setMessages(next);
    setLoading(true);
    try {
      const result = await chatAction({
        model: "openai/gpt-4o",
        messages: next.map((m) => ({ role: m.role, content: m.content })),
      });

      if (!result?.success) {
        toast.error(result?.error || "Chat failed. Try again later.");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I’m having trouble reaching my brain right now. Please try again in a moment.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.content },
        ]);
      }
    } catch (e) {
      console.error(e);
      toast.error("Unexpected error. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong on my side. Please try again shortly.",
        },
      ]);
    } finally {
      setLoading(false);
      // scroll to bottom
      setTimeout(() => {
        listRef.current?.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 30);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="rounded-full h-12 w-12 p-0 bg-green-600 hover:bg-green-700 shadow-lg"
              aria-label="Open EcoMentor chat"
            >
              <MessageCircle className="h-6 w-6 text-white" />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 sm:max-w-md" animated>
            <DialogHeader className="p-4 pb-0">
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                EcoMentor
              </DialogTitle>
              <DialogDescription>
                Friendly mentor for environment questions and challenge help.
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 pt-2">
              <Card className="h-64 overflow-hidden border-0 bg-muted/40">
                <div
                  ref={listRef}
                  className="h-full overflow-y-auto p-3 space-y-3"
                >
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        m.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          m.role === "user"
                            ? "bg-green-600 text-white"
                            : "bg-white border"
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      EcoMentor is thinking...
                    </div>
                  )}
                </div>
              </Card>
              <div className="mt-3 flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canSend) sendMessage();
                  }}
                  placeholder="Ask about challenges, quizzes, or climate tips..."
                  disabled={loading}
                  aria-label="Message EcoMentor"
                />
                <Button onClick={sendMessage} disabled={!canSend}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Model: gpt-4o via OpenRouter. Responses are educational and may
                not be perfect—verify critical info independently.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
