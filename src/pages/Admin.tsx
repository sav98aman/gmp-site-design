import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Users, CreditCard, BarChart3, Activity, Shield, TrendingUp, TrendingDown,
  Eye, Clock, MousePointer, UserCheck, UserX
} from "lucide-react";
import { format } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";

export default function Admin() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, activeSubscribers: 0, totalRevenue: 0, recentActivity: 0 });

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) navigate("/");
  }, [user, role, loading, navigate]);

  useEffect(() => {
    if (role === "admin") {
      fetchData();
    }
  }, [role]);

  const fetchData = async () => {
    // Fetch profiles
    const { data: profilesData } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (profilesData) setUsers(profilesData);

    // Fetch purchases
    const { data: purchasesData } = await supabase.from("purchases").select("*, plans(name, price)").order("created_at", { ascending: false });
    if (purchasesData) {
      setPurchases(purchasesData);
      const revenue = purchasesData.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
      const activeSubs = purchasesData.filter((p: any) => p.status === "active" && p.amount > 0).length;
      setStats(s => ({ ...s, totalRevenue: revenue, activeSubscribers: activeSubs }));
    }

    // Fetch activity
    const { data: activityData } = await supabase.from("user_activity").select("*").order("created_at", { ascending: false }).limit(200);
    if (activityData) {
      setActivity(activityData);
      setStats(s => ({ ...s, recentActivity: activityData.length }));
    }

    setStats(s => ({ ...s, totalUsers: profilesData?.length || 0 }));
  };

  if (loading || role !== "admin") return null;

  // Analytics data
  const eventCounts = activity.reduce((acc: Record<string, number>, a) => {
    acc[a.event_type] = (acc[a.event_type] || 0) + 1;
    return acc;
  }, {});
  const eventChartData = Object.entries(eventCounts).map(([name, value]) => ({ name, value }));

  const dailyActivity = activity.reduce((acc: Record<string, number>, a) => {
    const day = format(new Date(a.created_at), "MMM dd");
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  const dailyChartData = Object.entries(dailyActivity).map(([date, count]) => ({ date, count })).reverse();

  const COLORS = ["hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(262, 83%, 58%)", "hsl(199, 89%, 48%)", "hsl(0, 72%, 51%)"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">Manage users, track payments, and monitor system health.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Users</p>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold mt-1">{stats.totalUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Active Subscribers</p>
                <UserCheck className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold mt-1">{stats.activeSubscribers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold mt-1">₹{stats.totalRevenue}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Activity Events</p>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold mt-1">{stats.recentActivity}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users">
          <TabsList className="flex-wrap">
            <TabsTrigger value="users" className="gap-1"><Users className="h-3.5 w-3.5" /> Users</TabsTrigger>
            <TabsTrigger value="payments" className="gap-1"><CreditCard className="h-3.5 w-3.5" /> Payments</TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1"><BarChart3 className="h-3.5 w-3.5" /> Analytics</TabsTrigger>
            <TabsTrigger value="activity" className="gap-1"><Activity className="h-3.5 w-3.5" /> User Activity</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.full_name || "—"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">{u.user_id.slice(0, 8)}...</TableCell>
                        <TableCell>{u.phone || "—"}</TableCell>
                        <TableCell>{format(new Date(u.created_at), "dd MMM yyyy")}</TableCell>
                      </TableRow>
                    ))}
                    {users.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No users yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchases.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="text-xs font-mono">{p.user_id.slice(0, 8)}...</TableCell>
                        <TableCell className="font-medium">{(p as any).plans?.name}</TableCell>
                        <TableCell>₹{p.amount}</TableCell>
                        <TableCell>
                          <Badge variant={p.status === "active" ? "default" : "secondary"}>{p.status}</Badge>
                        </TableCell>
                        <TableCell>{p.payment_method || "—"}</TableCell>
                        <TableCell>{format(new Date(p.created_at), "dd MMM yyyy")}</TableCell>
                      </TableRow>
                    ))}
                    {purchases.length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No payments yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Activity Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={dailyChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                      <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Events Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={eventChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {eventChartData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Page</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activity.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{a.event_type}</Badge>
                        </TableCell>
                        <TableCell className="text-xs font-mono">{a.user_id?.slice(0, 8) || "anon"}...</TableCell>
                        <TableCell className="text-sm">{a.page_path || "—"}</TableCell>
                        <TableCell className="text-sm">{a.device_type || "—"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {format(new Date(a.created_at), "dd MMM HH:mm")}
                        </TableCell>
                      </TableRow>
                    ))}
                    {activity.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No activity tracked yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
