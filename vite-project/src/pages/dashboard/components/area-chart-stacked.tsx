import { TrendingUpIcon } from "lucide-react";

export function AreaChartStacked() {
  const bottomLayerData = [70, 90, 60, 80, 75, 100]; // Sample heights for bottom layer
  const topLayerData = [40, 50, 30, 45, 35, 55]; // Sample heights for top layer
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  return (
    <div className="col-span-4 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <div className="flex flex-col space-y-1.5">
          <h3 className="text-base font-semibold">Area Chart - Stacked</h3>
          <p className="text-sm text-muted-foreground">Showing total visitors for the last 6 months</p>
        </div>
        <div className="mt-4 h-[220px]">
          <div className="h-full flex flex-col justify-end">
            <div className="flex items-end justify-around h-[180px] px-1">
              {months.map((_, index) => (
                <div key={index} className="w-full flex flex-col-reverse items-center mx-0.5">
                  <div style={{ height: `${topLayerData[index]}px` }} className="w-full bg-orange-200 opacity-70 rounded-t-sm"></div>
                  <div style={{ height: `${bottomLayerData[index]}px` }} className="w-full bg-teal-300 opacity-70 rounded-t-sm"></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2 border-t pt-2">
              {months.map(month => <span key={month}>{month}</span>)}
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <TrendingUpIcon className="h-4 w-4 mr-1 text-green-500" />
            <span>Trending up by 5.2% this month</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">January - June 2024</p>
        </div>
      </div>
    </div>
  );
} 