import React, { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import { useRideSimulation } from "../../services/mockRealtime";

export function ChatOverlay({ role, onClose }: { role: "driver" | "rider"; onClose: () => void }) {
    const { session, sendMessage } = useRideSimulation();
    const [text, setText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [session?.messages]);

    const handleSend = () => {
        if (!text.trim()) return;
        sendMessage(role, text);
        setText("");
    };

    if (!session) return null;

    return (
        <div style={{
            position: "fixed", bottom: 20, right: 20, width: 320, height: 400,
            background: "rgba(10, 20, 35, 0.95)", backdropFilter: "blur(10px)",
            border: "1px solid rgba(212,175,55,0.3)", borderRadius: 16,
            display: "flex", flexDirection: "column", zIndex: 9999, overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0,0,0,0.8)", fontFamily: "'Inter', sans-serif"
        }}>
            {/* Header */}
            <div style={{
                padding: "12px 16px", background: "rgba(212,175,55,0.1)",
                borderBottom: "1px solid rgba(212,175,55,0.2)", display: "flex",
                justifyContent: "space-between", alignItems: "center"
            }}>
                <span style={{ color: "#D4AF37", fontWeight: "bold", fontSize: 14 }}>
                    Chat with {role === "rider" ? "Driver" : "Rider"}
                </span>
                <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)" }}>
                    <X size={18} />
                </button>
            </div>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                {session.messages.map(m => {
                    const isMine = m.sender === role;
                    return (
                        <div key={m.id} style={{ alignSelf: isMine ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                            <div style={{
                                background: isMine ? "#D4AF37" : "rgba(255,255,255,0.1)",
                                color: isMine ? "#050D1A" : "white",
                                padding: "8px 12px", borderRadius: 12, fontSize: 13
                            }}>{m.text}</div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            {/* Input */}
            <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: 8 }}>
                <input 
                    value={text} onChange={e => setText(e.target.value)} 
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    style={{ flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "8px 12px", color: "white", outline: "none", fontSize: 13 }}
                />
                <button onClick={handleSend} style={{ background: "#D4AF37", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#050D1A" }}>
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
}
