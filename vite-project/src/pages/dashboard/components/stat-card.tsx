import type React from 'react';

// 定义 StatCard 组件的 props 接口
export interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

// StatCard 组件定义
export function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
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