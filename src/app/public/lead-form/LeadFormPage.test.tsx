import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LeadFormPage from "@/app/public/lead-form/page";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  }),
) as jest.Mock;

describe("LeadFormPage", () => {
  it("should render the form title", () => {
    render(<LeadFormPage />);
    expect(
      screen.getByText("Get An Assessment Of Your Immigration Case"),
    ).toBeInTheDocument();
  });

  it("should show validation errors if form is submitted empty", async () => {
    render(<LeadFormPage />);
    await userEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("First name is required")).toBeVisible();
      expect(screen.getByText("Last name is required")).toBeVisible();
      expect(screen.getByText("Email is required")).toBeVisible();
    });
  });

  it("should display thank-you message on submit (mock)", async () => {
    render(<LeadFormPage />);

    await userEvent.type(screen.getByPlaceholderText("First Name"), "Davit");
    await userEvent.type(screen.getByPlaceholderText("Last Name"), "Galstyan");
    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      "davit@example.com",
    );
    await userEvent.type(
      screen.getByPlaceholderText("LinkedIn / Website URL"),
      "https://linkedin.com/in/davit",
    );
    await userEvent.type(screen.getByPlaceholderText("Country"), "Armenia");
    await userEvent.type(
      screen.getByPlaceholderText("Write your message..."),
      "Looking for help with O1 visa",
    );

    await userEvent.click(screen.getByLabelText("O1"));

    const fileInput = screen.getByLabelText("Resume Upload");
    const file = new File(["resume content"], "resume.pdf", {
      type: "application/pdf",
    });
    await userEvent.upload(fileInput, file);

    await userEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Thank You")).toBeVisible();
    });
  });
});
