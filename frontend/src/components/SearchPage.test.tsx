import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SearchPage } from "./SearchPage";

function makeResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe("SearchPage BGG search", () => {
  const fetchMock = vi.fn();

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  function renderPage(onNavigate = vi.fn()) {
    vi.stubGlobal("fetch", fetchMock);
    render(<SearchPage onNavigate={onNavigate} />);
    return onNavigate;
  }

  function submitSearch(query: string) {
    fireEvent.change(screen.getByLabelText("Nom du jeu"), {
      target: { value: query },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Recherche BoardGameGeek" }));
  }

  it("shows a loading state and displays matching BGG results", async () => {
    let resolveFetch!: (response: Response) => void;
    fetchMock.mockReturnValue(
      new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      }),
    );
    renderPage();

    submitSearch("7 Wonders");

    expect(screen.getByRole("status")).toHaveTextContent(
      "Recherche des jeux sur BoardGameGeek",
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/bgg/search?query=7%20Wonders",
      { headers: { Accept: "application/json" } },
    );

    resolveFetch(
      makeResponse({
        query: "7 Wonders",
        total: 1,
        games: [{ id: 68448, title: "7 Wonders", yearPublished: 2010 }],
      }),
    );

    expect(await screen.findByText("7 Wonders")).toBeInTheDocument();
    expect(screen.getByText("2010")).toBeInTheDocument();
  });

  it("shows an empty state when the API returns no games", async () => {
    fetchMock.mockResolvedValue(
      makeResponse({ query: "Introuvable", total: 0, games: [] }),
    );
    renderPage();

    submitSearch("Introuvable");

    expect(
      await screen.findByText(/Aucun jeu trouvé pour « Introuvable »/),
    ).toBeInTheDocument();
  });

  it("shows the backend error message", async () => {
    fetchMock.mockResolvedValue(
      makeResponse({ error: "La recherche BGG est indisponible." }, 502),
    );
    renderPage();

    submitSearch("Catan");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "La recherche BGG est indisponible.",
    );
  });

  it("validates a blank query without calling the API", () => {
    renderPage();

    fireEvent.submit(screen.getByRole("form", { name: "Recherche BoardGameGeek" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Saisissez le nom d’un jeu pour lancer la recherche.",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps the existing player-to-recommendations flow", () => {
    const onNavigate = renderPage();

    fireEvent.change(screen.getByPlaceholderText("Pseudo MyLudo ou numéro client..."), {
      target: { value: "Ryan Jeewooth" },
    });
    fireEvent.click(screen.getByText("Ryan Jeewooth"));
    fireEvent.click(screen.getByRole("button", { name: "Analyser la ludothèque" }));

    expect(onNavigate).toHaveBeenCalledWith("results", "1");
  });
});
