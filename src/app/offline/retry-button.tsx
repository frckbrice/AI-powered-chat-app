"use client";

const RetryButton = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <button type="button" className="px-4 py-2 rounded-md border" onClick={handleRetry}>
      Try Again
    </button>
  );
};

export default RetryButton;
