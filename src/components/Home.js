import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      {/* Navigation*/}
      <nav className="navbar navbar-expand-lg navbar-light fixed-top py-3" id="mainNav">
        <div className="container px-4 px-lg-5">
          <a className="navbar-brand" href="#page-top">IELTS Writing Assistant</a>
          <button className="navbar-toggler navbar-toggler-right" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ms-auto my-2 my-lg-0">
              <li className="nav-item"><a className="nav-link" href="#about">Writing Guide</a></li>
              <li className="nav-item"><a className="nav-link" href="#services">Practice</a></li>
              <li className="nav-item"><a className="nav-link" href="#portfolio">Resources</a></li>
              <li className="nav-item"><a className="nav-link" href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Masthead*/}
      <header className="masthead">
        <div className="container px-4 px-lg-5 h-100">
          <div className="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
            <div className="col-lg-8 align-self-end">
              <h1 className="text-white font-weight-bold">IELTS Writing Score Booster</h1>
              <hr className="divider" />
            </div>
            <div className="col-lg-8 align-self-baseline">
              <p className="text-white-75 mb-5">Start your IELTS writing journey! We provide comprehensive writing guidance, practice, and resources.</p>
              <a className="btn btn-primary btn-xl" href="#about">Learn More</a>
            </div>
          </div>
        </div>
      </header>

      {/* About*/}
      <section className="page-section bg-primary" id="about">
        <div className="container px-4 px-lg-5">
          <div className="row gx-4 gx-lg-5 justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="text-white mt-0">Writing Guide</h2>
              <hr className="divider divider-light" />
              <p className="text-white-75 mb-4">
                Complete IELTS writing preparation guide, scoring criteria analysis, and high-score writing techniques
              </p>
              <a className="btn btn-light btn-xl" href="#services">Start Learning</a>
            </div>
          </div>
        </div>
      </section>

      {/* Services*/}
      <section className="page-section" id="services">
        <div className="container px-4 px-lg-5">
          <h2 className="text-center mt-0">Practice Content</h2>
          <hr className="divider" />
          <div className="row gx-4 gx-lg-5">
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <div className="mb-2"><i className="bi-gem fs-1 text-primary"></i></div>
                <h3 className="h4 mb-2">TR Practice</h3>
                <p className="text-muted mb-0">Quick Writing Framework</p>
                <Link to="/tr-practice" className="btn btn-primary mt-3">Start Practice</Link>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <div className="mb-2"><i className="bi-laptop fs-1 text-primary"></i></div>
                <h3 className="h4 mb-2">Task 2 Essays</h3>
                <p className="text-muted mb-0">Question Types Analysis & Practice</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <div className="mb-2"><i className="bi-globe fs-1 text-primary"></i></div>
                <h3 className="h4 mb-2">Core Grammar</h3>
                <p className="text-muted mb-0">Essential IELTS Grammar Points</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <div className="mb-2"><i className="bi-heart fs-1 text-primary"></i></div>
                <h3 className="h4 mb-2">Advanced Vocabulary</h3>
                <p className="text-muted mb-0">Topic Vocabulary & Expressions</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;