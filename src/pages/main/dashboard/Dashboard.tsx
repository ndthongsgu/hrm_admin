import { useProfile } from "@/hooks/auth/auth";

export default function Dashboard() {
  const { data, isLoading, isError } = useProfile();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Test logged in user: <code>/me</code></p>

      {isLoading && <p>Loading profile...</p>}
      {isError && <p>Failed to load profile.</p>}

      {data && (
        <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '4px' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
