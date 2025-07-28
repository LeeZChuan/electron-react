import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './styles.css';
import KLineChartLoader from '../../components/KLineChartLoader';
import { 
  generateMockKlineData,
  type KLineData 
} from '../../utils/mockDataGenerator';
import { User } from '../../utils/auth';

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

// 用户信息头部组件
function UserHeader({ user, onLogout }: { user: User | null; onLogout: () => void }) {
  return (
    <div className="user-header">
      <div className="user-info">
        <div className="user-avatar">
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="user-details">
          <div className="user-name">{user?.username || '用户'}</div>
          <div className="user-role">{user?.role === 'admin' ? '管理员' : '普通用户'}</div>
        </div>
      </div>
      <button className="logout-button" onClick={onLogout}>
        退出登录
      </button>
    </div>
  );
}

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
  const [isChartInitialized, setIsChartInitialized] = useState(false);
  

  // 检查 KLineChart 是否已加载
  const isKLineChartLoaded = () => {
    return getKLineChart() !== null;
  };

  // 处理光标数据变化的辅助函数
  const handleCrosshairChange = (params: any) => {
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

  // 使用 useMemo 缓存高度计算结果，只有指标变化时才重新计算
  const chartHeight = useMemo(() => {
    // 主图固定高度，不再根据容器动态调整
    const mainChartHeight = 400; // 主K线图固定高度
    
    // 计算启用的指标
    const enabledIndicators = indicators.filter(ind => ind.enabled);
    const overlayIndicators = enabledIndicators.filter(ind => 
      ['MA', 'EMA'].includes(ind.name)
    );
    const subIndicators = enabledIndicators.filter(ind => 
      ['MACD', 'KDJ', 'RSI','BOLL'].includes(ind.name)
    );
    
    // 叠加指标不占用额外高度，只需要少量空间用于图例
    const overlayHeight = overlayIndicators.length > 0 ? 0 : 0;
    
    // 定义不同指标的高度配置（与useEffect中保持一致）
    const indicatorHeightConfig: { [key: string]: number } = {
      'MA':300,
      'EMA':300,
      'BOLL': 120,  // 布林带需要显示上中下轨，高度适中
      'MACD': 100,  // MACD显示柱状图和线，高度稍小
      'KDJ': 100,   // KDJ显示三条线，高度稍小
      'RSI': 80,    // RSI只显示一条线，高度最小
    };
    
    // 计算副图指标的总高度（根据每个指标的实际配置高度）
    const totalSubHeight = subIndicators.reduce((total, indicator) => {
      return total + (indicatorHeightConfig[indicator.name] || 100); // 默认100px
    }, 0);
    
    // 计算总高度：主图 + 叠加指标图例 + 副图指标
    const totalHeight = mainChartHeight + overlayHeight + totalSubHeight;
    
    console.log('重新计算图表高度:', totalHeight, '指标数量:', {
      overlay: overlayIndicators.length,
      sub: subIndicators.length
    });
    
    return Math.round(totalHeight);
  }, [indicators]); // 只依赖 indicators，只有指标变化时才重新计算

  // 初始化图表
  useEffect(() => {
    const klinecharts = getKLineChart();
    if (chartRef.current && !chartInstance.current && klinecharts) {
      try {

        const option={
          styles:{
            candle:{
              tooltip:{
                showRule:'follow_cross',
                showType:'rect',
              }
            }
          },
          layout:[{
            type:'candle',
            options:{
              height:100,
              minHeight:100,
              axis:{
                name:'customYAxis',
              }
            }
          }]
        }
        chartInstance.current = klinecharts.init(chartRef.current,option);
        
        
        // 设置主题
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

        chartInstance.current.setSymbol({ ticker: '行情图坐标轴' })
        chartInstance.current.setPeriod({ span: 1, type: 'minute' })
        chartInstance.current.setBarSpace(2)
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
        
        // 标记图表已初始化完成
        setIsChartInitialized(true);
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

  // 更新图表高度的函数
  // const updateChartHeight = useCallback(() => {
  //   if (chartInstance.current && isChartInitialized && chartRef.current) {
  //     try {
  //       const chartElement = chartRef.current;
        
  //       console.log(chartHeight, 'newHeight from useMemo');
  //       // 直接使用缓存的高度值，不需要容差检查（因为是基于指标数量的确定计算）
  //       chartElement.style.height = `${chartHeight}px`;
        
  //       // 延迟调用resize确保DOM更新完成
  //       setTimeout(() => {
  //         if (chartInstance.current) {
  //           chartInstance.current.resize();
  //         }
  //       }, 100);
  //     } catch (error) {
  //       console.error('图表高度更新失败:', error);
  //     }
  //   }
  // }, [isChartInitialized, chartHeight]); // 依赖chartHeight而不是indicators

  // 监听指标变化，更新图表高度
  // useEffect(() => {
  //   updateChartHeight();
  // }, [updateChartHeight]); // 只依赖updateChartHeight，它内部已经依赖了chartHeight

  // 更新技术指标
  useEffect(() => {
    const klinecharts = getKLineChart();
    if (chartInstance.current && klinecharts) {
      try {
        // 清除所有指标
        chartInstance.current.removeIndicator();
        
        // 定义不同指标的面板高度配置
        const indicatorHeightConfig: { [key: string]: number } = {
          'MA':300,
          'EMA':300,
          'BOLL': 120,  // 布林带需要显示上中下轨，高度适中
          'MACD': 100,  // MACD显示柱状图和线，高度稍小
          'KDJ': 100,   // KDJ显示三条线，高度稍小
          'RSI': 80,    // RSI只显示一条线，高度最小
        };
        
        // 添加启用的指标
        indicators.forEach(indicator => {
          if (indicator.enabled) {
            let paneId = null; // 存储创建的面板ID
            
            if (indicator.name === 'MA') {
              // MA指标叠加在主图上，指定candle_pane
              paneId = chartInstance.current.createIndicator('MA', {
                id: 'MA',
                calcParams: [indicator.period],
                precision: 2,
                styles: {
                  lines: [{
                    color: indicator.color,
                    size: 1
                  }]
                }
              }, { id: 'candle_pane' });
     
              
            } else if (indicator.name === 'EMA') {
              // EMA指标叠加在主图上，指定candle_pane
              paneId = chartInstance.current.createIndicator('EMA', {
                id: 'EMA',
                calcParams: [indicator.period],
                precision: 2,
                styles: {
                  lines: [{
                    color: indicator.color,
                    size: 1
                  }]
                }
              }, { id: 'candle_pane' });
              
            } else if (indicator.name === 'BOLL') {
              // BOLL指标创建独立副图
              paneId = chartInstance.current.createIndicator('BOLL', {
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
              
              // 设置BOLL面板高度
              if (paneId) {
                chartInstance.current.setPaneOptions({
                  id: paneId,
                  height: indicatorHeightConfig['BOLL']
                });
              }
              
            } else if (indicator.name === 'MACD') {
              // MACD指标创建独立副图
              paneId = chartInstance.current.createIndicator('MACD', {
                id: 'MACD',
                calcParams: [12, 26, 9],
                precision: 2
              });
              
              // 设置MACD面板高度
              if (paneId) {
                chartInstance.current.setPaneOptions({
                  id: paneId,
                  height: indicatorHeightConfig['MACD']
                });
              }
              
            } else if (indicator.name === 'KDJ') {
              // KDJ指标创建独立副图
              paneId = chartInstance.current.createIndicator('KDJ', {
                id: 'KDJ',
                calcParams: [9, 3, 3],
                precision: 2
              });
              
              // 设置KDJ面板高度
              if (paneId) {
                chartInstance.current.setPaneOptions({
                  id: paneId,
                  height: indicatorHeightConfig['KDJ']
                });
              }
              
            } else if (indicator.name === 'RSI') {
              // RSI指标创建独立副图
              paneId = chartInstance.current.createIndicator('RSI', {
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
              
              // 设置RSI面板高度
              if (paneId) {
                chartInstance.current.setPaneOptions({
                  id: paneId,
                  height: indicatorHeightConfig['RSI']
                });
              }
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
        {/* {!isChartInitialized?
        <KLineChartLoader onLoadComplete={() => console.log('KLineChart 库加载完成')}>
          <div 
            ref={chartRef} 
            className="kline-chart"
            style={{ 
              width: '100%', 
              height: '400px',
              backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff'
            }}
          />
        </KLineChartLoader>:
        <></>
      } */}
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

interface DashboardLayoutProps {
  onLogout?: () => void;
  currentUser?: User | null;
}

function DashboardLayout({ onLogout, currentUser }: DashboardLayoutProps) {
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

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className={`dashboard-container ${theme}`}>
      <UserHeader user={currentUser || null} onLogout={handleLogout} />
      <div className="dashboard-main">
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
    </div>
  );
}

interface DashboardProps {
  onLogout?: () => void;
  currentUser?: User | null;
}

export default function Dashboard({ onLogout, currentUser }: DashboardProps) {
  return <DashboardLayout onLogout={onLogout} currentUser={currentUser} />;
}
