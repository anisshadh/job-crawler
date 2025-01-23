"use client";
import React from "react";

export default function JobsPage() {
  const [url, setUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [jobs, setJobs] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setJobs(null);
    setError(null);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error fetching data");
      } else {
        setJobs(data.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Job Listings Finder</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          placeholder="Enter website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Loading..." : "Fetch Jobs"}
        </button>
      </form>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {jobs && (
        <div className="mt-4">
          <h2 className="font-bold">Jobs Found:</h2>
          <pre className="bg-gray-100 p-2 mt-2 rounded text-sm">
            {JSON.stringify(jobs, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}