"use client";

const RetryButton = () => {
  return (
    <button
      className="px-4 py-2 rounded-md border"
      onClick={() => typeof window !== "undefined" && window.location.reload()}
    >
      Try Again
    </button>
  );
};

export default RetryButton;
