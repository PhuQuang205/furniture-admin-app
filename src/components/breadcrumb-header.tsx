import Link from "next/link";
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import React from "react";
import { cn } from "@/lib/utils";

interface BreadcrumbType {
	label: string;
	href?: string;
}

interface PageHeaderProps {
	title: string;
	breadcrumbs: BreadcrumbType[];
	className?: string
}

export default function BreadcrumbHeader({
	title,
	breadcrumbs,
	className
}: PageHeaderProps) {
	return (
		<div className={cn("h-70 bg-subbg flex flex-col items-center justify-center gap-4", className)}>
			<h1 className={cn("text-5xl text-center lg:text-7xl font-semibold")}>{title}</h1>
			<div>
				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbs.map((item, index) => {
							const isLast = index === breadcrumbs.length - 1;
							return (
								<React.Fragment key={index}>
									<BreadcrumbItem>
										{item.href && !isLast ? (
											<BreadcrumbLink asChild>
												<Link href={item.href}>{item.label}</Link>
											</BreadcrumbLink>
										) : (
											<BreadcrumbPage>{item.label}</BreadcrumbPage>
										)}
									</BreadcrumbItem>

									{!isLast && <BreadcrumbSeparator />}
								</React.Fragment>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</div>
	);
}
