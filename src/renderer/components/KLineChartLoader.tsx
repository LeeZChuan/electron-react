import React, { useState, useEffect } from 'react';

interface KLineChartLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onLoadComplete?: () => void;
}

export const KLineChartLoader: React.FC<KLineChartLoaderProps> = ({ 
  children, 
  fallback,
  onLoadComplete
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkKLineChart = () => {
      if (typeof window !== 'undefined' && window.klinecharts) {
        setIsLoaded(true);
        setIsLoading(false);
        onLoadComplete?.();
      } else {
        // 如果还没加载，继续检查
        setTimeout(checkKLineChart, 100);
      }
    };

    checkKLineChart();

    // 设置超时，避免无限等待
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        setIsLoading(false);
      }
    }, 10000); // 10秒超时

    return () => clearTimeout(timeout);
  }, [isLoaded, onLoadComplete]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        color: '#666666',
        backgroundColor: '#1e1e1e',
        borderRadius: '4px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>正在加载 KLineChart...</div>
          <div style={{ fontSize: '12px', color: '#888888' }}>
            请稍候
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return fallback || (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        color: '#666666',
        textAlign: 'center',
        backgroundColor: '#1e1e1e',
        borderRadius: '4px'
      }}>
        <div>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>KLineChart 加载失败</div>
          <div style={{ fontSize: '12px', color: '#888888' }}>
            请检查网络连接或刷新页面
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default KLineChartLoader; 