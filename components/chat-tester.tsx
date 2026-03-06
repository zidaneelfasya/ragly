"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, X, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Message {
	type: "bot" | "user";
	text: string;
	timestamp: string;
	decision?: string;
}

interface ChatTesterProps {
	chatbotId: string;
	chatbotName: string;
	chatbotPersonality?: string;
	welcomeMessage?: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function ChatTester({
	chatbotId,
	chatbotName,
	chatbotPersonality,
	welcomeMessage,
	open,
	onOpenChange,
}: ChatTesterProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Initialize with welcome message
	useEffect(() => {
		if (open && messages.length === 0) {
			const initialMessage: Message = {
				type: "bot",
				text: welcomeMessage || "Halo! Ada yang bisa saya bantu? 😊",
				timestamp: new Date().toLocaleTimeString("en-US", {
					hour: "numeric",
					minute: "2-digit",
				}),
			};
			setMessages([initialMessage]);
		}
	}, [open, welcomeMessage]);

	// Auto scroll to bottom
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSendMessage = async () => {
		if (!input.trim() || isLoading) return;

		const userMessage = input.trim();
		const timestamp = new Date().toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
		});

		// Add user message
		const newUserMessage: Message = {
			type: "user",
			text: userMessage,
			timestamp,
		};
		setMessages((prev) => [...prev, newUserMessage]);
		setInput("");
		setIsLoading(true);

		try {
			const response = await fetch(`/api/chatbots/${chatbotId}/chat`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: userMessage,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to get response");
			}

			const data = await response.json();

			// Add bot response
			const botMessage: Message = {
				type: "bot",
				text: data.reply,
				timestamp: new Date().toLocaleTimeString("en-US", {
					hour: "numeric",
					minute: "2-digit",
				}),
				decision: data.decision,
			};
			setMessages((prev) => [...prev, botMessage]);
		} catch (error) {
			console.error("Error sending message:", error);
			toast.error("Gagal mengirim pesan. Silakan coba lagi.");

			// Add error message
			const errorMessage: Message = {
				type: "bot",
				text: "Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.",
				timestamp: new Date().toLocaleTimeString("en-US", {
					hour: "numeric",
					minute: "2-digit",
				}),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleReset = () => {
		const initialMessage: Message = {
			type: "bot",
			text: welcomeMessage || "Halo! Ada yang bisa saya bantu? 😊",
			timestamp: new Date().toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
			}),
		};
		setMessages([initialMessage]);
		setInput("");
		toast.success("Percakapan telah direset");
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl h-[90vh] flex flex-col p-0">
				<DialogHeader className="px-6 pt-6 pb-4 border-b">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
								<Bot size={20} className="text-primary-foreground" />
							</div>
							<div>
								<DialogTitle className="text-lg">
									Test Chatbot: {chatbotName}
								</DialogTitle>
								<DialogDescription className="text-xs">
									Live testing dengan response asli
								</DialogDescription>
							</div>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={handleReset}
							className="text-xs"
						>
							Reset Chat
						</Button>
					</div>
				</DialogHeader>

				{/* Chat Area */}
				<div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-muted/20">
					{messages.map((msg, index) => (
						<div
							key={index}
							className={`flex ${
								msg.type === "user" ? "justify-end" : "justify-start"
							} animate-in fade-in slide-in-from-bottom-2`}
						>
							<div
								className={`flex gap-2 max-w-[85%] ${
									msg.type === "user" ? "flex-row-reverse" : "flex-row"
								}`}
							>
								{/* Avatar */}
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
										msg.type === "user" ? "bg-primary" : "bg-secondary"
									}`}
								>
									{msg.type === "user" ? (
										<User size={16} className="text-primary-foreground" />
									) : (
										<Bot size={16} className="text-secondary-foreground" />
									)}
								</div>

								{/* Message bubble */}
								<div className="flex flex-col gap-1">
									<div
										className={`rounded-2xl px-4 py-2.5 text-sm ${
											msg.type === "user"
												? "bg-primary text-primary-foreground rounded-tr-sm"
												: "bg-muted text-foreground border border-border rounded-tl-sm"
										}`}
									>
										<p className="whitespace-pre-wrap break-words">{msg.text}</p>
										{msg.decision && (
											<p className="text-xs opacity-70 mt-1">
												Decision: {msg.decision}
											</p>
										)}
									</div>
									<span
										className={`text-xs text-muted-foreground px-2 ${
											msg.type === "user" ? "text-right" : "text-left"
										}`}
									>
										{msg.timestamp}
									</span>
								</div>
							</div>
						</div>
					))}

					{/* Loading indicator */}
					{isLoading && (
						<div className="flex justify-start animate-in fade-in">
							<div className="flex gap-2 max-w-[85%]">
								<div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
									<Bot size={16} className="text-secondary-foreground" />
								</div>
								<div className="rounded-2xl rounded-tl-sm px-4 py-2.5 bg-muted border border-border">
									<div className="flex items-center gap-2">
										<Loader2 size={16} className="animate-spin" />
										<span className="text-sm text-muted-foreground">
											Mengetik...
										</span>
									</div>
								</div>
							</div>
						</div>
					)}

					<div ref={messagesEndRef} />
				</div>

				{/* Info Banner */}
				<div className="px-6 py-2 bg-blue-50 dark:bg-blue-950/20 border-t border-blue-200 dark:border-blue-900">
					<div className="flex items-start gap-2 text-xs text-blue-800 dark:text-blue-200">
						<AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
						<p>
							Ini adalah mode testing dengan response asli dari chatbot Anda.
							Response menggunakan knowledge base dan decision making yang sama
							dengan Telegram bot.
						</p>
					</div>
				</div>

				{/* Input Area */}
				<div className="border-t px-6 py-4 bg-card">
					<div className="flex gap-2">
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
							placeholder="Ketik pesan Anda..."
							disabled={isLoading}
							className="flex-1 px-3 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
						/>
						<Button
							onClick={handleSendMessage}
							disabled={!input.trim() || isLoading}
							className="flex items-center justify-center px-4"
						>
							{isLoading ? (
								<Loader2 size={18} className="animate-spin" />
							) : (
								<>
									<Send size={18} className="mr-2" />
									Kirim
								</>
							)}
						</Button>
					</div>
					<p className="text-xs text-muted-foreground mt-2">
						Response menggunakan model {chatbotPersonality || "AI"} Anda
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}
