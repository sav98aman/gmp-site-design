import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const planIcons: Record<string, any> = { "Free": Zap, "Pro Monthly": Crown, "Pro Yearly": Star };

export default function Pricing() {
  const [plans, setPlans] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from("plans").select("*").eq("is_active", true).order("price").then(({ data }) => {
      if (data) setPlans(data);
    });
  }, []);

  const handleBuy = async (plan: any) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (plan.price === 0) {
      toast({ title: "You're already on the Free plan!" });
      return;
    }
    // For now, directly create purchase (in production, integrate Stripe)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.duration_days);
    const { error } = await supabase.from("purchases").insert({
      user_id: user.id,
      plan_id: plan.id,
      amount: plan.price,
      status: "active",
      payment_method: "demo",
      expires_at: expiresAt.toISOString(),
    });
    if (error) {
      toast({ title: "Purchase failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Plan activated!", description: `${plan.name} is now active.` });
      navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-12 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
          <p className="text-muted-foreground">Unlock premium IPO data, real-time GMP alerts, and advanced analytics.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = planIcons[plan.name] || Zap;
            const features = Array.isArray(plan.features) ? plan.features : [];
            const isPopular = plan.name === "Pro Monthly";

            return (
              <Card key={plan.id} className={`relative flex flex-col ${isPopular ? "border-primary shadow-lg shadow-primary/10" : "border-border/50"}`}>
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold">₹{plan.price}</span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground text-sm">
                        /{plan.duration_days >= 365 ? "year" : "month"}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {features.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={isPopular ? "default" : "outline"}
                    onClick={() => handleBuy(plan)}
                  >
                    {plan.price === 0 ? "Current Plan" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
