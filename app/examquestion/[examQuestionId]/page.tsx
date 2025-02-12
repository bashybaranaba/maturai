"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const ExamResponseForm = ({
  params,
}: {
  params: Promise<{ examQuestionId: string }>;
}) => {
  const [examQuestion, setExamQuestion] = useState<any>(null);
  const [answer, setAnswer] = useState("");
  const [cornerstoneNotes, setCornerstoneNotes] = useState("");
  const [answerWorking, setAnswerWorking] = useState("");
  const [supplementalNotes, setSupplementalNotes] = useState("");
  const [aiFeedback, setAiFeedback] = useState<any | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [feedbackRequested, setFeedbackRequested] = useState(false); // Prevent re-fetching feedback

  const router = useRouter();
  const question = use(params);
  const examQuestionId = question.examQuestionId;

  useEffect(() => {
    if (examQuestionId) {
      fetch(`/api/examquestions/examquestion?questionId=${examQuestionId}`)
        .then((res) => res.json())
        .then((data) => setExamQuestion(data))
        .catch((err) => console.error("Error fetching question:", err));
    }
  }, [examQuestionId]);

  const handleSubmit = async () => {
    const payload = {
      responder: "67ac99c39f14e9e833a3d2c3",
      answer,
      answerWorking,
      cornerstoneNotes,
      supplementalNotes,
      examQuestion: examQuestionId,
      is_published: false,
    };

    try {
      const response = await fetch("/api/examresponses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Response submitted successfully!");
        router.refresh();
      } else {
        alert("Failed to submit response.");
      }
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

  const fetchAiFeedback = async () => {
    if (feedbackRequested) return; // Prevent multiple API calls once feedback is fetched

    setLoadingAI(true);
    setFeedbackRequested(true); // Mark as fetched

    try {
      const res = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          option: "exam_feedback",
          input: answer,
          interactionData: {
            answerWorking,
            cornerstoneNotes,
            supplementalNotes,
          },
          userData: { responderId: "67ac99c39f14e9e833a3d2c3" },
          contextData: { examQuestion },
        }),
      });

      const data = await res.json();
      setAiFeedback(data);
    } catch (error) {
      console.error("Error fetching AI feedback:", error);
      setAiFeedback(null);
    }
    setLoadingAI(false);
  };

  if (!examQuestion) return <p>Loading question...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6 bg-pink-100 relative">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            {examQuestion.content}
          </CardTitle>
        </CardHeader>

        {/* AI Feedback Popover (Only Fetch Once) */}
        {answer.length >= 50 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="absolute bottom-2 right-2"
                onClick={fetchAiFeedback} // Fetch only if not already fetched
              >
                {aiFeedback ? "View AI Feedback" : "Get AI Feedback"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 text-sm">
              {loadingAI ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin mr-2" /> Generating
                  feedback...
                </div>
              ) : aiFeedback ? (
                <div>
                  <h4 className="font-semibold mb-2">AI Feedback:</h4>
                  <p>
                    <strong>Technical Accuracy:</strong>{" "}
                    {aiFeedback.technical_feedback}
                  </p>
                  <p>
                    <strong>Improvement Suggestions:</strong>{" "}
                    {aiFeedback.suggestions}
                  </p>
                </div>
              ) : (
                "Click to generate AI feedback."
              )}
            </PopoverContent>
          </Popover>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Write your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Answer Workings</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Provide workings for your answer..."
              value={answerWorking}
              onChange={(e) => setAnswerWorking(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cornerstone Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add formulas, key notes, or references..."
              value={cornerstoneNotes}
              onChange={(e) => setCornerstoneNotes(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Supplemental Notes</CardTitle>
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

      <div className="flex justify-end mt-6">
        <Button onClick={handleSubmit}>Submit Response</Button>
      </div>
    </div>
  );
};

export default ExamResponseForm;
