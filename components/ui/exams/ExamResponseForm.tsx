"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const ExamResponseForm = ({ examQuestionId }: { examQuestionId: string }) => {
  const [examQuestion, setExamQuestion] = useState<any>(null);
  const [answer, setAnswer] = useState("");
  const [answerWorking, setAnswerWorking] = useState("");
  const [cornerstoneNotes, setCornerstoneNotes] = useState("");
  const [supplementalNotes, setSupplementalNotes] = useState("");
  const router = useRouter();

  // Fetch the exam question details
  useEffect(() => {
    if (examQuestionId) {
      fetch(`/api/examquestions/${examQuestionId}`)
        .then((res) => res.json())
        .then((data) => setExamQuestion(data))
        .catch((err) => console.error("Error fetching question:", err));
    }
  }, [examQuestionId]);

  const handleSubmit = async () => {
    const payload = {
      responder: "dummy-user-id", // Replace with actual user ID from session
      answer,
      answerWorking,
      cornerstoneNotes,
      supplementalNotes,
      examQuestion: examQuestionId,
      is_published: false, // Allow the user to choose publishing later
    };

    try {
      const response = await fetch("/api/examresponses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Response submitted successfully!");
        router.refresh(); // Refresh page after submission
      } else {
        alert("Failed to submit response.");
      }
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

  if (!examQuestion) return <p>Loading question...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Exam Question Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{examQuestion.content}</CardTitle>
        </CardHeader>
      </Card>

      {/* Response Form */}
      <div className="grid grid-cols-2 gap-6">
        {/* Answer */}
        <Card>
          <CardHeader>
            <CardTitle>Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Write your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Answer Workings */}
        <Card>
          <CardHeader>
            <CardTitle>Answer Workings</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Provide workings for your answer..."
              value={answerWorking}
              onChange={(e) => setAnswerWorking(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Cornerstone Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Cornerstone Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add formulas, key notes, or references..."
              value={cornerstoneNotes}
              onChange={(e) => setCornerstoneNotes(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Supplemental Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Supplemental Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add additional points or market insights..."
              value={supplementalNotes}
              onChange={(e) => setSupplementalNotes(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <Button onClick={handleSubmit}>Submit Response</Button>
      </div>
    </div>
  );
};

export default ExamResponseForm;
