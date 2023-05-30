import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { Async } from ".";

test("it renders correctly", async () => {
  render(<Async />);

  expect(screen.getByText("Hello World")).toBeInTheDocument();
  // Esse será usado em casos de verificações assíncronas, então teremos que esperar assim como fazemos no código
  // expect(await screen.findByText('Button')).toBeInTheDocument()
  // await waitFor(() => {
  //   return expect(screen.getByText('Button')).toBeInTheDocument()
  // })
  await waitForElementToBeRemoved(screen.queryByText('Button'))

  await waitFor(() => {
    return expect(screen.queryByText("Button")).not.toBeInTheDocument();
  });
});
