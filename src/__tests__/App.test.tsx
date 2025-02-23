import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import App from "../App"

afterEach(() => {
    jest.clearAllMocks();
})

describe('vault onboarding form test', () => {
    test('renders form correctly', () => {
        render(<App />);

        expect(screen.getByText('Onboarding Form')).toBeInTheDocument();

        expect(screen.getByLabelText("First Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
        expect(screen.getByLabelText("Corporation Number")).toBeInTheDocument();

        expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    });

    test("form should not be submitted if phone number is not correct.", async () => {
        render(<App />);

        // Fill in the form
        fireEvent.change(screen.getByLabelText("First Name"), {
            target: { value: "John" },
        });
        fireEvent.change(screen.getByLabelText("Last Name"), {
            target: { value: "Doe" },
        });
        fireEvent.change(screen.getByLabelText("Phone Number"), {
            target: { value: "+11234567" },
        });
        fireEvent.change(screen.getByLabelText("Corporation Number"), {
            target: { value: "123450012" },
        });

        // Submit the form
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        // Wait for the API call to resolve
        await waitFor(() => expect(fetch).not.toHaveBeenCalled());

        // Check if the form submission was successful (no error message)
        expect(
            screen.queryByText("Submitting..")
        ).not.toBeInTheDocument();
    });

    test("form should not be submitted if required field is not provided.", async () => {
        render(<App />);

        // Fill in the form
        fireEvent.change(screen.getByLabelText("Last Name"), {
            target: { value: "Doe" },
        });
        fireEvent.change(screen.getByLabelText("Corporation Number"), {
            target: { value: "123450012" },
        });

        // Submit the form
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        // Wait for the API call to resolve
        await waitFor(() => expect(fetch).not.toHaveBeenCalled());

        // Check if the form submission was successful (no error message)
        expect(
            screen.queryByText("Submitting..")
        ).not.toBeInTheDocument();
    });

    test("validates corporation number on form submission", async () => {
        render(<App />);

        // Fill in the form
        fireEvent.change(screen.getByLabelText("First Name"), {
            target: { value: "John" },
        });
        fireEvent.change(screen.getByLabelText("Last Name"), {
            target: { value: "Doe" },
        });
        fireEvent.change(screen.getByLabelText("Phone Number"), {
            target: { value: "+11234567890" },
        });
        fireEvent.change(screen.getByLabelText("Corporation Number"), {
            target: { value: "123450012" },
        });

        // Submit the form
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        // Wait for the API call to resolve
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

        // Check if the API was called with the correct URL
        expect(fetch).toHaveBeenCalledWith(
            "https://fe-hometask-api.dev.vault.tryvault.com/corporation-number/123450012"
        );

        // Check if the form submission was successful (no error message)
        expect(
            screen.queryByText("Invalid corporation number")
        ).not.toBeInTheDocument();
    });

    test("displays error message for invalid corporation number", async () => {
        // Mock an invalid response
        jest.spyOn(global, "fetch").mockImplementation(
            jest.fn(
                () => Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ valid: true, message: 'Invalid corporation number' })
                }),
            ) as jest.Mock)

        render(<App />);

        // Fill in the form
        fireEvent.change(screen.getByLabelText("First Name"), {
            target: { value: "John" },
        });
        fireEvent.change(screen.getByLabelText("Last Name"), {
            target: { value: "Doe" },
        });
        fireEvent.change(screen.getByLabelText("Phone Number"), {
            target: { value: "+11234567890" },
        });
        fireEvent.change(screen.getByLabelText("Corporation Number"), {
            target: { value: "123450012" },
        });

        // Submit the form
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        // Wait for the API call to resolve
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

        // Check if the error message is displayed
        expect(screen.getByText("Invalid corporation number")).toBeInTheDocument();
    });

    test("ensure no corporation error message for valid corporation number", async () => {
        render(<App />);

        // Fill in the form
        fireEvent.change(screen.getByLabelText("First Name"), {
            target: { value: "John" },
        });
        fireEvent.change(screen.getByLabelText("Last Name"), {
            target: { value: "Doe" },
        });
        fireEvent.change(screen.getByLabelText("Phone Number"), {
            target: { value: "+11234567890" },
        });
        fireEvent.change(screen.getByLabelText("Corporation Number"), {
            target: { value: "123456789" },
        });

        // Submit the form
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        // Wait for the API call to resolve
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    });
})