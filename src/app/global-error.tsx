"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          display: "flex",
          minHeight: "100dvh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>تعذّر تحميل الموقع</h1>
        <p style={{ opacity: 0.7 }}>حدث خطأ أساسي أثناء التحميل.</p>
        <button type="button" onClick={reset} style={{ textDecoration: "underline" }}>
          إعادة المحاولة
        </button>
      </body>
    </html>
  );
}
