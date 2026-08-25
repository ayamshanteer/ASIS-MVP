import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders ASIS system title on load", () => {
  render(<App />);
  const title = screen.getByText(/نظام العامر الذكي للجرد/i);
  expect(title).toBeInTheDocument();
});
