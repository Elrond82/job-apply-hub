const BASE_URL =
  "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";

export interface Candidate {
  uuid: string;
  candidateId: string;
  applicationId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Job {
  id: string;
  title: string;
}

export interface ApplyPayload {
  uuid: string;
  jobId: string;
  candidateId: string;
  repoUrl: string;
}

export interface ApplyResponse {
  ok: boolean;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "Unknown error");
    throw new Error(`API error (${response.status}): ${text}`);
  }
  return response.json();
}

export async function getCandidateByEmail(
  email: string
): Promise<Candidate> {
  const response = await fetch(
    `${BASE_URL}/api/candidate/get-by-email?email=${encodeURIComponent(email)}`
  );
  return handleResponse<Candidate>(response);
}

export async function getJobList(): Promise<Job[]> {
  const response = await fetch(`${BASE_URL}/api/jobs/get-list`);
  return handleResponse<Job[]>(response);
}

export async function applyToJob(
  payload: ApplyPayload
): Promise<ApplyResponse> {
  const response = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<ApplyResponse>(response);
}
