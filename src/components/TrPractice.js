import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TrPractice = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [userOutline, setUserOutline] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  // 添加 API 基础 URL 配置
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3003';

  // 更新题库为真实考题
  const essayTopics = [
    // Agree/Disagree 类型
    {
      id: 'agree-1',
      name: 'Cambridge 17 Test 1',
      type: 'agree_disagree',
      typeLabel: 'Agree/Disagree',
      question: 'Some people believe that it is best to accept a bad situation, such as an unsatisfactory job or shortage of money. Others argue that it is better to try and improve such situations. Discuss both these views and give your own opinion.',
      keywords: ['attitude', 'life situation', 'improvement']
    },
    {
      id: 'agree-2',
      name: 'Cambridge 16 Test 2',
      type: 'agree_disagree',
      typeLabel: 'Agree/Disagree',
      question: 'Some people think that governments should spend money on railways rather than roads. To what extent do you agree or disagree with this statement?',
      keywords: ['transport', 'government spending', 'infrastructure']
    },
    // Discussion 类型
    {
      id: 'discuss-1',
      name: 'Cambridge 15 Test 3',
      type: 'discussion',
      typeLabel: 'Discussion',
      question: 'Some people think that all university students should study whatever they like. Others believe that they should only be allowed to study subjects that will be useful in the future, such as those related to science and technology. Discuss both these views and give your own opinion.',
      keywords: ['education', 'university', 'subject choice']
    },
    {
      id: 'discuss-2',
      name: 'Cambridge 14 Test 4',
      type: 'discussion',
      typeLabel: 'Discussion',
      question: 'In some countries, more and more people are becoming interested in finding out about the history of the house or building they live in. What are the reasons for this? Do you think this is a positive or negative development?',
      keywords: ['history', 'housing', 'cultural interest']
    },
    // Problem and Solution 类型
    {
      id: 'solution-1',
      name: 'Cambridge 13 Test 1',
      type: 'solution',
      typeLabel: 'Problem/Solution',
      question: 'In many cities the use of video cameras in public places is being increased in order to reduce crime, but some people believe that these measures restrict our individual freedom. Do the benefits of increased security outweigh the drawbacks?',
      keywords: ['security', 'privacy', 'technology']
    },
    {
      id: 'solution-2',
      name: 'Cambridge 12 Test 2',
      type: 'solution',
      typeLabel: 'Problem/Solution',
      question: 'Many people believe that international tourism creates understanding between nations and cultures. Others argue that it has negative effects on local cultures and the environment. Discuss both views and give your opinion.',
      keywords: ['tourism', 'culture', 'environment']
    },
    // Advantages/Disadvantages 类型
    {
      id: 'advantage-1',
      name: 'Cambridge 11 Test 3',
      type: 'advantages',
      typeLabel: 'Advantages/Disadvantages',
      question: 'Some people think that parents should teach children how to be good members of society. Others, however, believe that school is the place to learn this. Discuss both these views and give your own opinion.',
      keywords: ['education', 'parenting', 'social values']
    },
    // Two-part Question 类型
    {
      id: 'twopart-1',
      name: 'Cambridge 10 Test 4',
      type: 'twopart',
      typeLabel: 'Two-part Question',
      question: 'More and more people are moving away from rural areas and towards urban areas. What are the causes of this? What problems does this create?',
      keywords: ['urbanisation', 'rural areas', 'social change']
    }
  ];

  // 更新题型分类
  const topicTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'agree_disagree', label: 'Agree/Disagree' },
    { id: 'discussion', label: 'Discussion' },
    { id: 'solution', label: 'Problem/Solution' },
    { id: 'advantages', label: 'Advantages/Disadvantages' },
    { id: 'twopart', label: 'Two-part Question' }
  ];

  // 根据选择的类型筛选题目
  const filteredTopics = selectedType === 'all' 
    ? essayTopics 
    : essayTopics.filter(topic => topic.type === selectedType);

  const handleSubmit = async () => {
    setIsLoading(true);
    setSubmitStatus('');
    try {
      const selectedEssayTopic = essayTopics.find(topic => topic.id === selectedTopic);
      
      const requestData = {
        outline: userOutline,
        topic: selectedEssayTopic
      };
      
      const apiUrl = `${API_BASE_URL}/api/evaluate`;
      console.log('准备发送请求到:', apiUrl);
      console.log('请求数据:', requestData);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://my-ielts-website-nqrro6c9b-louis-projects-ed306c0f.vercel.app'
        },
        mode: 'cors',  // 明确指定 CORS 模式
        credentials: 'same-origin',  // 修改凭证策略
        body: JSON.stringify(requestData)
      });

      console.log('收到响应状态:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('服务器错误响应:', errorText);
        throw new Error(`服务器响应错误: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('响应数据:', data);
      
      if (data.feedback) {
        setFeedback(data.feedback);
        setSubmitStatus('success');
        document.getElementById('feedbackSection')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        throw new Error('未收到有效的反馈数据');
      }
    } catch (error) {
      console.error('错误详情:', error);
      setSubmitStatus('error');
      setFeedback(`评估过程出现错误：${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Navigation*/}
      <nav className="navbar navbar-expand-lg navbar-light fixed-top py-3" id="mainNav">
        <div className="container px-4 px-lg-5">
          <Link to="/" className="navbar-brand">IELTS Writing Assistant</Link>
          <div className="ms-auto">
            <Link to="/" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left"></i> Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Essay Practice Section */}
      <section className="page-section" style={{ marginTop: '5rem' }}>
        <div className="container px-4 px-lg-5">
          <h2 className="text-center mt-0">Task 2 Essay Practice</h2>
          <hr className="divider" />
          
          {/* 题型选择 */}
          <div className="row mb-4">
            <div className="col-lg-12">
              <div className="d-flex justify-content-center gap-2">
                {topicTypes.map(type => (
                  <button
                    key={type.id}
                    className={`btn ${selectedType === type.id ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 题目选择 */}
          <div className="row gx-4 gx-lg-5 mb-5">
            <div className="col-lg-12">
              <h3 className="h4 mb-3">Select a practice question:</h3>
              <div className="row">
                {filteredTopics.map(topic => (
                  <div className="col-md-6 mb-4" key={topic.id}>
                    <div 
                      className={`card ${selectedTopic === topic.id ? 'border-primary' : ''}`}
                      onClick={() => setSelectedTopic(topic.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="card-title mb-0">{topic.name}</h5>
                          <span className="badge bg-primary">{topic.typeLabel}</span>
                        </div>
                        <p className="card-text">{topic.question}</p>
                        <div className="mt-2">
                          {topic.keywords.map((keyword, index) => (
                            <span key={index} className="badge bg-secondary me-2">{keyword}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Outline Input */}
          {selectedTopic && (
            <div className="row gx-4 gx-lg-5">
              <div className="col-lg-12">
                <h3 className="h4 mb-3">Please write your essay outline in English:</h3>
                <div className="form-group mb-3">
                  <textarea
                    className="form-control"
                    rows="8"
                    value={userOutline}
                    onChange={(e) => setUserOutline(e.target.value)}
                    placeholder="Please write your essay outline here. Include:

1. Introduction paragraph main points
2. Body paragraph 1 arguments and evidence
3. Body paragraph 2 arguments and evidence
4. Conclusion paragraph summary

Tip: Include keywords and specific examples"
                  ></textarea>
                </div>
                <button 
                  className="btn btn-primary btn-xl"
                  onClick={handleSubmit}
                  disabled={!userOutline.trim() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Evaluating...
                    </>
                  ) : 'Get AI Feedback'}
                </button>
              </div>
            </div>
          )}

          {/* 状态提示 */}
          {submitStatus === 'success' && (
            <div className="alert alert-success mt-3" role="alert">
              <i className="bi bi-check-circle me-2"></i>
              Evaluation complete! Please check the detailed feedback below.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="alert alert-danger mt-3" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              An error occurred during evaluation. Please try again later.
            </div>
          )}

          {/* AI Feedback */}
          {feedback && (
            <div id="feedbackSection" className="row gx-4 gx-lg-5 mt-5">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">AI Feedback & Suggestions</h5>
                  </div>
                  <div className="card-body">
                    {feedback.split('\n').map((paragraph, index) => (
                      paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default TrPractice;
