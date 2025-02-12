"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const CreateExam = () => {
  // ----- SUBJECT FORM STATE -----
  const [subjectName, setSubjectName] = useState("");
  const [subjectDescription, setSubjectDescription] = useState("");
  const [subjectIsPublished, setSubjectIsPublished] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);

  // ----- EXAM PAPER FORM STATE -----
  const [examPaperName, setExamPaperName] = useState("");
  const [examPaperDescription, setExamPaperDescription] = useState("");
  const [examPaperYear, setExamPaperYear] = useState("");
  const [examPaperBannerUrl, setExamPaperBannerUrl] = useState("");
  const [examPaperIsPublished, setExamPaperIsPublished] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [examPapers, setExamPapers] = useState<any[]>([]);

  // ----- EXAM QUESTION FORM STATE -----
  const [examQuestionContent, setExamQuestionContent] = useState("");
  const [examQuestionIsPublished, setExamQuestionIsPublished] = useState(false);
  const [selectedExamPaper, setSelectedExamPaper] = useState("");

  // Refresh subjects and exam papers on page load and after creation.
  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/subjects");
      const data = await res.json();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchExamPapers = async () => {
    try {
      const res = await fetch("/api/exampapers");
      const data = await res.json();
      setExamPapers(data);
    } catch (error) {
      console.error("Error fetching exam papers:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchExamPapers();
  }, []);

  // ----- HANDLERS -----
  const handleSubjectSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      creator: "67ac99c39f14e9e833a3d2c3", // Replace with the actual admin user ID later.
      name: subjectName,
      description: subjectDescription,
      is_published: subjectIsPublished,
    };

    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("Subject created:", data);
      setSubjectName("");
      setSubjectDescription("");
      setSubjectIsPublished(false);
      fetchSubjects();
    } catch (error) {
      console.error("Error creating subject:", error);
    }
  };

  const handleExamPaperSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      creator: "67ac99c39f14e9e833a3d2c3", // Replace with the actual admin user ID later.
      name: examPaperName,
      description: examPaperDescription,
      year: examPaperYear,
      subject: selectedSubject, // This should be a subject _id
      banner_url: examPaperBannerUrl,
      is_published: examPaperIsPublished,
    };

    try {
      const res = await fetch("/api/exampapers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("Exam Paper created:", data);
      setExamPaperName("");
      setExamPaperDescription("");
      setExamPaperYear("");
      setExamPaperBannerUrl("");
      setExamPaperIsPublished(false);
      setSelectedSubject("");
      fetchExamPapers();
    } catch (error) {
      console.error("Error creating exam paper:", error);
    }
  };

  const handleExamQuestionSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      creator: "67ac99c39f14e9e833a3d2c3", // Replace with the actual admin user ID later.
      content: examQuestionContent,
      examPaper: selectedExamPaper, // This should be an exam paper _id
      is_published: examQuestionIsPublished,
    };

    try {
      const res = await fetch("/api/examquestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("Exam Question created:", data);
      setExamQuestionContent("");
      setExamQuestionIsPublished(false);
      setSelectedExamPaper("");
    } catch (error) {
      console.error("Error creating exam question:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Panel</h1>

      {/* SUBJECT FORM */}
      <section>
        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">Create Subject</h2>
          <form onSubmit={handleSubjectSubmit} className="space-y-4">
            <div>
              <Label htmlFor="subjectName" className="mb-1 block">
                Subject Name
              </Label>
              <Input
                id="subjectName"
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="subjectDescription" className="mb-1 block">
                Description
              </Label>
              <Textarea
                id="subjectDescription"
                value={subjectDescription}
                onChange={(e) => setSubjectDescription(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="subjectPublished"
                checked={subjectIsPublished}
                onCheckedChange={(checked: boolean) =>
                  setSubjectIsPublished(checked)
                }
              />
              <Label htmlFor="subjectPublished">Published</Label>
            </div>
            <Button type="submit">Create Subject</Button>
          </form>
        </div>
      </section>

      {/* EXAM PAPER FORM */}
      <section>
        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">Create Exam Paper</h2>
          <form onSubmit={handleExamPaperSubmit} className="space-y-4">
            <div>
              <Label htmlFor="examPaperName" className="mb-1 block">
                Exam Paper Name
              </Label>
              <Input
                id="examPaperName"
                type="text"
                value={examPaperName}
                onChange={(e) => setExamPaperName(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="examPaperDescription" className="mb-1 block">
                Description
              </Label>
              <Textarea
                id="examPaperDescription"
                value={examPaperDescription}
                onChange={(e) => setExamPaperDescription(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="examPaperYear" className="mb-1 block">
                Year
              </Label>
              <Input
                id="examPaperYear"
                type="text"
                value={examPaperYear}
                onChange={(e) => setExamPaperYear(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="examPaperSubject" className="mb-1 block">
                Subject
              </Label>
              <select
                id="examPaperSubject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="examPaperBannerUrl" className="mb-1 block">
                Banner URL
              </Label>
              <Input
                id="examPaperBannerUrl"
                type="text"
                value={examPaperBannerUrl}
                onChange={(e) => setExamPaperBannerUrl(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="examPaperPublished"
                checked={examPaperIsPublished}
                onCheckedChange={(checked: boolean) =>
                  setExamPaperIsPublished(checked)
                }
              />
              <Label htmlFor="examPaperPublished">Published</Label>
            </div>
            <Button type="submit">Create Exam Paper</Button>
          </form>
        </div>
      </section>

      {/* EXAM QUESTION FORM */}
      <section>
        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">Create Exam Question</h2>
          <form onSubmit={handleExamQuestionSubmit} className="space-y-4">
            <div>
              <Label htmlFor="examQuestionContent" className="mb-1 block">
                Question Content
              </Label>
              <Textarea
                id="examQuestionContent"
                value={examQuestionContent}
                onChange={(e) => setExamQuestionContent(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="examQuestionExamPaper" className="mb-1 block">
                Exam Paper
              </Label>
              <select
                id="examQuestionExamPaper"
                value={selectedExamPaper}
                onChange={(e) => setSelectedExamPaper(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Exam Paper</option>
                {examPapers.map((paper) => (
                  <option key={paper._id} value={paper._id}>
                    {paper.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="examQuestionPublished"
                checked={examQuestionIsPublished}
                onCheckedChange={(checked: boolean) =>
                  setExamQuestionIsPublished(checked)
                }
              />
              <Label htmlFor="examQuestionPublished">Published</Label>
            </div>
            <Button type="submit">Create Exam Question</Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CreateExam;
