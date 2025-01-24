const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// 详细的 CORS 配置
app.use(cors({
  origin: ['http://localhost:3000', 'https://ielts-writing-practice.vercel.app', '*'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// 添加预检请求处理
app.options('*', cors());

app.use(express.json());

// 添加请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('请求头:', req.headers);
  if (req.method === 'POST') {
    console.log('请求体:', req.body);
  }
  next();
});

// 健康检查路由应该直接返回结果，不需要调用智谱API
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

const API_KEY = process.env.ZHIPU_API_KEY;
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

app.post('/api/evaluate', async (req, res) => {
  try {
    console.log('收到评估请求');
    console.log('请求体:', req.body);
    
    const { outline, topic } = req.body;
    
    if (!outline || !topic) {
      return res.status(400).json({ error: '缺少必要参数' });
    }
    
    if (!API_KEY) {
      console.error('未找到API密钥');
      return res.status(500).json({ error: 'API密钥配置错误' });
    }

    console.log('准备发送到智谱API');
    const response = await axios.post(API_URL, {
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
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    console.log('收到智谱API响应');
    const feedback = response.data.choices[0].message.content;
    res.json({ feedback });

  } catch (error) {
    console.error('详细错误信息:', error);
    console.error('API响应错误:', error.response?.data);
    res.status(500).json({ 
      error: '评分服务出现错误',
      details: error.message,
      apiResponse: error.response?.data 
    });
  }
});

// 检查必要的环境变量
if (!process.env.ZHIPU_API_KEY) {
  console.error('错误: 缺少必要的环境变量 ZHIPU_API_KEY');
  console.error('请在 Render 的环境变量设置中添加 ZHIPU_API_KEY');
}

const port = process.env.PORT || 3000;  // 使用 Render 提供的 PORT 环境变量
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('环境变量检查:');
  console.log('PORT:', process.env.PORT);
  console.log('API_KEY 是否存在:', !!process.env.ZHIPU_API_KEY);
  if (!process.env.ZHIPU_API_KEY) {
    console.log('警告: ZHIPU_API_KEY 未设置，API 调用将会失败');
  }
}); 