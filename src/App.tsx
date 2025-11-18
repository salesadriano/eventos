import "./App.css";
import { useAuth } from "./presentation/contexts/AuthContext";
import { Login } from "./presentation/components/Login";
import { useEvents } from "./presentation/hooks/useEventService";

function App() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const { events, loading, error, deleteEvent } = useEvents();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Events</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>Welcome, {user?.name} ({user?.profile})</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
      {loading && <div>Loading events...</div>}
      {error && <div>Error: {error.message}</div>}
      {!loading && !error && (
        <>
          {events.length === 0 ? (
            <div>No events found</div>
          ) : (
            events.map((event) => (
              <div key={event.id} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <button onClick={() => deleteEvent(event.id)}>Delete</button>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default App;
