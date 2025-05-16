import {
  BriefcaseIcon,
  DollarSignIcon,
  UsersIcon,
  ActivityIcon
  // TrendingUpIcon, // Removed as it's used in subcomponents
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
// import { cn } from "@/lib/utils"; // Removed as it's used in subcomponents
import {
  StatCard,
  BarChartInteractive,
  RecentSales,
  AreaChartStacked,
  PieChartDonut,
} from './components';

export function DashboardPage() {
  return (
    <div className="space-y-4 p-4">
      {/* Tab 栏 */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="sticky top-0 z-10 bg-background py-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {/* 统计卡片 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Revenue"
              value="$45,231.89"
              description="+20.1% from last month"
              icon={DollarSignIcon}
            />
            <StatCard
              title="Subscriptions"
              value="+2350"
              description="+180.1% from last month"
              icon={UsersIcon}
            />
            <StatCard
              title="Sales"
              value="+12,234"
              description="+19% from last month"
              icon={BriefcaseIcon}
            />
            <StatCard
              title="Active Now"
              value="+573"
              description="+201 since last hour"
              icon={ActivityIcon}
            />
          </div>

          {/* 图表和最近销售区域 */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-7">
            <BarChartInteractive />
            <RecentSales />
          </div>

          {/* 底部图表区域 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <AreaChartStacked />
            <PieChartDonut />
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="p-8 text-center text-muted-foreground">
            Analytics content will be displayed here. 
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// StatCardProps 和 StatCard 函数定义已移至 ./components/stat-card.tsx 