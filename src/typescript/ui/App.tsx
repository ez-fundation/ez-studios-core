// import { Toaster } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
// import ErrorBoundary from "./components/ErrorBoundary";
// import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./Landing";
import Dashboard from "./Dashboard";
import Editor from "./Editor";
import Marketplace from "./Marketplace";
import Leaderboard from "./Leaderboard";
import Profile from "./Profile";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Landing} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/editor"} component={Editor} />
      <Route path={"/marketplace"} component={Marketplace} />
      <Route path={"/leaderboard"} component={Leaderboard} />
      <Route path={"/profile"} component={Profile} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <Router />
  );
}

export default App;
