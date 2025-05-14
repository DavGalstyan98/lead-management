import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminLeadsPage from "./page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/admin/leads",
}));

const mockLeads = [
  {
    id: "1",
    first_name: "Davit",
    last_name: "Galstyan",
    email: "davit@example.com",
    linkedIn: "https://linkedin.com/in/davit",
    visas: ["O1"],
    resume: "resume.pdf",
    additionalInfo: "Testing",
    status: "PENDING",
    submittedAt: new Date().toISOString(),
    country: "Armenia",
  },
  {
    id: "2",
    first_name: "Anna",
    last_name: "Smith",
    email: "anna@example.com",
    linkedIn: "https://linkedin.com/in/anna",
    visas: ["EB1A"],
    resume: "resume2.pdf",
    additionalInfo: "Already contacted",
    status: "REACHED_OUT",
    submittedAt: new Date().toISOString(),
    country: "USA",
  },
];

jest.mock("@/utils/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: mockLeads,
        error: null,
      }),
    })),
  },
}));

describe("AdminLeadsPage", () => {
  beforeEach(() => {
    global.fetch = jest.fn((url, options) => {
      if (options?.method === "PATCH") {
        return Promise.resolve({
          json: () =>
            Promise.resolve({ ...mockLeads[0], status: "REACHED_OUT" }),
        });
      }

      return Promise.resolve({
        json: () => Promise.resolve(mockLeads),
      });
    }) as jest.Mock;
  });

  it("shows loading initially", async () => {
    render(<AdminLeadsPage />);
    expect(screen.getByText(/loading leads/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText(/Davit Galstyan/i)).toBeInTheDocument(),
    );
  });

  it("renders leads correctly", async () => {
    render(<AdminLeadsPage />);

    await waitFor(() => {
      expect(screen.getByText("Davit Galstyan")).toBeInTheDocument();
      expect(screen.getByText("Anna Smith")).toBeInTheDocument();
      expect(screen.getAllByText("Pending").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Reached Out").length).toBeGreaterThan(0);
    });
  });

  it("marks pending lead as reached out", async () => {
    render(<AdminLeadsPage />);

    const button = await screen.findByText("Mark as Reached Out");
    await userEvent.click(button);

    await waitFor(() => {
      const statuses = screen.getAllByText("Reached Out");
      expect(statuses.length).toBeGreaterThan(1);
    });
  });

  it("does not show action button for already reached out leads", async () => {
    render(<AdminLeadsPage />);
    await waitFor(() => {
      expect(screen.queryByText("Mark as Reached Out")).toBeInTheDocument();
    });

    const buttons = screen.getAllByText("Mark as Reached Out");
    expect(buttons).toHaveLength(1);
  });
});
