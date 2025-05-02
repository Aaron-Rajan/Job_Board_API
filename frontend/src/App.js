import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', location: '', salary: '' });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    axios.get('http://localhost:8080/api/jobs') // update if inside Docker
      .then(response => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      });
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/jobs', form)
      .then(() => {
        setForm({ title: '', location: '', salary: '' });
        fetchJobs(); // refresh list
      })
      .catch(error => console.error('Error submitting job:', error));
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Available Jobs</h1>

      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <ul>
          {jobs.map((job, index) => (
            <li key={index}>
              <h3>{job.title}</h3>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> ${job.salary}</p>
            </li>
          ))}
        </ul>
      )}

      <h2>Post a New Job</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px' }}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Job Title"
          required
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />
        <input
          name="salary"
          value={form.salary}
          onChange={handleChange}
          placeholder="Salary"
          type="number"
          required
        />
        <button type="submit" style={{ marginTop: '1rem' }}>Post Job</button>
      </form>
    </div>
  );
}

export default App;
