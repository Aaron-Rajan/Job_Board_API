import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './Login';
import Register from './Register';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [showRegister, setShowRegister] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', location: '', salary: '' });

  const [activeJobId, setActiveJobId] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [applications, setApplications] = useState([]);

  const [application, setApplication] = useState({
    name: '',
    email: '',
    resume: null,
    coverLetter: null,
  });

  useEffect(() => {
    if (!showAdmin) fetchJobs();
    else fetchApplications();
  }, [showAdmin]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleJobChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleJobSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/jobs', form, {
      headers: { Authorization: `Bearer ${token}` }
    })
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

      const uploadRes = await axios.post('http://localhost:8080/api/upload', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { resumePath, coverLetterPath } = uploadRes.data;

      const applicationPayload = {
        applicantName: application.name,
        applicantEmail: application.email,
        resumePath,
        coverLetterPath,
      };

      await axios.post(`http://localhost:8080/api/jobs/${jobId}/apply`, applicationPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Application submitted and saved to DB!');
      setApplication({ name: '', email: '', resume: null, coverLetter: null });
      setActiveJobId(null);
    } catch (err) {
      console.error('Failed to submit application:', err);
      alert('Error submitting application.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  };

  const handleDownload = async (filename, type) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/upload/download?filename=${encodeURIComponent(filename)}&type=${type}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename.split('/').pop());
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file.');
    }
  };

  if (!token) {
    return showRegister
      ? <Register onRegistered={() => setShowRegister(false)} />
      : (
        <>
          <Login setToken={setToken} setRole={setRole} />
          <p>Don't have an account? <button onClick={() => setShowRegister(true)}>Register here</button></p>
        </>
      );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <div style={{ marginBottom: '1rem' }}>
        <span>Logged in as: {role}</span>
        <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>Logout</button>
        {role === 'EMPLOYER' && (
          <button onClick={() => setShowAdmin(!showAdmin)} style={{ marginLeft: '1rem' }}>
            {showAdmin ? 'Back to Job Board' : 'View Admin Dashboard'}
          </button>
        )}
      </div>

      {role === 'EMPLOYER' && showAdmin ? (
        <>
          <h2>All Job Applications</h2>
          {applications.length === 0 ? (
            <p>No applications submitted yet.</p>
          ) : (
            <table border="1" cellPadding="10">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Job Title</th>
                  <th>Resume</th>
                  <th>Cover Letter</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td>{app.applicantName}</td>
                    <td>{app.applicantEmail}</td>
                    <td>{app.job?.title || 'N/A'}</td>
                    <td>
                      <button onClick={() => handleDownload(app.resumePath, 'resume')}>
                        Resume
                      </button>
                    </td>
                    <td>
                      {app.coverLetterPath && app.coverLetterPath !== 'Not provided' ? (
                        <button onClick={() => handleDownload(app.coverLetterPath, 'coverLetter')}>
                          Cover Letter
                        </button>
                      ) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <>
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
                  <button onClick={() => setActiveJobId(job.id)}>Apply</button>

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
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={application.email}
                        onChange={handleApplicationChange}
                        required
                      />
                      <input
                        type="file"
                        name="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={handleApplicationChange}
                        required
                      />
                      <input
                        type="file"
                        name="coverLetter"
                        accept=".pdf,.doc,.docx"
                        onChange={handleApplicationChange}
                      />
                      <button onClick={() => handleApplicationSubmit(job.id)} style={{ marginTop: '0.5rem' }}>
                        Submit Application
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {role === 'EMPLOYER' && (
            <>
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
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
