import "./App.css";
import { useEvents } from "./presentation/hooks/useEventService";

function App() {
  const { events, loading, error, deleteEvent } = useEvents();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Events</h1>
      {events.map((event) => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <button onClick={() => deleteEvent(event.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
