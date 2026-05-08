import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon, LucideIcon } from "lucide-react"

interface Stat {
  name: string
  value: string | number
  description: string
  trend?: string
  trendValue?: string
  icon?: LucideIcon
}

interface SectionCardsProps {
  stats: Stat[]
}

export function SectionCards({ stats }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="@container/card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardDescription>{stat.name}</CardDescription>
                {Icon && <Icon className="size-4 text-muted-foreground" />}
              </div>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stat.value}
              </CardTitle>
              {stat.trend && (
                <CardAction>
                  <Badge variant="outline">
                    {stat.trend === "up" ? (
                      <TrendingUpIcon className="mr-1 size-3" />
                    ) : (
                      <TrendingDownIcon className="mr-1 size-3" />
                    )}
                    {stat.trendValue}
                  </Badge>
                </CardAction>
              )}
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {stat.description}
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

