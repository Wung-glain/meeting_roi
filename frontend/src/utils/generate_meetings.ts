
// --- Mock Data Generation ---
export const generateMockMeetings = (count) => {
  const meetings = [];
  const meetingTypes = ['Stand-Up', 'Brainstorm', 'Planning', 'Client Call', 'Review', 'Strategy', 'Decision Making'];
  const departments = ['Engineering', 'Product', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  const tools = ['Zoom', 'Google Meet', 'MS Teams', 'In-person', 'Webex'];
  const outcomes = ['Success', 'Partial Success', 'Failure'];

  for (let i = 0; i < count; i++) {
    const duration = Math.floor(Math.random() * (120 - 15 + 1)) + 15; // 15 to 120 minutes
    const attendees = Math.floor(Math.random() * (20 - 2 + 1)) + 2; // 2 to 20 attendees
    const avgSalary = Math.floor(Math.random() * (150000 - 50000 + 1)) + 50000;
    const estimatedCost = parseFloat(((duration / 60) * attendees * (avgSalary / (52 * 40))).toFixed(2));
    const productivityScore = Math.floor(Math.random() * (100 - 40 + 1)) + 40; // 40 to 100
    const isProductive = productivityScore >= 70 ? 'Productive' : 'Not Productive';
    const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

    meetings.push({
      id: `M${String(i + 1).padStart(4, '0')}`,
      title: `Meeting ${i + 1} - ${meetingTypes[Math.floor(Math.random() * meetingTypes.length)]}`,
      date: date.toISOString().split('T')[0],
      duration,
      attendees,
      estimatedCost,
      productivityScore,
      isProductive,
      type: meetingTypes[Math.floor(Math.random() * meetingTypes.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      tool: tools[Math.floor(Math.random() * tools.length)],
      outcome,
      agendaSummary: `Discussion on ${meetingTypes[Math.floor(Math.random() * meetingTypes.length)]} for Q${Math.floor(Math.random() * 4) + 1} planning.`,
      roiScore: parseFloat((productivityScore * (1 - (estimatedCost / 1000))).toFixed(2)), // Simple ROI calculation
    });
  }
  return meetings;
};

export const mockMeetings = generateMockMeetings(200); // Generate 200 mock meetings for more data