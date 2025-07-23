export interface KLineData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// 生成更真实的 K线数据
export const generateMockKlineData = (days: number = 30, interval: '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' = '1m'): KLineData[] => {
  const data: KLineData[] = [];
  let basePrice = 50000; // 起始价格
  let baseVolume = 1000; // 起始成交量
  
  // 根据时间间隔计算数据点数量
  const getIntervalMinutes = (interval: string): number => {
    switch (interval) {
      case '1m': return 1;
      case '5m': return 5;
      case '15m': return 15;
      case '30m': return 30;
      case '1h': return 60;
      case '4h': return 240;
      case '1d': return 1440;
      default: return 1;
    }
  };
  
  const intervalMinutes = getIntervalMinutes(interval);
  const totalMinutes = days * 24 * 60;
  const dataPoints = Math.floor(totalMinutes / intervalMinutes);
  
  // 生成时间戳（从指定天数前开始）
  const startTime = Date.now() - (days * 24 * 60 * 60 * 1000);
  
  for (let i = 0; i < dataPoints; i++) {
    const timestamp = startTime + (i * intervalMinutes * 60 * 1000);
    
    // 生成更真实的价格波动
    const volatility = 0.02; // 2% 波动率
    const trend = Math.sin(i / 100) * 0.01; // 长期趋势
    const noise = (Math.random() - 0.5) * volatility; // 随机噪声
    
    // 添加市场情绪变化（模拟新闻事件等）
    const marketSentiment = Math.sin(i / 50) * 0.005; // 市场情绪波动
    
    // 计算价格变化
    const priceChange = trend + noise + marketSentiment;
    basePrice *= (1 + priceChange);
    
    // 确保价格在合理范围内
    basePrice = Math.max(10000, Math.min(100000, basePrice));
    
    // 生成 OHLC 数据
    const open = basePrice;
    const high = open * (1 + Math.random() * 0.015); // 最高价
    const low = open * (1 - Math.random() * 0.015); // 最低价
    const close = open * (1 + (Math.random() - 0.5) * 0.02); // 收盘价
    
    // 确保 high >= max(open, close), low <= min(open, close)
    const maxPrice = Math.max(open, close);
    const minPrice = Math.min(open, close);
    
    // 生成成交量（与价格波动相关）
    const volumeMultiplier = 1 + Math.abs(priceChange) * 15; // 波动越大，成交量越大
    const timeMultiplier = 1 + Math.sin(i / 24) * 0.3; // 模拟交易时间影响
    const volume = Math.floor(baseVolume * volumeMultiplier * timeMultiplier * (0.5 + Math.random()));
    
    data.push({
      timestamp,
      open: Math.round(open * 100) / 100,
      high: Math.round(Math.max(high, maxPrice) * 100) / 100,
      low: Math.round(Math.min(low, minPrice) * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.floor(volume)
    });
    
    // 更新基础价格和成交量
    basePrice = close;
    baseVolume = volume * (0.8 + Math.random() * 0.4); // 成交量也有一定连续性
  }
  
  return data;
};

// 生成交易深度数据
export const generateDepthData = (currentPrice: number) => {
  const asks = [];
  const bids = [];
  
  for (let i = 1; i <= 10; i++) {
    const askPrice = currentPrice + i * 50;
    const askAmount = (Math.random() * 5 + 0.5).toFixed(3);
    const askTotal = ((i * (Math.random() * 3 + 1)) + parseFloat(askAmount)).toFixed(3);
    
    asks.push({
      price: askPrice.toFixed(2),
      amount: askAmount,
      total: askTotal
    });
    
    const bidPrice = currentPrice - i * 50;
    const bidAmount = (Math.random() * 5 + 0.5).toFixed(3);
    const bidTotal = ((i * (Math.random() * 3 + 1)) + parseFloat(bidAmount)).toFixed(3);
    
    bids.push({
      price: bidPrice.toFixed(2),
      amount: bidAmount,
      total: bidTotal
    });
  }
  
  return { asks, bids };
};

// 生成最近成交数据
export const generateTradeData = (currentPrice: number, count: number = 20) => {
  const trades = [];
  
  for (let i = 0; i < count; i++) {
    const tradeTime = new Date(Date.now() - (i * 30000)); // 每30秒一笔交易
    const priceChange = (Math.random() - 0.5) * 200; // ±100美元的价格波动
    const tradePrice = currentPrice + priceChange;
    const tradeAmount = (Math.random() * 10 + 0.1).toFixed(3);
    
    trades.push({
      time: tradeTime,
      price: tradePrice.toFixed(2),
      amount: tradeAmount,
      type: priceChange >= 0 ? 'buy' : 'sell'
    });
  }
  
  return trades;
};

// 生成市场统计数据
export const generateMarketStats = (data: KLineData[]) => {
  const latestData = data[data.length - 1];
  const prevData = data[data.length - 2];
  const change = latestData.close - prevData.close;
  const changePercent = (change / prevData.close) * 100;
  
  // 计算24小时数据（假设数据是分钟级的，24小时 = 1440个数据点）
  const last24hData = data.slice(-1440);
  const max24h = Math.max(...last24hData.map(d => d.high));
  const min24h = Math.min(...last24hData.map(d => d.low));
  const volume24h = last24hData.reduce((sum, d) => sum + d.volume, 0);
  
  // 计算7天数据
  const last7dData = data.slice(-10080); // 7 * 24 * 60
  const max7d = Math.max(...last7dData.map(d => d.high));
  const min7d = Math.min(...last7dData.map(d => d.low));
  const volume7d = last7dData.reduce((sum, d) => sum + d.volume, 0);
  
  return {
    currentPrice: latestData.close,
    change,
    changePercent,
    max24h,
    min24h,
    volume24h,
    max7d,
    min7d,
    volume7d
  };
}; 