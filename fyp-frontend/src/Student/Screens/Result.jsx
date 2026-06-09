import React, { useState, useEffect } from 'react';
import { Table, Badge } from 'react-bootstrap';
import Sidebar from '../Components/Sidebar';
import Helpers from '../../Config/Helpers';

function Result() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${Helpers.apiUrl}quizzes/results/${user.id}`);
        if (!res.ok) throw new Error('Failed to fetch results');
        
        const data = await res.json();
        setResults(data);
      } catch (err) {
        Helpers.toast('error', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user?.id]);

  const getStatusBadge = (status) => {
    const variants = {
      attempted: 'warning',
      completed: 'success',
      expired: 'danger'
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  return (
    <div id="kt_app_wrapper" className="app-wrapper flex-column flex-row-fluid">
      <Sidebar />
      <div className="container mt-5">
        <h2 className="mb-4">Quiz Attempt History</h2>
        
        {loading ? (
          <div className="text-center">Loading results...</div>
        ) : results.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Quiz Title</th>
                <th>Score</th>
                <th>Status</th>
                <th>Attempt Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={result.id}>
                  <td>{index + 1}</td>
                  <td>{result.quiz_title}</td>
                  <td>{result.score}/{result.max_score}</td>
                  <td>{getStatusBadge(result.status)}</td>
                  <td>{new Date(result.attempt_date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="alert alert-info">No quiz attempts found</div>
        )}
      </div>
    </div>
  );
}

export default Result;