"use client";

import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [query, setQuery] = useState('');
  const [trials, setTrials] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // Number of trials per page
  const [sponsors, setSponsors] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState('');

  const handleSearch = async (page = 1, sponsorFilter = selectedSponsor) => {
    try {
      const offset = (page - 1) * limit;
      const params = { query, limit, offset };
      if (sponsorFilter) {
        params.sponsor = sponsorFilter;
      }
      const response = await axios.get('http://localhost:8000/search', { params });
      setTrials(response.data.trials);
      setSponsors(response.data.sponsors);
      setError('');
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to fetch trials');
      setTrials([]);
      setSponsors([]);
    }
  };

  const handleNextPage = () => {
    if (trials.length === limit) {
      handleSearch(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handleSearch(currentPage - 1);
    }
  };

  const handleSponsorChange = (e) => {
    const sponsor = e.target.value;
    setSelectedSponsor(sponsor);
    handleSearch(1, sponsor); // Reset to first page on sponsor change
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-center mb-6">Clinical Trials Search</h1>
        <div className="flex flex-col md:flex-row items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedSponsor(''); // Reset sponsor filter when query changes
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(1, ''); // Reset sponsor filter when new search is initiated
              }
            }}
            placeholder="Search for clinical trials..."
            className="w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSearch(1, '')}
            className="w-full md:w-1/3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {trials.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">NCT Number</th>
                  <th className="py-2 px-4 border-b">Study Title</th>
                  <th className="py-2 px-4 border-b">
                    <div className="flex flex-col">
                      <span>Sponsor</span>
                      <select
                        value={selectedSponsor}
                        onChange={handleSponsorChange}
                        className="mt-2 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Sponsors</option>
                        {sponsors.map((sponsor, index) => (
                          <option key={index} value={sponsor}>
                            {sponsor}
                          </option>
                        ))}
                      </select>
                    </div>
                  </th>
                  <th className="py-2 px-4 border-b">Phases</th>
                  <th className="py-2 px-4 border-b">Start Date</th>
                  <th className="py-2 px-4 border-b">Completion Date</th>
                </tr>
              </thead>
              <tbody>
                {trials.map((trial, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-2 px-4 border-b">{trial['NCT Number']}</td>
                    <td className="py-2 px-4 border-b">{trial['Study Title']}</td>
                    <td className="py-2 px-4 border-b">{trial['Sponsor']}</td>
                    <td className="py-2 px-4 border-b">{trial['Phases']}</td>
                    <td className="py-2 px-4 border-b">{trial['Start Date']}</td>
                    <td className="py-2 px-4 border-b">{trial['Completion Date']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {trials.length > 0 && (
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } transition-colors`}
            >
              Previous
            </button>
            <span className="text-gray-700">Page {currentPage}</span>
            <button
              onClick={handleNextPage}
              disabled={trials.length < limit}
              className={`px-4 py-2 rounded-md ${
                trials.length < limit
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } transition-colors`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
