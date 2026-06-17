import { render, screen } from "@testing-library/react";
import App from "./App";

test("affiche au moins un texte contenant Reeple", () => {
    render(<App />);
    const elements = screen.getAllByText(/Reeple/i);
    expect(elements.length).toBeGreaterThan(0);
});
