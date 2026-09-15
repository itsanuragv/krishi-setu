"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatInr } from "@/lib/utils";

const DATA = [
  { week: "W1", sales: 12400 },
  { week: "W2", sales: 9800 },
  { week: "W3", sales: 15200 },
  { week: "W4", sales: 18100 },
];

export default function EarningsPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Earnings</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total sales</CardTitle>
          </CardHeader>
          <CardContent className="font-display text-2xl">{formatInr(55500)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Pending settlement</CardTitle>
          </CardHeader>
          <CardContent className="font-display text-2xl">{formatInr(480)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Deliveries</CardTitle>
          </CardHeader>
          <CardContent className="font-display text-2xl">12</CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Weekly sales</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#166534" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
