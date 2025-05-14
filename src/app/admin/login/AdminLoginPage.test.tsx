import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminLoginPage from "./page";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("AdminLoginPage", () => {
  beforeEach(() => {
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest.fn(() => null);
  });

  it("renders the login UI", () => {
    render(<AdminLoginPage />);
    expect(screen.getByText("Admin Login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("shows error on wrong password", async () => {
    render(<AdminLoginPage />);

    const initialCallCount = mockPush.mock.calls.length;
    await userEvent.type(
      screen.getByPlaceholderText("Enter password"),
      "wrong",
    );
    await userEvent.click(screen.getByText("Login"));

    expect(await screen.findByText("Incorrect password")).toBeInTheDocument();

    expect(mockPush.mock.calls.length).toBe(initialCallCount);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it("logs in and navigates on correct password", async () => {
    render(<AdminLoginPage />);
    await userEvent.type(
      screen.getByPlaceholderText("Enter password"),
      "admin123",
    );
    await userEvent.click(screen.getByText("Login"));

    expect(localStorage.setItem).toHaveBeenCalledWith("isAdmin", "true");
    expect(mockPush).toHaveBeenCalledWith("/admin/leads");
  });
});
