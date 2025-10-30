import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Stat } from '@/types';

interface StatCardProps {
  stat: Stat;
}

export default function StatCard({ stat }: StatCardProps) {
  return (
    <Card className="shadow-card hover:shadow-card-hover transition-smooth">
      <CardContent className="p-6">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          {stat.label}
        </h3>
        <div className="flex items-baseline justify-between">
          <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          {stat.change && (
            <div className="flex items-center gap-1 text-sm text-success">
              {stat.trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{stat.change}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
