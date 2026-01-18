import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import Landing from "./Landing";
import Dashboard from "./Dashboard";
import Editor from "./Editor";
import Marketplace from "./Marketplace";
import Leaderboard from "./Leaderboard";
import Profile from "./Profile";
import Login from "./Login";

// Simple Protected Route Component
function ProtectedRoute({ component: Component, path }: { component: React.ComponentType, path: string }) {
  const [, navigate] = useLocation();
  const isAuthenticated = localStorage.getItem("ez_auth") === "true";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Route path={path} component={Component} /> : null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      
      {/* Gated Routes */}
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/editor" component={Editor} />
      <ProtectedRoute path="/marketplace" component={Marketplace} />
      <ProtectedRoute path="/leaderboard" component={Leaderboard} />
      <ProtectedRoute path="/profile" component={Profile} />
    </Switch>
  );
}

function App() {
  return (
    <Router />
  );
}

export default App;
