import { useEffect, useState } from "react";
import {
  getCandidateByEmail,
  getJobList,
  type Candidate,
  type Job,
} from "@/services/api";
import JobList from "@/components/JobList";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { AlertCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const CANDIDATE_EMAIL = "xyairx1@gmail.com";

const Index = () => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [candidateData, jobsData] = await Promise.all([
        getCandidateByEmail(CANDIDATE_EMAIL),
        getJobList(),
      ]);
      setCandidate(candidateData);
      setJobs(jobsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <h1 className="text-2xl font-bold text-card-foreground tracking-tight">
            Job Application Portal
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse open positions and submit your application
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {candidate && !loading && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border bg-card p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-card-foreground">
                {candidate.firstName} {candidate.lastName}
              </p>
              <p className="text-muted-foreground">{candidate.email}</p>
            </div>
          </div>
        )}

        <h2 className="text-lg font-semibold text-foreground mb-4">
          Open Positions
        </h2>

        {loading && <LoadingSkeleton />}

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-3" />
            <p className="text-sm text-destructive font-medium mb-1">
              Something went wrong
            </p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchData}>
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && candidate && (
          <JobList
            jobs={jobs}
            uuid={candidate.uuid}
            candidateId={candidate.candidateId}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
