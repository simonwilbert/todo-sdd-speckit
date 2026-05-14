import { HomePage } from "./pages/HomePage.js";

export function App() {
  return (
    <>
      <a className="skip-link" href="#app-main">
        Skip to main content
      </a>
      <main id="app-main" className="app-shell" aria-labelledby="app-heading">
        <h1 id="app-heading">Personal Todo</h1>
        <HomePage />
      </main>
    </>
  );
}
