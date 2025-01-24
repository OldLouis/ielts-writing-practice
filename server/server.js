const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// 更新允许的域名列表
const allowedOrigins = [
  'http://localhost:3000',
  'https://my-ielts-website-nqrro6c9b-louis-projects-ed306c0f.vercel.app',
  'https://ielts-writing-practice.vercel.app',
  'https://easywrites.online',
  'https://www.easywrites.online',
];

// CORS 配置
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log('请求来源:', origin);  // 添加日志

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

app.use(express.json());

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('Headers:', req.headers);
  if (req.method === 'POST') {
    console.log('Body:', req.body);
  }
  next();
});

// 健康检查路由
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: {
      hasApiKey: !!process.env.ZHIPU_API_KEY,
      port: process.env.PORT
    }
  });
});

// 评估路由
app.post('/api/evaluate', async (req, res) => {
  try {
    console.log('收到评估请求');
    console.log('请求体:', req.body);
    
    const { outline, topic } = req.body;
    
    if (!outline || !topic) {
      return res.status(400).json({ error: '缺少必要参数' });
    }
    
    if (!process.env.ZHIPU_API_KEY) {
      console.error('未找到API密钥');
      return res.status(500).json({ error: 'API密钥配置错误' });
    }

    const response = await axios.post('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      model: "glm-4",
      messages: [
        { role: "system", content: "你是一位专业的雅思写作考官，精通雅思写作评分标准和教学。" },
        { role: "user", content: `作为一位专业的雅思写作考官，请对以下雅思大作文框架进行评估和提供建议。\n\n题目：${topic.question}\n类型：${topic.type}\n学生的框架：\n${outline}` }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`
      }
    });

    console.log('收到智谱API响应');
    const feedback = response.data.choices[0].message.content;
    res.json({ feedback });

  } catch (error) {
    console.error('详细错误信息:', error);
    res.status(500).json({ 
      error: '评分服务出现错误',
      details: error.message,
      apiResponse: error.response?.data 
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('环境变量检查:');
  console.log('PORT:', process.env.PORT);
  console.log('API_KEY 是否存在:', !!process.env.ZHIPU_API_KEY);
}); 