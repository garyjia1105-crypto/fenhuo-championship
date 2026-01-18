const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const { requireAuth } = require('../middleware/auth');

// 获取所有选手（按总分降序排列）- 公开访问
router.get('/', async (req, res) => {
  try {
    const players = await Player.find({})
      .sort({ totalScore: -1 })
      .select('name extractionValue redValue kills totalScore createdAt updatedAt');
    
    res.json({ 
      success: true, 
      players,
      count: players.length 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: '获取排行榜失败', 
      error: error.message 
    });
  }
});

// 添加新选手 - 需要认证
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, extractionValue, redValue, kills } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: '选手姓名不能为空' 
      });
    }

    // 检查是否已存在同名选手
    const existingPlayer = await Player.findOne({ name: name.trim() });
    if (existingPlayer) {
      return res.status(400).json({ 
        success: false, 
        message: '该选手已存在' 
      });
    }

    const player = new Player({
      name: name.trim(),
      extractionValue: extractionValue || 0,
      redValue: redValue || 0,
      kills: kills || 0,
    });

    await player.save();
    
    res.status(201).json({ 
      success: true, 
      message: '选手添加成功', 
      player 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: '添加选手失败', 
      error: error.message 
    });
  }
});

// 更新选手分数 - 需要认证
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { extractionValue, redValue, kills, name } = req.body;
    const updateData = {};

    if (extractionValue !== undefined) updateData.extractionValue = extractionValue;
    if (redValue !== undefined) updateData.redValue = redValue;
    if (kills !== undefined) updateData.kills = kills;
    if (name !== undefined && name.trim() !== '') updateData.name = name.trim();

    const player = await Player.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!player) {
      return res.status(404).json({ 
        success: false, 
        message: '选手不存在' 
      });
    }

    // 重新计算总分
    player.totalScore = player.extractionValue - player.redValue + (player.kills * 250000);
    await player.save();

    res.json({ 
      success: true, 
      message: '选手信息更新成功', 
      player 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: '更新选手失败', 
      error: error.message 
    });
  }
});

// 删除选手 - 需要认证
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);

    if (!player) {
      return res.status(404).json({ 
        success: false, 
        message: '选手不存在' 
      });
    }

    res.json({ 
      success: true, 
      message: '选手删除成功', 
      player 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: '删除选手失败', 
      error: error.message 
    });
  }
});

module.exports = router;
