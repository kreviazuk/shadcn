import { cn } from "@/lib/utils";

const salesData = [
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
];

export function RecentSales() {
  return (
    <div className="col-span-3 rounded-lg border bg-card text-card-foreground shadow-sm lg:col-span-3">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-base font-semibold">Recent Sales</h3>
        <p className="text-sm text-muted-foreground">You made 265 sales this month.</p>
      </div>
      <div className="p-0">
        {/* 销售列表 */}
        {salesData.map((sale, i) => (
          <div key={i} className="flex items-center px-6 py-3">
            <div className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full mr-3 text-sm font-semibold",
              i === 0 ? "bg-rose-100 text-rose-700" : 
              i === 1 ? "bg-orange-100 text-orange-700" : 
              i === 2 ? "bg-yellow-100 text-yellow-700" : 
              i === 3 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
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
  );
} 