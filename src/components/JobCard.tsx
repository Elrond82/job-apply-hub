import { useState } from "react";
import { applyToJob, type Job } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface JobCardProps {
  job: Job;
  uuid: string;
  candidateId: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

const JobCard = ({ job, uuid, candidateId }: JobCardProps) => {
  // Seteamos tu repositorio real por defecto para evitar errores manuales
  const [repoUrl, setRepoUrl] = useState("https://github.com/Elrond82/job-apply-hub");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (!repoUrl.trim()) {
      setStatus("error");
      setErrorMessage("Please enter a GitHub repository URL.");
      return;
    }

    if (!uuid || !candidateId) {
      setStatus("error");
      setErrorMessage("Error: Faltan datos del candidato (uuid o candidateId). Por favor recarga la página.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    const payload = {
      uuid,
      jobId: job.id,
      applicationId: job.id,
      candidateId: uuid,
      repoUrl: repoUrl.trim(),
    };

    console.log("Enviando postulación (Step 5):", payload);

    try {
      const result = await applyToJob(payload as any);

      if (result.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage("Application was not accepted. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    }
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground leading-tight">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              ID: {job.id}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="url"
            placeholder="https://github.com/user/repo"
            value={repoUrl}
            onChange={(e) => {
              setRepoUrl(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            disabled={status === "loading" || status === "success"}
            className="flex-1"
            aria-label={`GitHub repository URL for ${job.title}`}
          />
          <Button
            onClick={handleSubmit}
            disabled={status === "loading" || status === "success"}
            className="shrink-0 min-w-[100px]"
          >
            {status === "loading" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            )}
            {status === "success" ? "Applied" : "Submit"}
          </Button>
        </div>

        {status === "error" && errorMessage && (
          <div className="flex items-center gap-2 mt-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {status === "success" && (
          <div className="flex items-center gap-2 mt-3 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Application submitted successfully.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobCard;