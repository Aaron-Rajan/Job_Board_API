import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/admin/applications')
      .then(response => {
        setApplications(response.data);
      })
      .catch(error => {
        console.error('Error fetching applications:', error);
      });
  }, []);

  const generateDownloadLink = (filename, type) => {
    const folder = type === 'resume' ? 'resumes' : 'coverletters';
    return `http://localhost:8080/api/upload/download?path=${folder}/${encodeURIComponent(filename)}`;
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <button onClick={() => window.location.href = '/'}>Back to Job Board</button>
      <h2 style={{ marginTop: '1rem' }}>All Job Applications</h2>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ marginTop: '1rem' }}>
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
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.applicantName || 'N/A'}</td>
                <td>{app.applicantEmail || 'N/A'}</td>
                <td>{app.job?.title || 'N/A'}</td>
                <td>
                  {app.resumePath && app.resumePath.includes('.pdf') ? (
                    <a
                      href={generateDownloadLink(app.resumePath.split('/').pop(), 'resume')}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Resume
                    </a>
                  ) : 'Not uploaded'}
                </td>
                <td>
                  {app.coverLetterPath && app.coverLetterPath !== 'Not provided' ? (
                    <a
                      href={generateDownloadLink(app.coverLetterPath.split('/').pop(), 'coverLetter')}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Cover Letter
                    </a>
                  ) : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
