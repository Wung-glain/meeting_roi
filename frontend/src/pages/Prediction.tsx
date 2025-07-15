// Prediction.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Assuming relative path for Button
import { Input } from "@/components/ui/input"; // Assuming relative path for Input
import { Label } from "@/components/ui/label"; // Assuming relative path for Label
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming relative path for Card components
import { Textarea } from "@/components/ui/textarea"; // Assuming relative path for Textarea
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Assuming relative path for Select components
import { Slider } from "@/components/ui/slider"; // Assuming relative path for Slider
import { Switch } from "@/components/ui/switch"; // Assuming relative path for Switch
import { TrendingUp, AlertCircle, Info, CheckCircle, UploadCloud, FileText, XCircle, Users, Briefcase } from "lucide-react"; // Added new icons
import { useAuth } from '@/context/AuthContext.tsx'; // Import useAuth from your AuthContext
import { Link } from "react-router-dom";
import axios from "axios";
// Define the structure for the prediction result
interface PredictionResult {
  result: string;
  confidence: number;
  estimated_cost: number;
  explanation?: string;
  factors?: {
    duration_status: string;
    attendee_status: string;
    clarity_status: string;
    // Add more factors as needed from the backend response
  };
}

const Prediction: React.FC = () => {
  const { user } = useAuth();
  // Determine if the user is subscribed. Adjust this logic based on your AuthContext's user object structure.
  // Assuming 'subscription_plan' exists and is not 'Free Tier' or null/undefined for a subscribed user.
  const isSubscribed = user && user.subscription_plan && user.subscription_plan !== "Free Tier";

  const [formData, setFormData] = useState<{
    meeting_title: string; // UI only
    agenda_format: string; // UI only
    agenda_file: File | null; // Sent as 'agenda_file'
    time_block: string; // Sent as 'time_block'
    remote: boolean; // NEW: Sent as 'remote'
    tool: string; // NEW: Sent as 'tool'
    meeting_type: string; // Sent as 'meeting_type'
    duration: string; // Sent as 'duration' (int)
    attendees: string; // Sent as 'attendees' (int)
    agenda_clarity: number[]; // Sent as 'agenda_clarity' (int)
    has_action_items: boolean; // Sent as 'has_action_items'
    departments: string; // Sent as 'departments' (int)
    roles: string; // NEW: Sent as 'roles'
    average_annual_salary: string; // Sent as 'average_annual_salary' (float)
    meeting_notes: string; // UI only
  }>({
    meeting_title: "",
    agenda_format: "",
    agenda_file: null,
    time_block: "",
    remote: false,
    tool: "",
    meeting_type: "",
    duration: "",
    attendees: "",
    agenda_clarity: [7],
    has_action_items: false,
    departments: "",
    roles: "",
    average_annual_salary: "",
    meeting_notes:"",
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, agenda_file: e.target.files[0] });
    } else {
      setFormData({ ...formData, agenda_file: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);
    
const apiPayload = {
  time_block: formData.time_block,                    // e.g., "Morning"
  remote: formData.remote,                              // boolean
  tool: formData.tool,                                // e.g., "Zoom"
  agenda_file: formData.agenda_file || null,                    // string (text content of agenda file)
  meeting_type: formData.meeting_type,                     // e.g., "Planning"
  duration: parseInt(formData.duration),                  // int
  attendees: parseInt(formData.attendees),                // int
  agenda_clarity: formData.agenda_clarity[0],              // int (e.g., 1–5)
  has_action_items: formData.has_action_items,              // boolean
  departments: parseInt(formData.departments),        // int
  roles: formData.roles,                          // string (e.g., "Manager,Engineer")
  average_annual_salary: parseFloat(formData.average_annual_salary) // float
};
    console.log(apiPayload);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/predict_one', apiPayload);

      if (!response) {
        const errorData = await response.data;
        console.log(errorData);
        throw new Error(errorData.detail || errorData.message || 'Failed to get prediction from API.');
      }
      console.log("Success")
      console.log(response.data)
      const data: PredictionResult = await response.data;
      setPrediction(data);

    } catch (err: any) {

      console.error("Prediction API Error:", err);
      setError(err.message || "An unexpected error occurred during prediction.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      meeting_title: "",
      agenda_format: "",
      agenda_file: null,
      time_block: "",
      remote: false,
      tool: "",
      meeting_type: "",
      duration: "",
      attendees: "",
      agenda_clarity: [7],
      has_action_items: false,
      departments: "",
      roles: "",
      average_annual_salary: "",
      meeting_notes: "",
    });
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-inter">
      <div className="container mx-auto px-4 max-w-8xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Meeting ROI Prediction</h1>
          <p className="text-lg text-gray-600">Enter your meeting details to get an AI-powered productivity prediction</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Card */}
          <Card className="rounded-xl shadow-lg">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800">Meeting Details</CardTitle>
              <CardDescription className="text-gray-600">Fill in the information about your meeting</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Meeting Title */}
                <div className="space-y-2">
                  <Label htmlFor="meeting-title" className="font-medium text-gray-700">Meeting Title <span className="text-red-500">*</span></Label>
                  <Input
                    type="text"
                    id="meeting-title"
                    name="meetingTitle"
                    placeholder="e.g. Weekly Team Sync"
                    value={formData.meeting_title}
                    onChange={(e) => setFormData({ ...formData, meeting_title: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Agenda Upload Section */}
                <div className="space-y-4 border-t pt-6 border-gray-200">
                  <h4 className="text-xl font-semibold text-gray-800 flex items-center">
                    <FileText size={20} className="mr-2 text-blue-600" /> Upload Meeting Agenda
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="agenda-format" className="font-medium text-gray-700">Select Agenda Format</Label>
                      <Select value={formData.agenda_format} onValueChange={(value) => setFormData({ ...formData, agenda_format: value })}>
                        <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select Agenda Format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Agenda</SelectItem>
                          <SelectItem value="scrum">Scrum Standup</SelectItem>
                          <SelectItem value="one-on-one">1-on-1 Agenda</SelectItem>
                          <SelectItem value="project">Project Kickoff</SelectItem>
                          <SelectItem value="retrospective">Sprint Retrospective</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agenda-file" className="font-medium text-gray-700">Upload Agenda File</Label>
                      <div className="relative border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-blue-500 transition-colors duration-200">
                        <Input
                          type="file"
                          id="agenda-file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={handleFileChange}
                          disabled={!isSubscribed} // Disable if not subscribed
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {!isSubscribed ? (
                          <div className="text-red-500 text-sm font-semibold">
                            Subscribe to upload agenda files
                            <Link to="/pricing" className="block mt-2 text-blue-600 hover:underline">
                              View Plans
                            </Link>
                          </div>
                        ) : (
                          <>
                            <UploadCloud size={32} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">
                              {formData.agenda_file ? formData.agenda_file.name : "Drag & drop or click to upload"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              (PDF, DOCX, TXT - Max 5MB)
                            </p>
                          </>
                        )}
                      </div>
                      {formData.agenda_file && isSubscribed && (
                        <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                          <span>Selected: {formData.agenda_file.name}</span>
                          <Button variant="ghost" size="sm" onClick={() => setFormData({ ...formData, agenda_file: null })} className="p-1 h-auto">
                            <XCircle size={16} className="text-red-500" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Duration & Attendees */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="font-medium text-gray-700">Duration (minutes) <span className="text-red-500">*</span></Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="60"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attendees" className="font-medium text-gray-700">Number of Attendees <span className="text-red-500">*</span></Label>
                    <Input
                      id="attendees"
                      type="number"
                      placeholder="5"
                      value={formData.attendees}
                      onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Meeting Session & Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meetingSession" className="font-medium text-gray-700">Meeting Session</Label>
                    <Select value={formData.time_block} onValueChange={(value) => setFormData({ ...formData, time_block: value })}>
                      <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select Meeting Session" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Morning">Morning</SelectItem>
                        <SelectItem value="Afternoon">Afternoon</SelectItem>
                        <SelectItem value="Evening">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meetingType" className="font-medium text-gray-700">Meeting Type</Label>
                    <Select value={formData.meeting_type} onValueChange={(value) => setFormData({ ...formData, meeting_type: value })}>
                      <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select Meeting Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stand-up">Stand-Up</SelectItem>
                        <SelectItem value="brainstorm">Brainstorm</SelectItem>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="strategy">Strategy</SelectItem>
                        <SelectItem value="client-call">Client Call</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Remote Meeting Switch */}
                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-md border border-gray-200">
                  <Switch
                    id="isRemote"
                    checked={formData.remote}
                    onCheckedChange={(checked) => setFormData({ ...formData, remote: checked })}
                  />
                  <Label htmlFor="isRemote" className="font-medium text-gray-700 cursor-pointer">Is this a remote meeting?</Label>
                </div>

                {/* Tool Used Select */}
                <div className="space-y-2">
                  <Label htmlFor="toolUsed" className="font-medium text-gray-700">Tool Used</Label>
                  <Select value={formData.tool} onValueChange={(value) => setFormData({ ...formData, tool: value })}>
                    <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Select Tool Used" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="google-meet">Google Meet</SelectItem>
                      <SelectItem value="microsoft-teams">Microsoft Teams</SelectItem>
                      <SelectItem value="slack-huddle">Slack Huddle</SelectItem>
                      <SelectItem value="in-person">In-person</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Agenda Clarity Slider */}
                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">Agenda Clarity (1-10)</Label>
                  <div className="px-1 py-2">
                    <Slider
                      value={formData.agenda_clarity}
                      onValueChange={(value) => setFormData({ ...formData, agenda_clarity: value })}
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>Very Unclear</span>
                      <span className="font-semibold text-blue-600">{formData.agenda_clarity[0]}</span>
                      <span>Very Clear</span>
                    </div>
                  </div>
                </div>

                {/* Has Action Items Switch */}
                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-md border border-gray-200">
                  <Switch
                    id="actionItems"
                    checked={formData.has_action_items}
                    onCheckedChange={(checked) => setFormData({ ...formData, has_action_items: checked })}
                  />
                  <Label htmlFor="actionItems" className="font-medium text-gray-700 cursor-pointer">Has clear action items?</Label>
                </div>

                {/* Department Count & Average Annual Salary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departments" className="font-medium text-gray-700">Department Count</Label>
                    <Select value={formData.departments} onValueChange={(value) => setFormData({ ...formData, departments: value })}>
                      <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select count" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Department</SelectItem>
                        <SelectItem value="2">2 Departments</SelectItem>
                        <SelectItem value="3">3 Departments</SelectItem>
                        <SelectItem value="4">4 Departments</SelectItem>
                        <SelectItem value="5">5+ Departments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="average_annual_salary" className="font-medium text-gray-700">Average Annual Salary ($) <span className="text-red-500">*</span></Label>
                    <Input
                      id="average_annual_salary"
                      type="number"
                      placeholder="75000"
                      value={formData.average_annual_salary}
                      onChange={(e) => setFormData({ ...formData, average_annual_salary: e.target.value })}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Attendee Roles */}
                <div className="space-y-2">
                  <Label htmlFor="attendee-roles" className="font-medium text-gray-700">Attendee Roles (comma-separated)</Label>
                  <Input
                    type="text"
                    id="attendee-roles"
                    name="attendeeRoles"
                    placeholder="e.g. Engineer, Product Manager, Designer"
                    value={formData.attendees}
                    onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500">List the roles of attendees, e.g., "Engineer, Product Manager, CEO"</p>
                </div>

                {/* Meeting Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="font-medium text-gray-700">Meeting Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional context about the meeting, key discussion points, or outcomes..."
                    value={formData.meeting_notes}
                    onChange={(e) => setFormData({ ...formData, meeting_notes: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-lg">
                    {loading ? "Analyzing..." : "Predict ROI"}
                    <TrendingUp className="ml-2 h-5 w-5" />
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 py-2.5 rounded-lg text-lg">
                    Reset Form
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card className="rounded-xl shadow-lg">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800">Prediction Results</CardTitle>
              <CardDescription className="text-gray-600">AI-powered analysis of your meeting</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {loading && (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-lg text-gray-600 font-medium">Analyzing meeting data...</p>
                  <p className="text-sm text-gray-500 mt-1">This may take a few moments.</p>
                </div>
              )}

              {error && !loading && (
                <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-lg text-red-700">
                  <AlertCircle className="h-12 w-12 mb-4" />
                  <p className="text-lg font-medium mb-2">Prediction Error</p>
                  <p className="text-sm text-center px-4">{error}</p>
                </div>
              )}

              {!loading && !prediction && !error && (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg text-gray-500">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Fill out the form and click "Predict ROI"</p>
                  <p className="text-sm mt-1">to see your meeting's potential productivity.</p>
                </div>
              )}

              {prediction && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className={`inline-flex items-center px-8 py-4 rounded-full text-2xl font-bold ${
                      prediction.result === "Productive"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    } shadow-md`}>
                      {prediction.result === "Productive" ? (
                        <CheckCircle className="h-7 w-7 mr-3" />
                      ) : (
                        <AlertCircle className="h-7 w-7 mr-3" />
                      )}
                      {prediction.result}
                    </div>
                    <p className="text-3xl font-extrabold text-gray-900 mt-6">{prediction.confidence}% Confidence</p>
                  </div>

                  {prediction.explanation && (
                    <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                        <Info size={20} className="mr-2" /> Model Explanation
                      </h4>
                      <p className="text-blue-700 text-sm leading-relaxed">{prediction.explanation}</p>
                    </div>
                  )}
                   {/* 💰 Estimated Cost in Red, Big Font */}
                      <p style={{ fontSize: "2rem", color: "black", fontWeight: "bold" }}>
                          Estimated Cost of Meeting: <span style={{ fontSize: "2rem", color: "red", fontWeight: "bold" }}>${prediction.estimated_cost.toLocaleString()} </span>
                      </p>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 text-xl">Key Factors Influencing Prediction</h4>
                    <div className="space-y-3 text-base text-gray-700">
                      
                      <div className="flex justify-between items-center">
                        <span>Meeting Duration:</span>
                        <span className={formData.duration && parseInt(formData.duration) <= 60 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                          {formData.duration && parseInt(formData.duration) <= 60 ? "Optimal" : "Too Long"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Attendee Count:</span>
                        <span className={formData.attendees && parseInt(formData.attendees) <= 7 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                          {formData.attendees && parseInt(formData.attendees) <= 7 ? "Good Size" : prediction.factors.attendee_status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Agenda Clarity:</span>
                        <span className={formData.agenda_clarity[0] >= 7 ? "text-green-600 font-semibold" : "text-orange-600 font-semibold"}>
                          {formData.agenda_clarity[0] >= 7 ? "Clear" : "Needs Improvement"}
                        </span>
                      </div>
                      {/* Display dynamic factors from backend if available */}
                      {prediction.factors?.duration_status && (
                        <div className="flex justify-between items-center">
                          <span>Duration Impact:</span>
                          <span className="text-gray-700">{prediction.factors.duration_status}</span>
                        </div>
                      )}
                       {prediction.factors?.attendee_status && (
                        <div className="flex justify-between items-center">
                          <span>Attendee Impact:</span>
                          <span className="text-gray-700">{prediction.factors.attendee_status}</span>
                        </div>
                      )}
                       {prediction.factors?.clarity_status && (
                        <div className="flex justify-between items-center">
                          <span>Clarity Impact:</span>
                          <span className="text-gray-700">{prediction.factors.clarity_status}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button onClick={resetForm} variant="outline" className="w-full py-2.5 rounded-lg text-lg">
                    Make Another Prediction
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Prediction;