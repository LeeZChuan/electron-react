import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

interface ExternalWebsiteProps {
  onLogout?: () => void;
  currentUser?: any;
  onPageChange?: (page: string) => void;
  isSubPage?: boolean;
  theme?: 'dark' | 'light';
}

interface WebsiteConfig {
  url: string;
  title: string;
  enabled: boolean;
}

const ExternalWebsite: React.FC<ExternalWebsiteProps> = ({ theme = 'dark' }) => {
  const [config, setConfig] = useState<WebsiteConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 加载配置文件
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // 通过 Electron IPC 读取配置文件
        const result = await window.electron.config.read();
        
        if (result.success && result.data?.externalWebsite) {
          setConfig(result.data.externalWebsite);
          setIsLoading(false);
        } else {
          throw new Error(result.error || '配置文件格式错误');
        }
      } catch (error) {
        console.error('加载配置文件失败:', error);
        setErrorMessage('配置文件加载失败，请检查 config.json 文件是否存在');
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  // iframe 加载完成
  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // iframe 加载错误
  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    setErrorMessage('网页加载失败，请检查网络连接或URL是否正确');
  };

  // 刷新页面
  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      setHasError(false);
      // 重新加载 iframe
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 100);
    }
  };

  if (!config) {
    return (
      <div className={`external-website-container ${theme}`}>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>正在加载配置...</p>
        </div>
      </div>
    );
  }

  if (!config.enabled) {
    return (
      <div className={`external-website-container ${theme}`}>
        <div className="disabled-state">
          <p>外部网站功能已禁用</p>
          <p className="hint">请在 config.json 中启用此功能</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`external-website-container ${theme}`}>
    

      <div className="iframe-container">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>正在加载网页...</p>
          </div>
        )}

        {hasError && (
          <div className="error-overlay">
            <div className="error-icon">⚠️</div>
            <h3>加载失败</h3>
            <p>{errorMessage}</p>
            <button onClick={handleRefresh} className="retry-btn">
              重试
            </button>
          </div>
        )}

        {!hasError && (
          <iframe
            ref={iframeRef}
            src={config.url}
            title={config.title}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        )}
      </div>

      <div className="website-footer">
        <p className="security-notice">
          ⚠️ 安全提示：此页面显示的是外部网站内容，请注意信息安全
        </p>
      </div>
    </div>
  );
};

export default ExternalWebsite;

