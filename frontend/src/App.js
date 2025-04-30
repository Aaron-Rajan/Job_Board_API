import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/jobs')
      .then(response => setJobs(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Job Board</h1>
      <ul>
        {jobs.map(job => (
          <li key={job.id}>
            <strong>{job.title}</strong> – {job.location}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
