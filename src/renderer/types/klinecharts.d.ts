// 全局变量声明
declare global {
  interface Window {
    klinecharts: {
      init: (container: HTMLElement) => KLineChart;
      dispose: (container: HTMLElement) => void;
    };
  }
}

export interface KLineData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndicatorStyle {
  lines?: Array<{
    color?: string;
    size?: number;
  }>;
}

export interface IndicatorConfig {
  id: string;
  calcParams: number[];
  precision?: number;
  styles?: IndicatorStyle;
}

export interface ChartStyles {
  grid?: {
    show?: boolean;
    horizontal?: {
      show?: boolean;
      color?: string;
      size?: number;
    };
    vertical?: {
      show?: boolean;
      color?: string;
      size?: number;
    };
  };
  candle?: {
    priceMark?: {
      show?: boolean;
      high?: {
        show?: boolean;
        color?: string;
      };
      low?: {
        show?: boolean;
        color?: string;
      };
    };
  };
  indicator?: {
    bars?: {
      show?: boolean;
    };
  };
}

export interface KLineChart {
  setStyles(styles: ChartStyles): void;
  applyNewData(data: KLineData[]): void;
  createIndicator(name: string, config: IndicatorConfig): void;
  removeIndicator(): void;
}

// 导出全局函数类型
export declare function init(container: HTMLElement): KLineChart;
export declare function dispose(container: HTMLElement): void; 