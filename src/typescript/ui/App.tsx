import { Route, Switch } from "wouter";
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

function App() {
  return (
    <Router />
  );
}

export default App;
