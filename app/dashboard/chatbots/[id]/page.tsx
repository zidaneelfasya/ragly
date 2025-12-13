"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
	ArrowLeft,
	Bot,
	Globe,
	Lock,
	Edit,
	Trash2,
	Users,
	MessageSquare,
	Calendar,
	Settings,
	FileText,
	Zap,
	Activity,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useChatbot } from "@/hooks/useChatbot";
import { toast } from "sonner";
import DeleteConfirmDialog from "@/components/delete-confirm-dialog";
import KnowledgeBaseManager from "@/components/knowledge-base-manager";

export default function ChatbotDetailPage() {
	const params = useParams();
	const router = useRouter();
	const chatbotId = params.id as string;

	const [chatbot, setChatbot] = useState<any>(null);
	const [deletingChatbot, setDeletingChatbot] = useState(false);
	const { fetchChatbot, deleteChatbot, isLoading } = useChatbot();

	useEffect(() => {
		if (chatbotId) {
			loadChatbot();
		}
	}, [chatbotId]);

	const loadChatbot = async () => {
		try {
			const data = await fetchChatbot(chatbotId);
			if (data) {
				setChatbot(data);
			} else {
				toast.error("Chatbot not found");
				router.push("/dashboard/chatbots");
			}
		} catch (error) {
			toast.error("Failed to load chatbot details");
			router.push("/dashboard/chatbots");
		}
	};

	const handleDeleteChatbot = async () => {
		if (!chatbot) return;

		setDeletingChatbot(true);

		try {
			const result = await deleteChatbot(chatbot.id);

			if (result.success) {
				toast.success(`Chatbot "${chatbot.name}" deleted successfully`);
				router.push("/dashboard/chatbots");
			} else {
				toast.error(result.error || "Failed to delete chatbot");
			}
		} catch (error) {
			console.error("Error deleting chatbot:", error);
			toast.error("An unexpected error occurred while deleting");
		} finally {
			setDeletingChatbot(false);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
			case "draft":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
			case "inactive":
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background">
				<div className="max-w-7xl mx-auto px-6 py-8">
					<div className="animate-pulse space-y-6">
						<div className="h-8 bg-muted rounded w-1/3"></div>
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<div className="lg:col-span-2 space-y-6">
								<div className="h-64 bg-muted rounded-xl"></div>
								<div className="h-48 bg-muted rounded-xl"></div>
							</div>
							<div className="space-y-6">
								<div className="h-32 bg-muted rounded-xl"></div>
								<div className="h-48 bg-muted rounded-xl"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!chatbot) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<Bot className="mx-auto mb-4 text-muted-foreground" size={64} />
					<h2 className="text-2xl font-semibold text-foreground mb-2">
						Chatbot not found
					</h2>
					<p className="text-muted-foreground mb-4">
						The chatbot you're looking for doesn't exist or you don't have
						access to it.
					</p>
					<Link href="/dashboard/chatbots">
						<Button>
							<ArrowLeft size={16} className="mr-2" />
							Back to Chatbots
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="border-b border-border bg-card">
				<div className="max-w-7xl mr-auto px-4 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Link href="/dashboard/chatbots">
								<Button variant="ghost" size="sm">
									<ArrowLeft size={16} className="" />
									Back
								</Button>
							</Link>
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
									<Bot size={24} className="text-primary-foreground" />
								</div>
								<div>
									<h1 className="text-3xl font-bold text-foreground">
										{chatbot.name}
									</h1>
									<p className="text-muted-foreground">
										{chatbot.model} • Created {formatDate(chatbot.created_at)}
									</p>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<Badge className={getStatusColor(chatbot.status)}>
								{chatbot.status}
							</Badge>
							<Link href={`/dashboard/chatbots/edit/${chatbot.id}`}>
								<Button variant="outline">
									<Edit size={16} className="mr-2" />
									Edit
								</Button>
							</Link>
							<DeleteConfirmDialog
								title="Delete Chatbot"
								description={`This will permanently delete "${chatbot.name}" and all its data. This action cannot be undone.`}
								onConfirm={handleDeleteChatbot}
								isLoading={deletingChatbot}
							>
								<Button variant="destructive">
									<Trash2 size={16} className="mr-2" />
									Delete
								</Button>
							</DeleteConfirmDialog>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-6 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column - Main Details */}
					<div className="lg:col-span-2 space-y-6">
						{/* Overview Card */}
						<Card className="bg-gradient-to-br from-background to-muted/20 border-border shadow-sm">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-lg font-semibold">
									<div className="p-2 rounded-lg bg-primary/10">
										<Settings size={18} className="text-primary" />
									</div>
									Overview
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Grid Layout dengan pembagian yang lebih seimbang */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Basic Information Section */}
									<div className="space-y-4">
										<div className="flex items-center gap-2">
											<div className="w-1.5 h-4 bg-primary rounded-full"></div>
											<h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
												Basic Information
											</h3>
										</div>

										<div className="space-y-3">
											<div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:bg-muted/30 transition-colors">
												<div className="flex items-center gap-2">
													<div className="w-2 h-2 rounded-full bg-primary/60"></div>
													<span className="text-sm text-muted-foreground">
														Name
													</span>
												</div>
												<span className="font-medium text-sm">
													{chatbot.name}
												</span>
											</div>

											<div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:bg-muted/30 transition-colors">
												<div className="flex items-center gap-2">
													<div className="w-2 h-2 rounded-full bg-blue-500/60"></div>
													<span className="text-sm text-muted-foreground">
														Model
													</span>
												</div>
												<span className="font-medium text-sm">
													{chatbot.model}
												</span>
											</div>

											<div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:bg-muted/30 transition-colors">
												<div className="flex items-center gap-2">
													<div className="w-2 h-2 rounded-full bg-green-500/60"></div>
													<span className="text-sm text-muted-foreground">
														Language
													</span>
												</div>
												<span className="font-medium text-sm">
													{chatbot.language || "English"}
												</span>
											</div>

											<div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:bg-muted/30 transition-colors">
												<div className="flex items-center gap-2">
													<div className="w-2 h-2 rounded-full bg-purple-500/60"></div>
													<span className="text-sm text-muted-foreground">
														Visibility
													</span>
												</div>
												<div className="flex items-center gap-1.5">
													{chatbot.is_public ? (
														<>
															<Globe size={14} className="text-green-600" />
															<span className="font-medium text-sm">
																Public
															</span>
														</>
													) : (
														<>
															<Lock size={14} className="text-amber-600" />
															<span className="font-medium text-sm">
																Private
															</span>
														</>
													)}
												</div>
											</div>
										</div>
									</div>

									{/* Configuration Section */}
									<div className="space-y-4">
										<div className="flex items-center gap-2">
											<div className="w-1.5 h-4 bg-secondary rounded-full"></div>
											<h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
												Configuration
											</h3>
										</div>

										<div className="space-y-3">
											<div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:bg-muted/30 transition-colors">
												<div className="flex items-center gap-2">
													<div className="w-2 h-2 rounded-full bg-orange-500/60"></div>
													<span className="text-sm text-muted-foreground">
														Temperature
													</span>
												</div>
												<div className="flex items-center gap-2">
													<div className="w-16 bg-muted rounded-full h-1.5">
														<div
															className="bg-gradient-to-r from-orange-500 to-amber-500 h-1.5 rounded-full"
															style={{
																width: `${(chatbot.temperature || 0.7) * 100}%`,
															}}
														></div>
													</div>
													<span className="font-medium text-sm w-8 text-right">
														{chatbot.temperature || 0.7}
													</span>
												</div>
											</div>

											<div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:bg-muted/30 transition-colors">
												<div className="flex items-center gap-2">
													<div className="w-2 h-2 rounded-full bg-pink-500/60"></div>
													<span className="text-sm text-muted-foreground">
														Tone
													</span>
												</div>
												<Badge
													variant="outline"
													className="capitalize font-normal"
												>
													{chatbot.tone || "Friendly"}
												</Badge>
											</div>

											<div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:bg-muted/30 transition-colors">
												<div className="flex items-center gap-2">
													<div className="w-2 h-2 rounded-full bg-cyan-500/60"></div>
													<span className="text-sm text-muted-foreground">
														Status
													</span>
												</div>
												<Badge
													className={`${getStatusColor(
														chatbot.status
													)} px-2 py-1 text-xs font-medium`}
												>
													<div
														className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
															chatbot.status === "active"
																? "bg-green-500"
																: chatbot.status === "draft"
																? "bg-yellow-500"
																: "bg-gray-500"
														}`}
													></div>
													{chatbot.status}
												</Badge>
											</div>
										</div>
									</div>
								</div>

								{/* Personality Section dengan design yang lebih refined */}
								{chatbot.personality && (
									<>
										<Separator className="bg-border/50" />
										<div className="space-y-3">
											<div className="flex items-center gap-2">
												<div className="w-1.5 h-4 bg-accent rounded-full"></div>
												<h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
													Personality
												</h3>
											</div>
											<div className="p-4 rounded-lg bg-background border border-border">
												<p className="text-sm text-foreground leading-relaxed">
													{chatbot.personality}
												</p>
											</div>
										</div>
									</>
								)}
							</CardContent>
						</Card>

						{/* Messages Configuration */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<MessageSquare size={20} />
									Message Configuration
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<h3 className="font-semibold mb-2">Welcome Message</h3>
									<p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
										{chatbot.welcome_message ||
											"Hello! How can I help you today?"}
									</p>
								</div>

								<div>
									<h3 className="font-semibold mb-2">Fallback Message</h3>
									<p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
										{chatbot.fallback_message ||
											"I'm sorry, I didn't understand that. Could you please rephrase your question?"}
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Knowledge Base */}
						<KnowledgeBaseManager chatbotId={chatbot.id} />
					</div>

					{/* Right Column - Stats and Actions */}
					<div className="space-y-6">
						{/* Quick Actions */}
						<Card>
							<CardHeader>
								<CardTitle>Quick Actions</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<Button className="w-full" size="sm">
									<MessageSquare size={16} className="mr-2" />
									Test Chat
								</Button>
								<Button variant="outline" className="w-full" size="sm">
									<Activity size={16} className="mr-2" />
									View Analytics
								</Button>
								<Button variant="outline" className="w-full" size="sm">
									<Zap size={16} className="mr-2" />
									Deploy
								</Button>
							</CardContent>
						</Card>

						{/* Stats Card */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Activity size={20} />
									Statistics
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 text-muted-foreground">
										<Users size={16} />
										<span>Total Chats</span>
									</div>
									<span className="font-semibold">0</span>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 text-muted-foreground">
										<MessageSquare size={16} />
										<span>Messages</span>
									</div>
									<span className="font-semibold">0</span>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 text-muted-foreground">
										<Calendar size={16} />
										<span>Created</span>
									</div>
									<span className="font-semibold text-sm">
										{new Date(chatbot.created_at).toLocaleDateString()}
									</span>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 text-muted-foreground">
										<Edit size={16} />
										<span>Last Updated</span>
									</div>
									<span className="font-semibold text-sm">
										{new Date(
											chatbot.updated_at || chatbot.created_at
										).toLocaleDateString()}
									</span>
								</div>
							</CardContent>
						</Card>

						{/* Additional Info */}
						<Card>
							<CardHeader>
								<CardTitle>Additional Information</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div>
									<span className="text-sm text-muted-foreground">
										Chatbot ID:
									</span>
									<p className="font-mono text-xs bg-muted/50 p-2 rounded mt-1">
										{chatbot.id}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
