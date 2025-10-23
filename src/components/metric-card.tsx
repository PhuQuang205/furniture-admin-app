import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
	title: string;
	value: string;
	icon: LucideIcon;
	color: string;
}

export function MetricCard({
	title,
	value,
	icon: Icon,
	color,
}: MetricCardProps) {

	return (
		<Card className="border-2">
			<CardContent className="p-4">
				<div className="flex items-start justify-between mb-4">
					<div>
						<p className="text-sm text-muted-foreground mb-1">{title}</p>
						<p className="text-2xl font-bold">{value}</p>
					</div>
					<div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
						<Icon className={`size-10 ${color}`} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
