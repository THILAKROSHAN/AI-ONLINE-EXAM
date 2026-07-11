import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';

const ResultAnalytics = ({ result, stats, performanceData }) => {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (!result && !stats && !performanceData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No analytics data available</p>
      </div>
    );
  }

  // Single result analytics
  if (result) {
    const pieData = [
      { name: 'Correct', value: result.correctAnswers || 0 },
      { name: 'Wrong', value: result.wrongAnswers || 0 },
      { name: 'Unattempted', value: result.unattempted || 0 },
    ];

    const barData = [
      { name: 'Score', value: result.percentage || 0 },
      { name: 'Passing', value: 40 },
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Score Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Score Distribution
            </h4>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Answer Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Answer Distribution
            </h4>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Performance analytics
  if (performanceData) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Performance Trend
          </h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="exam" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Performance */}
        {stats?.subjectPerformance && Object.keys(stats.subjectPerformance).length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Subject Performance
            </h4>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.entries(stats.subjectPerformance).map(([subject, data]) => ({
                  subject,
                  average: data.average || 0,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="subject" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="average" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Overall stats
  if (stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Grade Distribution
          </h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(stats.gradeDistribution || {}).map(([grade, count]) => ({
                    name: grade,
                    value: count,
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(stats.gradeDistribution || {}).map(([grade, count], index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Score Statistics
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Average Score</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {stats.averageScore?.toFixed(1) || 0}%
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Highest Score</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {stats.highestScore?.toFixed(1) || 0}%
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Lowest Score</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {stats.lowestScore?.toFixed(1) || 0}%
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Pass Rate</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {stats.passRate?.toFixed(1) || 0}%
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500 dark:text-gray-400">Total Results</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {stats.total || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ResultAnalytics;