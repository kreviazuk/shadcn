import { TrendingUpIcon } from "lucide-react";

export function PieChartDonut() {
  return (
    <div className="col-span-3 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <div className="flex flex-col space-y-1.5">
          <h3 className="text-base font-semibold">Pie Chart - Donut with Text</h3>
          <p className="text-sm text-muted-foreground">January - June 2024</p>
        </div>
        <div className="h-[220px] mt-4 flex flex-col items-center justify-center relative">
          <div className="relative w-44 h-44 sm:w-48 sm:h-48">
            <div className="absolute inset-0 rounded-full bg-teal-500"></div>
            <div className="absolute inset-6 sm:inset-7 rounded-full bg-card"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl font-bold">1,125</span>
              <span className="text-xs text-muted-foreground">Visitors</span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <TrendingUpIcon className="h-4 w-4 mr-1 text-green-500" />
            <span>Trending up by 5.2% this month</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Showing total visitors for the last 6 months</p>
        </div>
      </div>
    </div>
  );
} 