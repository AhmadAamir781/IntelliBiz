"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { businessApi } from "@/lib/api";
import { BarChartComponent } from "@/components/ui/chart";

export default function BusinessAnalyticsPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        const res = await businessApi.getAllBusinesses();
        setBusinesses(res.data || []);
      } catch (err: any) {
        setError(err?.message || "Failed to fetch businesses.");
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  // Analytics calculations
  const total = businesses.length;
  const totalVerified = businesses.filter(b => b.isVerified).length;
  const totalPending = businesses.filter(b => !b.isVerified).length;
  const avgRating = businesses.length > 0 ? (
    businesses.reduce((sum, b) => sum + (b.rating || 0), 0) / businesses.length
  ).toFixed(2) : "0.00";
  const byCategory: Record<string, number> = {};
  businesses.forEach(b => {
    if (b.category) byCategory[b.category] = (byCategory[b.category] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Analytics</CardTitle>
          <CardDescription>Overview and statistics for all businesses.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-32 w-full" />
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-muted rounded-md">
                <div className="text-lg font-bold">{total}</div>
                <div className="text-sm text-muted-foreground">Total Businesses</div>
              </div>
              <div className="p-4 bg-muted rounded-md">
                <div className="text-lg font-bold">{totalVerified}</div>
                <div className="text-sm text-muted-foreground">Verified</div>
              </div>
              <div className="p-4 bg-muted rounded-md">
                <div className="text-lg font-bold">{totalPending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="p-4 bg-muted rounded-md">
                <div className="text-lg font-bold">{avgRating}</div>
                <div className="text-sm text-muted-foreground">Avg. Rating</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Businesses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div>
              <div className="h-64 w-full flex items-center justify-center rounded mb-6">
                <BarChartComponent
                  data={Object.entries(byCategory).map(([cat, count]) => ({ category: cat, count }))}
                  xKey="category"
                  yKey="count"
                  color="#6366f1"
                  height={250}
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(byCategory).map(([cat, count]) => (
                    <TableRow key={cat}>
                      <TableCell>{cat}</TableCell>
                      <TableCell>{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 