import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Mail, Phone, Calendar, Shield, CreditCard, Crown, Settings } from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
  const { user, profile, role, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>("Free");

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) fetchPurchases();
  }, [user]);

  const fetchPurchases = async () => {
    const { data } = await supabase
      .from("purchases")
      .select("*, plans(name, price, duration_days)")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) {
      setPurchases(data);
      const active = data.find((p: any) => p.status === "active" && (!p.expires_at || new Date(p.expires_at) > new Date()));
      if (active) setCurrentPlan((active as any).plans?.name || "Free");
    }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8 max-w-4xl space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h1 className="text-2xl font-bold">{profile?.full_name || "User"}</h1>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {user.email}</span>
                    {profile?.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {profile.phone}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="gap-1">
                    <Crown className="h-3 w-3" /> {currentPlan}
                  </Badge>
                  <Badge variant={role === "admin" ? "default" : "secondary"} className="gap-1">
                    <Shield className="h-3 w-3" /> {role || "user"}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Joined {format(new Date(user.created_at), "MMM yyyy")}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  {role === "admin" && (
                    <Button asChild size="sm" variant="default">
                      <Link to="/admin"><Settings className="h-4 w-4 mr-1" /> Admin Panel</Link>
                    </Button>
                  )}
                  <Button asChild size="sm" variant="outline">
                    <Link to="/pricing"><Crown className="h-4 w-4 mr-1" /> Upgrade Plan</Link>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { signOut(); navigate("/"); }}>
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchase History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5" /> Purchase History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {purchases.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No purchases yet.</p>
                <Button asChild variant="link" className="mt-2">
                  <Link to="/pricing">View Plans</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Expires</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{(p as any).plans?.name}</TableCell>
                      <TableCell>₹{p.amount}</TableCell>
                      <TableCell>
                        <Badge variant={p.status === "active" ? "default" : "secondary"}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{p.payment_method || "—"}</TableCell>
                      <TableCell>{format(new Date(p.starts_at), "dd MMM yyyy")}</TableCell>
                      <TableCell>{p.expires_at ? format(new Date(p.expires_at), "dd MMM yyyy") : "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
