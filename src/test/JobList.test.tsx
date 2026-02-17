import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JobList from "@/components/JobList";
import * as api from "@/services/api";

vi.mock("@/services/api", () => ({
  applyToJob: vi.fn(),
}));

const mockJobs: api.Job[] = [
  { id: "4416372005", title: "Fullstack developer" },
  { id: "9100000001", title: "Head Chef" },
];

const defaultProps = {
  jobs: mockJobs,
  uuid: "test-uuid-123",
  candidateId: "test-candidate-456",
};

describe("JobList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the job list correctly after fetching data", () => {
    render(<JobList {...defaultProps} />);

    expect(screen.getByText("Fullstack developer")).toBeInTheDocument();
    expect(screen.getByText("Head Chef")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /submit/i })).toHaveLength(2);
    expect(
      screen.getAllByPlaceholderText("https://github.com/user/repo")
    ).toHaveLength(2);
  });

  it("triggers the API call with the correct data on submit", async () => {
    const mockApply = vi.mocked(api.applyToJob);
    mockApply.mockResolvedValueOnce({ ok: true });

    render(<JobList {...defaultProps} />);

    const inputs = screen.getAllByPlaceholderText(
      "https://github.com/user/repo"
    );
    const buttons = screen.getAllByRole("button", { name: /submit/i });

    await userEvent.type(inputs[0], "https://github.com/test/repo");
    await userEvent.click(buttons[0]);

    await waitFor(() => {
      expect(mockApply).toHaveBeenCalledWith({
        uuid: "test-uuid-123",
        jobId: "4416372005",
        candidateId: "test-candidate-456",
        repoUrl: "https://github.com/test/repo",
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText("Application submitted successfully.")
      ).toBeInTheDocument();
    });
  });
});
