import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      {/* Navigation*/}
      <nav className="navbar navbar-expand-lg navbar-light fixed-top py-3" id="mainNav">
        <div className="container px-4 px-lg-5">
          <a className="navbar-brand" href="#page-top">雅思写作助手</a>
          <button className="navbar-toggler navbar-toggler-right" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ms-auto my-2 my-lg-0">
              <li className="nav-item"><a className="nav-link" href="#about">写作攻略</a></li>
              <li className="nav-item"><a className="nav-link" href="#services">练习内容</a></li>
              <li className="nav-item"><a className="nav-link" href="#portfolio">学习资源</a></li>
              <li className="nav-item"><a className="nav-link" href="#contact">联系我们</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Masthead*/}
      <header className="masthead">
        <div className="container px-4 px-lg-5 h-100">
          <div className="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
            <div className="col-lg-8 align-self-end">
              <h1 className="text-white font-weight-bold">雅思写作提分助手</h1>
              <hr className="divider" />
            </div>
            <div className="col-lg-8 align-self-baseline">
              <p className="text-white-75 mb-5">开始你的雅思写作进阶之旅！我们提供全面的写作指导、练习和资源。</p>
              <a className="btn btn-primary btn-xl" href="#about">了解更多</a>
            </div>
          </div>
        </div>
      </header>

      {/* About*/}
      <section className="page-section bg-primary" id="about">
        <div className="container px-4 px-lg-5">
          <div className="row gx-4 gx-lg-5 justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="text-white mt-0">写作攻略</h2>
              <hr className="divider divider-light" />
              <p className="text-white-75 mb-4">
                包含完整的雅思写作备考指南、评分标准解析、高分写作技巧等
              </p>
              <a className="btn btn-light btn-xl" href="#services">开始学习</a>
            </div>
          </div>
        </div>
      </section>

      {/* Services*/}
      <section className="page-section" id="services">
        <div className="container px-4 px-lg-5">
          <h2 className="text-center mt-0">练习内容</h2>
          <hr className="divider" />
          <div className="row gx-4 gx-lg-5">
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <div className="mb-2"><i className="bi-gem fs-1 text-primary"></i></div>
                <h3 className="h4 mb-2">TR练习</h3>
                <p className="text-muted mb-0">快速完成写作框架</p>
                <Link to="/tr-practice" className="btn btn-primary mt-3">开始练习</Link>  {/* 添加这行 */}
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <div className="mb-2"><i className="bi-laptop fs-1 text-primary"></i></div>
                <h3 className="h4 mb-2">Task 2 议论文</h3>
                <p className="text-muted mb-0">各类题型分析与练习</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <div className="mb-2"><i className="bi-globe fs-1 text-primary"></i></div>
                <h3 className="h4 mb-2">核心语法</h3>
                <p className="text-muted mb-0">雅思写作常用语法点</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mt-5">
                <div className="mb-2"><i className="bi-heart fs-1 text-primary"></i></div>
                <h3 className="h4 mb-2">高分词汇</h3>
                <p className="text-muted mb-0">主题词汇与表达积累</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;