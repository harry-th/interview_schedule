import React from "react";

import axios from "axios";

import { render, cleanup, waitForElement, fireEvent, getByText, getAllByTestId, getByAltText, getByPlaceholderText, getAllByAltText, queryByText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);
describe("Application", () => {

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const [appointment] = getAllByTestId(container, "appointment");

    fireEvent.click(getByAltText(appointment, 'Add'));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });

    const [interviewer] = getAllByAltText(appointment, /./);

    fireEvent.click(interviewer);
    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, "saving...")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));
    let monday = getAllByTestId(container, 'dayItem').find((day) => {
      return queryByText(day, 'Monday');
    });
    expect(getByText(monday, 'no spots remaining')).toBeInTheDocument();
  });
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointment = getAllByTestId(container, "appointment").find((app) => {
      return queryByText(app, 'Archie Cohen');
    });
    fireEvent.click(getByAltText(appointment, 'Delete'));
    fireEvent.click(getByText(appointment, 'Confirm'));

    expect(getByText(appointment, "deleting...")).toBeInTheDocument();
    await waitForElement(() => getByAltText(appointment, 'Add'));
    let monday = getAllByTestId(container, 'dayItem').find((day) => {
      return queryByText(day, 'Monday');
    });
    expect(getByText(monday, '2 spots remaining')).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointment = getAllByTestId(container, "appointment").find((app) => {
      return queryByText(app, 'Archie Cohen');
    });
    fireEvent.click(getByAltText(appointment, 'Edit'));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByText(appointment, 'Save'));
    expect(getByText(appointment, "saving...")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));
    let monday = getAllByTestId(container, 'dayItem').find((day) => {
      return queryByText(day, 'Monday');
    });
    expect(getByText(monday, '1 spot remaining')).toBeInTheDocument();
  });
  it("shows the save error when failing to save an appointment", async () => {
    const { container } = render(<Application />);
    axios.put.mockRejectedValueOnce();
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const [appointment] = getAllByTestId(container, "appointment");

    fireEvent.click(getByAltText(appointment, 'Add'));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });

    const [interviewer] = getAllByAltText(appointment, /./);

    fireEvent.click(interviewer);
    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, "saving...")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, 'There was an error'));
    fireEvent.click(getByAltText(appointment, 'Close'));
    let monday = getAllByTestId(container, 'dayItem').find((day) => {
      return queryByText(day, 'Monday');
    });
    expect(getByText(monday, '1 spot remaining')).toBeInTheDocument();
  });
  it("shows the delete error when failing to delete an existing appointment", async () => {
    const { container } = render(<Application />);
    axios.delete.mockRejectedValueOnce();
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointment = getAllByTestId(container, "appointment").find((app) => {
      return queryByText(app, 'Archie Cohen');
    });
    fireEvent.click(getByAltText(appointment, 'Delete'));
    fireEvent.click(getByText(appointment, 'Confirm'));

    expect(getByText(appointment, "deleting...")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, 'There was an error'));

    let monday = getAllByTestId(container, 'dayItem').find((day) => {
      return queryByText(day, 'Monday');
    });
    expect(getByText(monday, '1 spot remaining')).toBeInTheDocument();
  });
});