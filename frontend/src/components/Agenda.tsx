import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const AgendaUploadSection = () => {
  const [selectedFormat, setSelectedFormat] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFormat(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFormat || !file) {
      alert("Please select a format and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("format", selectedFormat);
    formData.append("agendaFile", file);

    // TODO: Send formData to the backend
    console.log("Sending format:", selectedFormat);
    console.log("File uploaded:", file.name);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Upload Meeting Agenda</h2>

      <div className="mb-4">
        <Label htmlFor="format">
          Select Agenda Format
        </Label>
        <select
          id="format"
          value={selectedFormat}
          onChange={handleFormatChange}
          required
        >
          <option value="">-- Choose Format --</option>
          <option value="standard">Standard Agenda</option>
          <option value="scrum">Scrum Standup</option>
          <option value="one-on-one">1-on-1 Agenda</option>
          <option value="project">Project Kickoff</option>
          <option value="retrospective">Sprint Retrospective</option>
        </select>
      </div>

      <div className="mb-4">
        <Label htmlFor="agenda-file">
          Upload Agenda File
        </Label>
        <Input
          type="file"
          id="agenda-file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          required
        />
      </div>
    </form>
  );
};

export default AgendaUploadSection;
