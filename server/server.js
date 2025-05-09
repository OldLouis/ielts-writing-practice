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
      hasApiKey: !!process.env.DEEPSEEK_API_KEY,
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
    
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error('未找到API密钥');
      return res.status(500).json({ error: 'API密钥配置错误' });
    }

    // 添加速率限制和重试机制
    const maxRetries = 3;
    let retryCount = 0;
    let response;
    const RATE_LIMIT_DELAY = 1500; // 1.5秒间隔
    
    while (retryCount < maxRetries) {
      try {
        // 添加请求延迟
        if (retryCount > 0) {
          await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
        }
        
        console.log('准备调用DeepSeek API，请求体:', {
          model: "deepseek-chat",
          messages: [
            { 
              role: "system", 
              content: "You are a professional IELTS writing examiner. Provide detailed evaluation following these steps:\n1. Give TR (Task Response) score (1-9)\n2. Analyze strengths and weaknesses\n3. Provide specific improvement suggestions\n4. Keep feedback constructive and professional" 
            },
            { 
              role: "user", 
              content: `Evaluate this IELTS Writing Task 2 response based on TR criteria:\n\nTopic: ${topic.question}\nType: ${topic.type}\nStudent's outline:\n${outline}\n\nProvide score first, then detailed feedback.` 
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });

        response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
          model: "deepseek-chat",
          messages: [
            { 
              role: "system", 
              content: "You are a professional IELTS writing examiner. Provide detailed evaluation following these steps:\n1. Give TR (Task Response) score (1-9)\n2. Analyze strengths and weaknesses\n3. Provide specific improvement suggestions\n4. Keep feedback constructive and professional" 
            },
            { 
              role: "user", 
              content: `Evaluate this IELTS Writing Task 2 response based on TR criteria:\n\nTopic: ${topic.question}\nType: ${topic.type}\nStudent's outline:\n${outline}\n\nProvide score first, then detailed feedback.` 
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            'Accept': 'application/json'
          },
          timeout: 30000, // 延长超时到30秒
          httpsAgent: new (require('https').Agent)({  
            rejectUnauthorized: false // 临时禁用SSL验证
          })
        });

        console.log('收到DeepSeek API响应');
        const feedback = response.data.choices[0].message.content;
        return res.json({ feedback });
        
      } catch (error) {
        retryCount++;
        console.error(`API调用失败 (尝试 ${retryCount}/${maxRetries})`, error.message);
        
        if (error.response) {
          // 处理API返回的错误
          if (error.response.status === 429) {
            console.log('达到速率限制，等待后重试...');
            await new Promise(resolve => setTimeout(resolve, 5000)); // 5秒后重试
            continue;
          }
          if (error.response.data?.error?.code === '1113') {
            return res.status(500).json({ 
              error: 'DeepSeek API账户问题',
              details: '请检查API密钥和账户状态'
            });
          }
        }
        
        if (retryCount >= maxRetries) {
          return res.status(500).json({ 
            error: '评分服务暂时不可用',
            details: error.message,
            apiResponse: error.response?.data 
          });
        }
        
        // 默认等待1秒后重试
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

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
  console.log('API_KEY 是否存在:', !!process.env.DEEPSEEK_API_KEY);
});
