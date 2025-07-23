import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Dashboard.css';
import KLineChartLoader from '../components/KLineChartLoader';
import { 
  generateMockKlineData,
  type KLineData 
} from '../utils/mockDataGenerator';

// 从全局变量获取 KLineChart 函数
const getKLineChart = () => {
  if (typeof window !== 'undefined' && window.klinecharts) {
    return window.klinecharts;
  }
  return null;
};

// 生成初始 mock 数据
const mockKlineData: KLineData[] = generateMockKlineData(30, '1m'); // 生成30天的分钟级数据

const mockIndicators = [
  { name: 'MA', enabled: true, period: 20, color: '#FF6B6B' },
  { name: 'EMA', enabled: false, period: 12, color: '#4ECDC4' },
  { name: 'BOLL', enabled: true, period: 20, color: '#45B7D1' },
  { name: 'MACD', enabled: false, period: 12, color: '#96CEB4' },
  { name: 'KDJ', enabled: true, period: 9, color: '#FFEAA7' },
  { name: 'RSI', enabled: false, period: 14, color: '#DDA0DD' },
];

const mockTimeframes = [
  { name: '1m', value: '1m' },
  { name: '5m', value: '5m' },
  { name: '15m', value: '15m' },
  { name: '30m', value: '30m' },
  { name: '1h', value: '1h' },
  { name: '4h', value: '4h' },
  { name: '1d', value: '1d' },
  { name: '1w', value: '1w' },
];

// 左侧控制面板组件
function ControlPanel({ 
  indicators, 
  timeframes, 
  selectedTimeframe, 
  onIndicatorToggle, 
  onTimeframeChange,
  onPeriodChange,
  theme,
  onThemeChange,
  showGrid,
  onGridToggle,
  showVolume,
  onVolumeToggle,
  onResetChart,
  onExportData,
  onSaveSettings
}: {
  indicators: typeof mockIndicators;
  timeframes: typeof mockTimeframes;
  selectedTimeframe: string;
  onIndicatorToggle: (index: number) => void;
  onTimeframeChange: (timeframe: string) => void;
  onPeriodChange: (index: number, period: number) => void;
  theme: string;
  onThemeChange: (theme: string) => void;
  showGrid: boolean;
  onGridToggle: () => void;
  showVolume: boolean;
  onVolumeToggle: () => void;
  onResetChart: () => void;
  onExportData: () => void;
  onSaveSettings: () => void;
}) {
  return (
    <div className="control-panel">
      <div className="panel-section">
        <h3>时间周期</h3>
        <div className="timeframe-grid">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              className={`timeframe-btn ${selectedTimeframe === tf.value ? 'active' : ''}`}
              onClick={() => onTimeframeChange(tf.value)}
            >
              {tf.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="panel-section">
        <h3>技术指标</h3>
        <div className="indicators-list">
          {indicators.map((indicator, index) => (
            <div key={indicator.name} className="indicator-item">
              <label className="indicator-label">
                <input
                  type="checkbox"
                  checked={indicator.enabled}
                  onChange={() => onIndicatorToggle(index)}
                />
                <span style={{ color: indicator.color }}>{indicator.name}</span>
              </label>
              {indicator.enabled && (
                <input
                  type="number"
                  className="period-input"
                  value={indicator.period}
                  min="1"
                  max="100"
                  onChange={(e) => onPeriodChange(index, parseInt(e.target.value) || 1)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="panel-section">
        <h3>图表设置</h3>
        <div className="setting-item">
          <label>主题</label>
          <select 
            className="setting-select" 
            value={theme}
            onChange={(e) => onThemeChange(e.target.value)}
          >
            <option value="dark">深色</option>
            <option value="light">浅色</option>
          </select>
        </div>
        <div className="setting-item">
          <label>网格</label>
          <input 
            type="checkbox" 
            checked={showGrid}
            onChange={onGridToggle}
          />
        </div>
        <div className="setting-item">
          <label>成交量</label>
          <input 
            type="checkbox" 
            checked={showVolume}
            onChange={onVolumeToggle}
          />
        </div>
      </div>

      <div className="panel-section">
        <h3>快捷操作</h3>
        <div className="quick-actions">
          <button className="action-btn" onClick={onResetChart}>重置图表</button>
          <button className="action-btn" onClick={onExportData}>导出数据</button>
          <button className="action-btn" onClick={onSaveSettings}>保存设置</button>
        </div>
      </div>
    </div>
  );
}

// 中间图表区域组件 - 使用 KLineChart
function ChartArea({ 
  data, 
  indicators, 
  theme, 
  showGrid, 
  showVolume,
  onCursorDataChange
}: { 
  data: KLineData[]; 
  indicators: typeof mockIndicators;
  theme: string;
  showGrid: boolean;
  showVolume: boolean;
  onCursorDataChange?: (data: KLineData | null) => void;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);
  
  // 计算价格变化
  const latestData = data[data.length - 1];
  const prevData = data[data.length - 2];
  const change = latestData?.close - prevData?.close || 0;
  const changePercent = prevData?.close ? (change / prevData.close) * 100 : 0;

  // 检查 KLineChart 是否已加载
  const isKLineChartLoaded = () => {
    return getKLineChart() !== null;
  };

  // 处理光标数据变化的辅助函数
  const handleCrosshairChange = (params: any) => {
    console.log(params, 'params-onCrosshairChange');
    
    if (params && params.crosshair.kLineData) {
      // 直接使用 KLineChart 返回的 kLineData
      const klineData = params.crosshair.kLineData;
      const cursorData: KLineData = {
        timestamp: klineData.timestamp,
        open: klineData.open,
        high: klineData.high,
        low: klineData.low,
        close: klineData.close,
        volume: klineData.volume
      };
      onCursorDataChange?.(cursorData);
    } else {
      onCursorDataChange?.(null);
    }
  };

  // 初始化图表
  useEffect(() => {
    const klinecharts = getKLineChart();
    if (chartRef.current && !chartInstance.current && klinecharts) {
      try {
        chartInstance.current = klinecharts.init(chartRef.current);
        
        // // 设置主题
        // chartInstance.current.setStyles({
        //   grid: {
        //     show: showGrid,
        //     horizontal: {
        //       show: showGrid,
        //       color: theme === 'dark' ? '#3a3a3a' : '#e0e0e0',
        //       size: 1
        //     },
        //     vertical: {
        //       show: showGrid,
        //       color: theme === 'dark' ? '#3a3a3a' : '#e0e0e0',
        //       size: 1
        //     }
        //   },
        //   candle: {
        //     priceMark: {
        //       show: true,
        //       high: {
        //         show: true,
        //         color: theme === 'dark' ? '#cccccc' : '#666666'
        //       },
        //       low: {
        //         show: true,
        //         color: theme === 'dark' ? '#cccccc' : '#666666'
        //       }
        //     }
        //   },
        //   indicator: {
        //     bars: {
        //       show: showVolume
        //     }
        //   }
        // });

        chartInstance.current.setSymbol({ ticker: '行情图坐标轴' })
        chartInstance.current.setPeriod({ span: 1, type: 'minute' })
        chartInstance.current.setBarSpace(2)

        console.log(data,'data');
        
        // 设置数据
        chartInstance.current.setDataLoader({
          getBars: ({ callback }: { callback: (data: KLineData[]) => void }) => {
            callback(data)
          }
        })
        
                  // 添加鼠标事件监听器
          if (onCursorDataChange) {
            chartInstance.current.subscribeAction('onCrosshairChange', handleCrosshairChange);
            
            // 鼠标离开图表时清除光标数据
            chartInstance.current.subscribeAction('mouseLeave', () => {
              onCursorDataChange(null);
            });
          }
      } catch (error) {
        console.error('KLineChart 初始化失败:', error);
      }
    }

    return () => {
      const klinecharts = getKLineChart();
      if (chartInstance.current && klinecharts) {
        try {
          klinecharts.dispose(chartRef.current!);
          chartInstance.current = null;
        } catch (error) {
          console.error('KLineChart 销毁失败:', error);
        }
      }
    };
  }, []);

  // 更新数据
  useEffect(() => {
    const klinecharts = getKLineChart();
    if (chartInstance.current && klinecharts) {
      try {
        // 更新数据
        chartInstance.current.setDataLoader({
          getBars: ({ callback }: { callback: (data: KLineData[]) => void }) => {
            callback(data)
          }
        });
      } catch (error) {
        console.error('KLineChart 数据更新失败:', error);
      }
    }
  }, [data]);

  // 更新主题和设置
  useEffect(() => {
    const klinecharts = getKLineChart();
    if (chartInstance.current && klinecharts) {
      try {
        chartInstance.current.setStyles({
          grid: {
            show: showGrid,
            horizontal: {
              show: showGrid,
              color: theme === 'dark' ? '#3a3a3a' : '#e0e0e0',
              size: 1
            },
            vertical: {
              show: showGrid,
              color: theme === 'dark' ? '#3a3a3a' : '#e0e0e0',
              size: 1
            }
          },
          candle: {
            priceMark: {
              show: true,
              high: {
                show: true,
                color: theme === 'dark' ? '#cccccc' : '#666666'
              },
              low: {
                show: true,
                color: theme === 'dark' ? '#cccccc' : '#666666'
              }
            }
          },
          indicator: {
            bars: {
              show: showVolume
            }
          }
        });
      } catch (error) {
        console.error('KLineChart 样式更新失败:', error);
      }
    }
  }, [theme, showGrid, showVolume]);

  // 更新技术指标
  useEffect(() => {
    const klinecharts = getKLineChart();
    if (chartInstance.current && klinecharts) {
      try {
        // 清除所有指标
        chartInstance.current.removeIndicator();
        
        // 添加启用的指标
        indicators.forEach(indicator => {
          if (indicator.enabled) {
            if (indicator.name === 'MA') {
              chartInstance.current.createIndicator('MA', {
                id: 'MA',
                calcParams: [indicator.period],
                precision: 2,
                styles: {
                  lines: [{
                    color: indicator.color,
                    size: 1
                  }]
                }
              });
            } else if (indicator.name === 'EMA') {
              chartInstance.current.createIndicator('EMA', {
                id: 'EMA',
                calcParams: [indicator.period],
                precision: 2,
                styles: {
                  lines: [{
                    color: indicator.color,
                    size: 1
                  }]
                }
              });
            } else if (indicator.name === 'BOLL') {
              chartInstance.current.createIndicator('BOLL', {
                id: 'BOLL',
                calcParams: [indicator.period, 2],
                precision: 2,
                styles: {
                  lines: [
                    { color: indicator.color, size: 1 },
                    { color: indicator.color, size: 1 },
                    { color: indicator.color, size: 1 }
                  ]
                }
              });
            } else if (indicator.name === 'MACD') {
              chartInstance.current.createIndicator('MACD', {
                id: 'MACD',
                calcParams: [12, 26, 9],
                precision: 2
              });
            } else if (indicator.name === 'KDJ') {
              chartInstance.current.createIndicator('KDJ', {
                id: 'KDJ',
                calcParams: [9, 3, 3],
                precision: 2
              });
            } else if (indicator.name === 'RSI') {
              chartInstance.current.createIndicator('RSI', {
                id: 'RSI',
                calcParams: [indicator.period],
                precision: 2,
                styles: {
                  lines: [{
                    color: indicator.color,
                    size: 1
                  }]
                }
              });
            }
          }
        });
      } catch (error) {
        console.error('KLineChart 指标更新失败:', error);
      }
    }
  }, [indicators]);

  return (
    <div className="chart-area">
      <div className="chart-header">
        <div className="symbol-info">
          <h2>BTC/USDT</h2>
          <span className="price">${data[data.length - 1]?.close?.toFixed(2) || '0.00'}</span>
          <span className={`change ${changePercent >= 0 ? 'positive' : 'negative'}`}>
            {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
          </span>
        </div>
        <div className="chart-controls">
          <button className="control-btn">全屏</button>
          <button className="control-btn">截图</button>
          <button className="control-btn">设置</button>
        </div>
      </div>
      
      <div className="chart-container">
        <div 
          ref={chartRef} 
          className="kline-chart"
          style={{ 
            width: '100%', 
            height: '100%',
            backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff'
          }}
        />
        <KLineChartLoader>
          <div 
            ref={chartRef} 
            className="kline-chart"
            style={{ 
              width: '100%', 
              height: '100%',
              backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff'
            }}
          />
        </KLineChartLoader>
      </div>
    </div>
  );
}

// 右侧信息面板组件 - 动态显示光标位置数据
function InfoPanel({ 
  data, 
  cursorData 
}: { 
  data: KLineData[];
  cursorData?: KLineData | null;
}) {
  // 如果没有光标数据，显示最新数据
  const displayData = cursorData || data[data.length - 1];
  const prevData = data[data.length - 2];
  
  if (!displayData) {
    return (
      <div className="info-panel">
        <div className="panel-section">
          <h3>市场信息</h3>
          <div className="market-info">
            <div className="info-row">
              <span>暂无数据</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const change = displayData.close - prevData.close;
  const changePercent = prevData.close ? (change / prevData.close) * 100 : 0;
  
  // 计算时间范围内的统计数据
  const getTimeRangeData = (minutes: number) => {
    const endIndex = data.findIndex(d => d.timestamp >= displayData.timestamp);
    const startIndex = Math.max(0, endIndex - minutes);
    const rangeData = data.slice(startIndex, endIndex + 1);
    
    if (rangeData.length === 0) return { max: 0, min: 0, volume: 0 };
    
    return {
      max: Math.max(...rangeData.map(d => d.high)),
      min: Math.min(...rangeData.map(d => d.low)),
      volume: rangeData.reduce((sum, d) => sum + d.volume, 0)
    };
  };

  const data24h = getTimeRangeData(1440); // 24小时
  const data1h = getTimeRangeData(60); // 1小时
  
  // 格式化时间
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  return (
    <div className="info-panel">
      <div className="panel-section">
        <h3>光标位置数据</h3>
        <div className="market-info">
          <div className="info-row">
            <span>时间</span>
            <span>{formatTime(displayData.timestamp)}</span>
          </div>
          <div className="info-row">
            <span>开盘价</span>
            <span className="price">${displayData.open.toFixed(2)}</span>
          </div>
          <div className="info-row">
            <span>最高价</span>
            <span className="price">${displayData.high.toFixed(2)}</span>
          </div>
          <div className="info-row">
            <span>最低价</span>
            <span className="price">${displayData.low.toFixed(2)}</span>
          </div>
          <div className="info-row">
            <span>收盘价</span>
            <span className="price">${displayData.close.toFixed(2)}</span>
          </div>
          <div className="info-row">
            <span>成交量</span>
            <span>{displayData.volume.toLocaleString()}</span>
          </div>
          <div className="info-row">
            <span>涨跌额</span>
            <span className={change >= 0 ? 'positive' : 'negative'}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}
            </span>
          </div>
          <div className="info-row">
            <span>涨跌幅</span>
            <span className={changePercent >= 0 ? 'positive' : 'negative'}>
              {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="panel-section">
        <h3>统计信息</h3>
        <div className="market-info">
          <div className="info-row">
            <span>1h最高</span>
            <span>${data1h.max.toFixed(2)}</span>
          </div>
          <div className="info-row">
            <span>1h最低</span>
            <span>${data1h.min.toFixed(2)}</span>
          </div>
          <div className="info-row">
            <span>1h成交量</span>
            <span>{data1h.volume.toLocaleString()}</span>
          </div>
          <div className="info-row">
            <span>24h最高</span>
            <span>${data24h.max.toFixed(2)}</span>
          </div>
          <div className="info-row">
            <span>24h最低</span>
            <span>${data24h.min.toFixed(2)}</span>
          </div>
          <div className="info-row">
            <span>24h成交量</span>
            <span>{data24h.volume.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
              <div className="panel-section">
          <h3>操作提示</h3>
          <div className="market-info">
            <div className="info-row hint">
              <span>在图表上移动鼠标查看详细数据</span>
            </div>
            <div className="info-row hint">
              <span>滚动鼠标滚轮缩放图表</span>
            </div>
            <div className="info-row hint">
              <span>拖拽图表平移视图</span>
            </div>
          </div>
        </div>
    </div>
  );
}

function DashboardLayout() {
  const [indicators, setIndicators] = useState(mockIndicators);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [klineData, setKlineData] = useState<KLineData[]>(mockKlineData);
  const [theme, setTheme] = useState('dark');
  const [showGrid, setShowGrid] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [cursorData, setCursorData] = useState<KLineData | null>(null);
  
  const handleIndicatorToggle = (index: number) => {
    const newIndicators = [...indicators];
    newIndicators[index].enabled = !newIndicators[index].enabled;
    setIndicators(newIndicators);
  };
  
  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
    console.log('切换时间周期:', timeframe);
  };
  
  const handlePeriodChange = (index: number, period: number) => {
    const newIndicators = [...indicators];
    newIndicators[index].period = period;
    setIndicators(newIndicators);
  };
  
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };
  
  const handleGridToggle = () => {
    setShowGrid(!showGrid);
  };
  
  const handleVolumeToggle = () => {
    setShowVolume(!showVolume);
  };

  const handleResetChart = () => {
    console.log('重置图表');
    setKlineData([...mockKlineData]);
    setIndicators([...mockIndicators]);
  };

  const handleExportData = () => {
    console.log('导出数据');
    const csvContent = "data:text/csv;charset=utf-8," 
      + "时间,开盘价,最高价,最低价,收盘价,成交量\n"
      + klineData.map(d => 
        `${new Date(d.timestamp).toLocaleString()},${d.open},${d.high},${d.low},${d.close},${d.volume}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "kline_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveSettings = () => {
    console.log('保存设置');
    const settings = {
      indicators,
      theme,
      showGrid,
      showVolume,
      selectedTimeframe
    };
    localStorage.setItem('klineChartSettings', JSON.stringify(settings));
    alert('设置已保存！');
  };
  
  return (
    <div className={`dashboard-container ${theme}`}>
      <ControlPanel
        indicators={indicators}
        timeframes={mockTimeframes}
        selectedTimeframe={selectedTimeframe}
        onIndicatorToggle={handleIndicatorToggle}
        onTimeframeChange={handleTimeframeChange}
        onPeriodChange={handlePeriodChange}
        theme={theme}
        onThemeChange={handleThemeChange}
        showGrid={showGrid}
        onGridToggle={handleGridToggle}
        showVolume={showVolume}
        onVolumeToggle={handleVolumeToggle}
        onResetChart={handleResetChart}
        onExportData={handleExportData}
        onSaveSettings={handleSaveSettings}
      />
      <ChartArea 
        data={klineData} 
        indicators={indicators} 
        theme={theme}
        showGrid={showGrid}
        showVolume={showVolume}
        onCursorDataChange={setCursorData}
      />
      <InfoPanel data={klineData} cursorData={cursorData} />
    </div>
  );
}

export default function Dashboard() {
  return <DashboardLayout />;
}
