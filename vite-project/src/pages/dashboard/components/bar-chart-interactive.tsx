export function BarChartInteractive() {
  return (
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
  );
} 