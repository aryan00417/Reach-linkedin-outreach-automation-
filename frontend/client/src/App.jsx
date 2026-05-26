import React, { useState, useRef } from "react";
import axios from "axios";
import "./App.css";

export default function App() {

  const [gmail, setGmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [keyword, setKeyword] = useState("");
  const [resume, setResume] = useState(null);

  const [showPw, setShowPw] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [status, setStatus] = useState({
    type: "idle",
    message: "Ready to launch your outreach campaign."
  });

  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setIsDragOver(false);

    const file = e.dataTransfer.files[0];

    if (file) {
      setResume(file);
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!gmail || !appPassword || !keyword || !resume) {
      return;
    }

    setIsLoading(true);

    setStatus({
      type: "running",
      message: "Connecting to LinkedIn and automating outreach..."
    });

    const formData = new FormData();

    formData.append("gmail", gmail);
    formData.append("appPassword", appPassword);
    formData.append("keyword", keyword);
    formData.append("resume", resume);

    try {

      const res = await axios.post(
        "http://localhost:3000/linkedin",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setStatus({
        type: "success",
        message: res.data.message || "Automation completed successfully."
      });

    }
    catch (err) {

      setStatus({
        type: "error",
        message: "Something went wrong. Please try again."
      });

      console.log(err);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="app-bg" aria-hidden="true" />

      <div className="app-wrapper">

        <nav className="navbar">

          <a href="/" className="navbar-logo">

            <div className="logo-mark">
              ⚡
            </div>

            <span className="logo-name">
              Reach 
            </span>

          </a>

          <div className="navbar-badge">
            <span className="badge-dot" />
            SYSTEM ONLINE
          </div>

        </nav>

        <section className="hero">

          <div className="hero-label">
            ⚡ Recruiter Outreach, Automated
          </div>

          <h1 className="hero-title">
            Land interviews with
            <br />
            <span className="accent-word">
               reach
            </span>
          </h1>

          <p className="hero-sub">
            Automate recruiter outreach intelligently using LinkedIn scraping,
            Gmail automation, and resume delivery.
          </p>

        </section>

        <main className="main-content" id="main-form">

          <div className="glass-card">

            <div className="card-header">
              <h2>Launch Campaign</h2>

              <p>
                Configure your outreach and let Reach handle the rest.
              </p>
            </div>

            <form className="form-body" onSubmit={handleSubmit}>

              <div className="field-group">

                <label className="field-label">
                  Gmail Address
                </label>

                <input
                  type="email"
                  className="field-input"
                  placeholder="you@gmail.com"
                  value={gmail}
                  onChange={(e) => setGmail(e.target.value)}
                  required
                />

              </div>

              <div className="field-group">

                <label className="field-label">
                  Google App Password
                </label>

                <div className="password-wrapper">

                  <input
                    type={showPw ? "text" : "password"}
                    className="field-input"
                    placeholder="xxxx xxxx xxxx xxxx"
                    value={appPassword}
                    onChange={(e) => setAppPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="toggle-pw"
                    onClick={() => setShowPw(!showPw)}
                  >
                    {showPw ? "X" : "👁"}
                  </button>

                </div>
              </div>

              <div className="field-group">

                <label className="field-label">
                  Job Keyword
                </label>

                <input
                  type="text"
                  className="field-input"
                  placeholder="Frontend Developer"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  required
                />

              </div>

              <div className="field-group">

                <label className="field-label">
                  Resume
                </label>

                <div
                  className={`upload-zone ${isDragOver ? "drag-over" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    style={{ display: "none" }}
                    onChange={(e) => setResume(e.target.files[0])}
                  />

                  {
                    resume ? (
                      <div className="file-name-tag">
                        ✓ {resume.name}
                      </div>
                    ) : (
                      <>
                        <div className="upload-title">
                          Drop your resume here
                        </div>

                        <div className="upload-sub">
                          or click to browse
                        </div>
                      </>
                    )
                  }

                </div>

              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >

                {
                  isLoading
                    ? "Automating..."
                    : "Start Automation"
                }

              </button>

            </form>

          </div>

          <div className="glass-card">

            <div className="card-header">

              <h2>Status</h2>

              <p>
                Live feedback from automation engine.
              </p>

            </div>

            <div className="status-inner">

              <div className={`status-indicator ${status.type}`} />

              <div>

                <div className="status-label">
                  {status.type}
                </div>

                <div className="status-message">
                  {status.message}
                </div>

              </div>

            </div>

          </div>

        </main>

      </div>
    </>
  );
}