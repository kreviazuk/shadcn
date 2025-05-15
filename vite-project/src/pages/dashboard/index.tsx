import {
  BriefcaseIcon,
  DollarSignIcon,
  UsersIcon,
  ActivityIcon,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function OverviewPage() {
  return (
    <div className="space-y-4">
      {/* Tab 栏 */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
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
            {/* 图表区域 */}
            <div className="col-span-3 rounded-lg border bg-card text-card-foreground shadow-sm md:col-span-2 lg:col-span-4">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-base font-semibold">Bar Chart - Interactive</h3>
                <p className="text-sm text-muted-foreground">Showing total visitors for the last 3 months</p>
              </div>
              <div className="p-6 pt-0">
                {/* 图表部分 - 在实际应用中可能需要使用图表库 */}
                <div className="h-[300px] flex flex-col">
                  <div className="flex justify-between mt-auto">
                    <div className="p-3 bg-muted/70 rounded">
                      <div className="text-lg font-semibold">Desktop</div>
                      <div className="text-2xl font-bold">24,828</div>
                    </div>
                    <div className="p-3 bg-muted/40 rounded">
                      <div className="text-lg font-semibold">Mobile</div>
                      <div className="text-2xl font-bold">25,010</div>
                    </div>
                  </div>
                  <div className="h-[220px] flex items-end gap-1 mt-2">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2 bg-rose-200/80 rounded-t"
                        style={{ height: `${20 + Math.random() * 150}px` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <div>Apr 1</div>
                    <div>Apr 15</div>
                    <div>May 1</div>
                    <div>May 15</div>
                    <div>Jun 1</div>
                    <div>Jun 15</div>
                    <div>Jun 30</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 最近销售区域 */}
            <div className="col-span-3 rounded-lg border bg-card text-card-foreground shadow-sm lg:col-span-3">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-base font-semibold">Recent Sales</h3>
                <p className="text-sm text-muted-foreground">You made 265 sales this month.</p>
              </div>
              <div className="p-0">
                {/* 销售列表 */}
                {[
                  {
                    initials: "OM",
                    name: "Olivia Martin",
                    email: "olivia.martin@email.com",
                    price: "+$1,999.00"
                  },
                  {
                    initials: "JL",
                    name: "Jackson Lee",
                    email: "jackson.lee@email.com",
                    price: "+$39.00"
                  },
                  {
                    initials: "IN",
                    name: "Isabella Nguyen",
                    email: "isabella.nguyen@email.com",
                    price: "+$299.00"
                  },
                  {
                    initials: "WK",
                    name: "William Kim",
                    email: "will@email.com",
                    price: "+$99.00"
                  },
                  {
                    initials: "SD",
                    name: "Sofia Davis",
                    email: "sofia.davis@email.com",
                    price: "+$39.00"
                  }
                ].map((sale, i) => (
                  <div key={i} className="flex items-center px-6 py-3">
                    <div className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full mr-3 text-sm font-semibold",
                      i === 0 ? "bg-rose-100" : 
                      i === 1 ? "bg-orange-100" : 
                      i === 2 ? "bg-yellow-100" : 
                      i === 3 ? "bg-green-100" : "bg-blue-100"
                    )}>
                      {sale.initials}
                    </div>
                    <div className="ml-3 flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{sale.name}</p>
                      <p className="text-sm text-muted-foreground">{sale.email}</p>
                    </div>
                    <div className="text-sm font-medium">{sale.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 底部图表区域 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-medium">Area Chart - Stacked</h3>
                <div className="h-[300px] mt-2 flex items-end">
                  <div className="text-muted-foreground text-sm">
                    图表占位...
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-3 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-medium">Pie Chart - Donut with Text</h3>
                <div className="h-[300px] mt-2 flex items-center justify-center">
                  <div className="text-muted-foreground text-sm">
                    图表占位...
                  </div>
                </div>
              </div>
            </div>
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

// 统计卡片组件
interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex items-center justify-between space-x-2">
        <h3 className="font-semibold tracking-tight">{title}</h3>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="text-3xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
} 