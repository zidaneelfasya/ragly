import { Card, CardHeader, CardContent } from "./ui/card";
import { CheckCircle2, Clock, HelpCircle } from "lucide-react";

export type TicketStatus = "diajukan" | "proses" | "selesai";

interface StatusStep {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  date?: string;
  description?: string;
}

interface TicketStatusProps {
  status: TicketStatus;
  submittedAt: string;
  answeredAt?: string;
}

const statusSteps = (
  status: TicketStatus,
  submittedAt: string,
  answeredAt?: string
): StatusStep[] => [
  {
    label: "Diajukan",
    icon: <HelpCircle className="text-primary" />,
    active: true,
    date: submittedAt,
  },
  {
    label: "Dalam Proses",
    icon: <Clock className={status !== "selesai" ? "text-primary" : "text-muted-foreground"} />,
    active: status !== "diajukan",
    date: submittedAt,
  },
  {
    label: "Selesai",
    icon: <CheckCircle2 className={status === "selesai" ? "text-primary" : "text-muted-foreground"} />,
    active: status === "selesai",
    date: answeredAt,
    description: status === "selesai" ? "Tiket telah dijawab." : undefined,
  },
];

export function TicketStatusSteps({ status, submittedAt, answeredAt }: TicketStatusProps) {
  const steps = statusSteps(status, submittedAt, answeredAt);
  return (
    <Card className="mb-4">
      <CardHeader>
        <span className="font-semibold text-lg">Status Tiket</span>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {steps.map((step) => (
            <div key={step.label} className="flex items-start gap-3">
              <div className="mt-1">{step.icon}</div>
              <div>
                <div className={`font-medium ${step.active ? "text-primary" : "text-muted-foreground"}`}>{step.label}</div>
                <div className="text-xs text-muted-foreground">{step.date}</div>
                {step.description && <div className="text-xs mt-1">{step.description}</div>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
