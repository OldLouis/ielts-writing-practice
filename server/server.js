const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.ZHIPU_API_KEY;
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

app.post('/api/evaluate', async (req, res) => {
  try {
    const { outline, topic } = req.body;

    const prompt = `作为一位专业的雅思写作考官，请对以下雅思大作文框架进行评估和提供建议。

题目：${topic.question}
类型：${topic.type}
学生的框架：
${outline}

请先给一个总体评价包括具体的分数，然后从以下几个方面进行评估和提供建议：
1. 框架结构是否完整合理
2. 论点是否切题，论据是否充分
3. 具体改进建议

请用中文回答，并保持友好专业的语气。`;

    const response = await axios.post(API_URL, {
      model: "glm-4",
      messages: [
        { role: "system", content: "你是一位专业的雅思写作考官，精通雅思写作评分标准和教学。" },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    const feedback = response.data.choices[0].message.content;
    res.json({ feedback });

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ error: '评分服务出现错误' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 