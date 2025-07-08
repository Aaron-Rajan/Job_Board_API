import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './Login';
import Register from './Register';

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [validating, setValidating] = useState(true);

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
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
    }

    setValidating(false);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        if (!showAdmin) {
          await fetchJobs();
        } else {
          await fetchApplications();
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        handleLogout();
      }
    };

    fetchData();
  }, [token, showAdmin]);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    setJobs([]);
    setApplications([]);
    setShowAdmin(false);
  };

  const handleJobChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleJobSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/jobs', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ title: '', location: '', salary: '' });
      fetchJobs();
    } catch (error) {
      console.error('Error submitting job:', error);
    }
  };

  const handleApplicationChange = e => {
    const { name, value, files } = e.target;
    setApplication({ ...application, [name]: files ? files[0] : value });
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

      alert('Application submitted!');
      setApplication({ name: '', email: '', resume: null, coverLetter: null });
      setActiveJobId(null);
    } catch (err) {
      console.error('Failed to submit application:', err);
      alert('Error submitting application.');
    }
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

  if (validating) return <p className="p-4 text-gray-600">Loading...</p>;

  if (!token) {
    return showRegister
      ? <Register onRegistered={() => setShowRegister(false)} />
      : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
          <Login setToken={setToken} setRole={setRole} />
          <p className="mt-4 text-gray-600">
            Don't have an account?{' '}
            <button onClick={() => setShowRegister(true)} className="text-blue-600 hover:underline">
              Register here
            </button>
          </p>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-700">Logged in as: <strong>{role}</strong></span>
        <div>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-red-600">
            Logout
          </button>
          {role === 'EMPLOYER' && (
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {showAdmin ? 'Back to Job Board' : 'View Admin Dashboard'}
            </button>
          )}
        </div>
      </div>

      {role === 'EMPLOYER' && showAdmin ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Submitted Applications</h2>
          {applications.length === 0 ? (
            <p>No applications submitted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr className="bg-gray-200 text-left text-sm font-semibold">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Job Title</th>
                    <th className="p-3">Resume</th>
                    <th className="p-3">Cover Letter</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id} className="border-b text-sm">
                      <td className="p-3">{app.applicantName}</td>
                      <td className="p-3">{app.applicantEmail}</td>
                      <td className="p-3">{app.job?.title || 'N/A'}</td>
                      <td className="p-3">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => handleDownload(app.resumePath, 'resume')}
                        >
                          Resume
                        </button>
                      </td>
                      <td className="p-3">
                        {app.coverLetterPath && app.coverLetterPath !== 'Not provided' ? (
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => handleDownload(app.coverLetterPath, 'coverLetter')}
                          >
                            Cover Letter
                          </button>
                        ) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>
          {loading ? (
            <p>Loading jobs...</p>
          ) : (
            <div className="grid gap-4">
              {jobs.map(job => (
                <div key={job.id} className="bg-white p-4 shadow-md rounded-md">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-gray-600">Location: {job.location}</p>
                  <p className="text-gray-600 mb-2">Salary: ${job.salary}</p>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    onClick={() => setActiveJobId(job.id)}
                  >
                    Apply
                  </button>

                  {activeJobId === job.id && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="font-semibold mb-2">Apply for {job.title}</h4>

                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={application.name}
                        onChange={handleApplicationChange}
                        className="block w-full mb-2 px-3 py-2 border rounded-md"
                        required
                      />

                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={application.email}
                        onChange={handleApplicationChange}
                        className="block w-full mb-2 px-3 py-2 border rounded-md"
                        required
                      />

                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resume</label>
                        <input
                          type="file"
                          name="resume"
                          accept=".pdf,.doc,.docx"
                          onChange={handleApplicationChange}
                          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0 file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                        <input
                          type="file"
                          name="coverLetter"
                          accept=".pdf,.doc,.docx"
                          onChange={handleApplicationChange}
                          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0 file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>

                      <button
                        onClick={() => handleApplicationSubmit(job.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                      >
                        Submit Application
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {role === 'EMPLOYER' && (
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4">Post a New Job</h2>
              <form
                onSubmit={handleJobSubmit}
                className="bg-white shadow-md rounded-md p-6 max-w-md"
              >
                <input
                  name="title"
                  value={form.title}
                  onChange={handleJobChange}
                  placeholder="Job Title"
                  className="w-full mb-3 px-3 py-2 border rounded-md"
                  required
                />
                <input
                  name="location"
                  value={form.location}
                  onChange={handleJobChange}
                  placeholder="Location"
                  className="w-full mb-3 px-3 py-2 border rounded-md"
                  required
                />
                <input
                  name="salary"
                  type="number"
                  value={form.salary}
                  onChange={handleJobChange}
                  placeholder="Salary"
                  className="w-full mb-4 px-3 py-2 border rounded-md"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Post Job
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
