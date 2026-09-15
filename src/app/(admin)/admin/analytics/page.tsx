"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DATA = [
  { day: "Mon", gmv: 42000 },
  { day: "Tue", gmv: 51000 },
  { day: "Wed", gmv: 39000 },
  { day: "Thu", gmv: 64000 },
  { day: "Fri", gmv: 72000 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>GMV this week</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={DATA}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="gmv" stroke="#166534" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
