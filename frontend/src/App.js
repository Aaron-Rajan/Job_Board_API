import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', location: '', salary: '' });

  const [activeJobId, setActiveJobId] = useState(null);
  const [application, setApplication] = useState({
    name: '',
    email: '',
    resume: null,
    coverLetter: null,
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    axios.get('http://localhost:8080/api/jobs')
      .then(response => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      });
  };

  const handleJobChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleJobSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/jobs', form)
      .then(() => {
        setForm({ title: '', location: '', salary: '' });
        fetchJobs();
      })
      .catch(error => console.error('Error submitting job:', error));
  };

  const handleApplicationChange = e => {
    const { name, value, files } = e.target;
    if (files) {
      setApplication({ ...application, [name]: files[0] });
    } else {
      setApplication({ ...application, [name]: value });
    }
  };

  const handleApplicationSubmit = async (jobId) => {
    try {
      const formData = new FormData();
      formData.append('resume', application.resume);
      if (application.coverLetter) {
        formData.append('coverLetter', application.coverLetter);
      }

      const uploadRes = await axios.post('http://localhost:8080/api/upload', formData);
      const { resumePath, coverLetterPath } = uploadRes.data;

      const applicationPayload = {
        applicantName: application.name,
        applicantEmail: application.email,
        resumePath,
        coverLetterPath,
      };

      await axios.post(`http://localhost:8080/api/jobs/${jobId}/apply`, applicationPayload);

      alert('Application submitted and saved to DB!');
      setApplication({ name: '', email: '', resume: null, coverLetter: null });
      setActiveJobId(null);

    } catch (err) {
      console.error('Failed to submit application:', err);
      alert('Error submitting application.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Available Jobs</h1>

      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id} style={{ marginBottom: '2rem' }}>
              <h3>{job.title}</h3>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> ${job.salary}</p>
              <button onClick={() => setActiveJobId(job.id)}>
                Apply
              </button>

              {activeJobId === job.id && (
                <div style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem', maxWidth: '400px' }}>
                  <h4>Apply for {job.title}</h4>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={application.name}
                    onChange={handleApplicationChange}
                    required
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={application.email}
                    onChange={handleApplicationChange}
                    required
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleApplicationChange}
                    required
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <input
                    type="file"
                    name="coverLetter"
                    accept=".pdf,.doc,.docx"
                    onChange={handleApplicationChange}
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <button onClick={() => handleApplicationSubmit(job.id)}>
                    Submit Application
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <h2>Post a New Job</h2>
      <form onSubmit={handleJobSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px' }}>
        <input
          name="title"
          value={form.title}
          onChange={handleJobChange}
          placeholder="Job Title"
          required
        />
        <input
          name="location"
          value={form.location}
          onChange={handleJobChange}
          placeholder="Location"
          required
        />
        <input
          name="salary"
          value={form.salary}
          onChange={handleJobChange}
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
