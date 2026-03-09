import React, { useState } from "react";
import { Star, ArrowLeft } from "lucide-react";

const tags = ["Clean Vehicle", "Safe Driving", "On Time", "Friendly", "Music", "AC", "Rash Driving", "Late Pickup"];

export const RatingScreen = () => {
  const [rating, setRating] = useState(4);
  const [hovered, setHovered] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>(["On Time", "Clean Vehicle"]);
  const [feedback, setFeedback] = useState("");

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent!"];

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0F1C2E 0%, #1a2d48 100%)",
        paddingTop: 44,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 mb-4">
        <button
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "rgba(30,58,95,0.5)",
            border: "1px solid rgba(212,175,55,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowLeft size={20} color="#D4AF37" />
        </button>
        <h2
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Rate Your Ride
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-28">
        {/* Driver card */}
        <div
          className="flex flex-col items-center mb-6 p-5"
          style={{
            background: "rgba(10,20,35,0.85)",
            borderRadius: 20,
            border: "1px solid rgba(212,175,55,0.12)",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(212,175,55,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              marginBottom: 10,
              border: "2px solid rgba(212,175,55,0.25)",
            }}
          >
            👨‍✈️
          </div>
          <p style={{ color: "#fff", fontSize: 18, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
            Rajesh Kumar
          </p>
          <p style={{ color: "#5a7a9a", fontSize: 13, fontFamily: "Inter, sans-serif" }}>
            SaaraMini • KA 05 MN 4291
          </p>

          {/* Stars */}
          <div className="flex gap-3 mt-4 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(s)}
              >
                <Star
                  size={40}
                  fill={(hovered || rating) >= s ? "#D4AF37" : "transparent"}
                  color={(hovered || rating) >= s ? "#D4AF37" : "rgba(212,175,55,0.25)"}
                  style={{ transition: "all 0.15s ease" }}
                />
              </button>
            ))}
          </div>

          {/* Rating label */}
          <p
            style={{
              color: "#D4AF37",
              fontSize: 16,
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
              minHeight: 24,
            }}
          >
            {ratingLabels[hovered || rating]}
          </p>
        </div>

        {/* Tags */}
        <p
          style={{
            color: "#5a7a9a",
            fontSize: 12,
            fontFamily: "Inter, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 10,
          }}
        >
          What was great?
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 20,
                  background: isSelected ? "rgba(212,175,55,0.15)" : "rgba(30,58,95,0.3)",
                  border: isSelected ? "1px solid #D4AF37" : "1px solid rgba(212,175,55,0.15)",
                  color: isSelected ? "#D4AF37" : "#8fa3b8",
                  fontSize: 13,
                  fontFamily: "Inter, sans-serif",
                  transition: "all 0.15s ease",
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Feedback text area */}
        <p
          style={{
            color: "#5a7a9a",
            fontSize: 12,
            fontFamily: "Inter, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 8,
          }}
        >
          Additional Feedback
        </p>
        <textarea
          placeholder="Tell us about your experience..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            background: "rgba(30,58,95,0.3)",
            border: "1px solid rgba(212,175,55,0.15)",
            borderRadius: 14,
            padding: "12px 14px",
            color: "#fff",
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
            outline: "none",
            resize: "none",
          }}
        />
      </div>

      {/* Submit button */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4"
        style={{ background: "rgba(8,16,28,0.98)", borderTop: "1px solid rgba(212,175,55,0.08)" }}
      >
        <button
          className="w-full"
          style={{
            height: 54,
            borderRadius: 16,
            background: "linear-gradient(135deg, #D4AF37, #F0C040)",
            color: "#0F1C2E",
            fontSize: 16,
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
            border: "none",
          }}
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
};
