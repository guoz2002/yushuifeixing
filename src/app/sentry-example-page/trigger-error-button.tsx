"use client";

export function TriggerErrorButton() {
  return (
    <button
      type="button"
      onClick={() => {
        throw new Error("Sentry Test Error");
      }}
      style={{
        marginTop: "16px",
        borderRadius: "8px",
        border: "none",
        padding: "10px 16px",
        background: "#111827",
        color: "#ffffff",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      Trigger Test Error
    </button>
  );
}
