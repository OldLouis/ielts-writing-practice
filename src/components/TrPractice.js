import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TrPractice = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [userOutline, setUserOutline] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  // 更新题库为真实考题
  const essayTopics = [
    // Agree/Disagree 类型
    {
      id: 'agree-1',
      name: 'Cambridge 17 Test 1',
      type: 'agree_disagree',
      typeLabel: '同意/不同意',
      question: 'Some people believe that it is best to accept a bad situation, such as an unsatisfactory job or shortage of money. Others argue that it is better to try and improve such situations. Discuss both these views and give your own opinion.',
      keywords: ['attitude', 'life situation', 'improvement']
    },
    {
      id: 'agree-2',
      name: 'Cambridge 16 Test 2',
      type: 'agree_disagree',
      typeLabel: '同意/不同意',
      question: 'Some people think that governments should spend money on railways rather than roads. To what extent do you agree or disagree with this statement?',
      keywords: ['transport', 'government spending', 'infrastructure']
    },
    // Discussion 类型
    {
      id: 'discuss-1',
      name: 'Cambridge 15 Test 3',
      type: 'discussion',
      typeLabel: '讨论型',
      question: 'Some people think that all university students should study whatever they like. Others believe that they should only be allowed to study subjects that will be useful in the future, such as those related to science and technology. Discuss both these views and give your own opinion.',
      keywords: ['education', 'university', 'subject choice']
    },
    {
      id: 'discuss-2',
      name: 'Cambridge 14 Test 4',
      type: 'discussion',
      typeLabel: '讨论型',
      question: 'In some countries, more and more people are becoming interested in finding out about the history of the house or building they live in. What are the reasons for this? Do you think this is a positive or negative development?',
      keywords: ['history', 'housing', 'cultural interest']
    },
    // Problem and Solution 类型
    {
      id: 'solution-1',
      name: 'Cambridge 13 Test 1',
      type: 'solution',
      typeLabel: '解决方案',
      question: 'In many cities the use of video cameras in public places is being increased in order to reduce crime, but some people believe that these measures restrict our individual freedom. Do the benefits of increased security outweigh the drawbacks?',
      keywords: ['security', 'privacy', 'technology']
    },
    {
      id: 'solution-2',
      name: 'Cambridge 12 Test 2',
      type: 'solution',
      typeLabel: '解决方案',
      question: 'Many people believe that international tourism creates understanding between nations and cultures. Others argue that it has negative effects on local cultures and the environment. Discuss both views and give your opinion.',
      keywords: ['tourism', 'culture', 'environment']
    },
    // Advantages/Disadvantages 类型
    {
      id: 'advantage-1',
      name: 'Cambridge 11 Test 3',
      type: 'advantages',
      typeLabel: '利弊分析',
      question: 'Some people think that parents should teach children how to be good members of society. Others, however, believe that school is the place to learn this. Discuss both these views and give your own opinion.',
      keywords: ['education', 'parenting', 'social values']
    },
    // Two-part Question 类型
    {
      id: 'twopart-1',
      name: 'Cambridge 10 Test 4',
      type: 'twopart',
      typeLabel: '双问题',
      question: 'More and more people are moving away from rural areas and towards urban areas. What are the causes of this? What problems does this create?',
      keywords: ['urbanisation', 'rural areas', 'social change']
    }
  ];

  // 更新题型分类
  const topicTypes = [
    { id: 'all', label: '所有题型' },
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
      const response = await fetch('http://https://ielts-writing-practice.onrender.com/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outline: userOutline,
          topic: selectedEssayTopic
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setFeedback(data.feedback);
      setSubmitStatus('success');
      // 自动滚动到反馈部分
      document.getElementById('feedbackSection')?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
      setFeedback('抱歉，评分过程中出现错误，请稍后重试。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Navigation*/}
      <nav className="navbar navbar-expand-lg navbar-light fixed-top py-3" id="mainNav">
        <div className="container px-4 px-lg-5">
          <Link to="/" className="navbar-brand">雅思写作助手</Link>
          <div className="ms-auto">
            <Link to="/" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left"></i> 返回主页
            </Link>
          </div>
        </div>
      </nav>

      {/* Essay Practice Section */}
      <section className="page-section" style={{ marginTop: '5rem' }}>
        <div className="container px-4 px-lg-5">
          <h2 className="text-center mt-0">大作文练习</h2>
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
              <h3 className="h4 mb-3">选择练习题目：</h3>
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
                <h3 className="h4 mb-3">请用中文写出作文框架：</h3>
                <div className="form-group mb-3">
                  <textarea
                    className="form-control"
                    rows="8"
                    value={userOutline}
                    onChange={(e) => setUserOutline(e.target.value)}
                    placeholder="请在这里输入你的作文框架，建议包含：

1. 开头段落的主要观点
2. 主体段落1的论点和论据
3. 主体段落2的论点和论据
4. 结论段落的总结观点

提示：可以包含关键词和具体例子"
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
                      正在评估中...
                    </>
                  ) : '获取 AI 评价'}
                </button>
              </div>
            </div>
          )}

          {/* 状态提示 */}
          {submitStatus === 'success' && (
            <div className="alert alert-success mt-3" role="alert">
              <i className="bi bi-check-circle me-2"></i>
              评估完成！请查看下方的详细反馈。
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="alert alert-danger mt-3" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              评估过程出现错误，请稍后重试。
            </div>
          )}

          {/* AI Feedback */}
          {feedback && (
            <div id="feedbackSection" className="row gx-4 gx-lg-5 mt-5">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">AI 评价建议</h5>
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