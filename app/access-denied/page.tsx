import DarkVeil from "@/components/dark-veil";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldX, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AccessDeniedPage() {
	return (
		<div className="min-h-screen flex items-center justify-center relative overflow-hidden">
			{/* Dark Veil Background */}
			<div className="absolute inset-0 z-0">
				<DarkVeil 
					hueShift={29}
					speed={0.5}
					noiseIntensity={0.02}
					scanlineIntensity={0.1}
					warpAmount={0.3}
				/>
			</div>
			
			{/* Overlay for better contrast */}
			<div className="absolute inset-0  z-10"></div>
			
			<div className="relative z-20 w-full flex items-center justify-center">
				{/* Background decorative elements */}
				<div className="absolute inset-0 overflow-hidden z-30">
					<div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
					<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-500"></div>
				</div>

				{/* Main glass card */}
				<Card className="glass-card bg-card/60 backdrop-blur-md border border-hidden p-8 md:p-12 max-w-md w-full mx-4 relative z-40 animate-fade-in shadow-2xl">
					<div className="text-center space-y-6">
						{/* Icon */}
						<div className="flex justify-center">
							<div className="p-4 rounded-full bg-destructive/10 backdrop-blur-sm">
								<ShieldX className="w-12 h-12 text-destructive" />
							</div>
						</div>

						{/* Main heading */}
						<div className="space-y-2">
							<h1 className="text-3xl md:text-4xl font-black text-white text-foreground text-balance">
								Access Denied
							</h1>
							<div className="w-16 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
						</div>

						{/* Description */}
						<p className="text-white text-lg leading-relaxed text-pretty">
							You don't have permission to view this page. Please contact your
							administrator if you believe this is an error.
						</p>

						{/* Action buttons */}
						<div className="space-y-3 pt-4">
							<Button
								asChild
								className="w-full bg-primary/90 hover:bg-primary text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
							>
								<Link href="/">
									<ArrowLeft className="w-4 h-4 mr-2" />
									Go Back Home
								</Link>
							</Button>

							<Button
								variant="outline"
								asChild
								className="w-full glass-card bg-card/30 hover:bg-card/40 border-border/50 backdrop-blur-sm text-white font-medium py-3 rounded-lg transition-all duration-200 hover:scale-105"
							>
								<Link href="/contact">Contact Support</Link>
							</Button>
						</div>
					</div>
				</Card>

				{/* Floating particles effect */}
				<div className="absolute inset-0 pointer-events-none z-30">
					{[...Array(6)].map((_, i) => (
						<div
							key={i}
							className={`absolute w-2 h-2 bg-primary/20 rounded-full animate-float`}
							style={{
								left: `${Math.random() * 100}%`,
								top: `${Math.random() * 100}%`,
								animationDelay: `${i * 0.5}s`,
								animationDuration: `${3 + Math.random() * 2}s`,
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
