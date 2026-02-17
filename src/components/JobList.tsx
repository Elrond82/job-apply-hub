import type { Job } from "@/services/api";
import JobCard from "@/components/JobCard";

interface JobListProps {
  jobs: Job[];
  uuid: string;
  candidateId: string;
}

const JobList = ({ jobs, uuid, candidateId }: JobListProps) => {
  if (jobs.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No open positions available at this time.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          uuid={uuid}
          candidateId={candidateId}
        />
      ))}
    </div>
  );
};

export default JobList;
