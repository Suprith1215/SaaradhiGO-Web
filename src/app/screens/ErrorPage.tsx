import React from "react";
import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router";
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from "lucide-react";

export function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = "An unexpected error occurred.";
  let errorStatus = "";

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || error.statusText;
    errorStatus = error.status.toString();
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  }

  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      background: "#050D1A",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      color: "white",
      padding: 20,
      textAlign: "center"
    }}>
      <div style={{
        maxWidth: 500,
        width: "100%",
        padding: 40,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(212,175,55,0.2)",
        borderRadius: 24,
        backdropFilter: "blur(20px)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
      }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(232, 64, 64, 0.1)",
          border: "2px solid #E84040",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px"
        }}>
          <AlertTriangle size={40} color="#E84040" />
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16, color: "#D4AF37" }}>
          {errorStatus ? `Error ${errorStatus}` : "Application Error"}
        </h1>
        
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
            {errorMessage || "We encountered a glitch while loading this page. Our team has been notified."}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: "14px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #D4AF37, #F0C040)",
              color: "#050D1A",
              fontWeight: 800,
              fontSize: 15,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10
            }}
          >
            <RefreshCw size={18} /> Retry Connection
          </button>

          <div style={{ display: "flex", gap: 12 }}>
            <button 
              onClick={() => navigate(-1)}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8
              }}
            >
              <ArrowLeft size={16} /> Go Back
            </button>
            <button 
              onClick={() => navigate("/")}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8
              }}
            >
              <Home size={16} /> Home
            </button>
          </div>
        </div>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: 1, textTransform: "uppercase" }}>
                SaaradhiGO Systems · Secure Tunnel v2.4
            </p>
        </div>
      </div>
    </div>
  );
}
