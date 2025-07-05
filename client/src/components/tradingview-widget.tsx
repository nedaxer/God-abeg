import { useEffect, useRef, memo } from 'react';
import { usePersistentChart } from './persistent-chart-manager';

declare global {
  interface Window {
    TradingView: any;
    tradingViewChartsLoaded: Set<string>;
  }
}

interface TradingViewWidgetProps {
  symbol?: string;
  width?: string;
  height?: string;
  locale?: string;
  theme?: 'light' | 'dark';
  style?: '1' | '2' | '3' | '8' | '9';
  toolbar_bg?: string;
  enable_publishing?: boolean;
  allow_symbol_change?: boolean;
  container_id?: string;
  autosize?: boolean;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = memo(({
  symbol = 'BINANCE:BTCUSDT',
  width = '100%',
  height = '400',
  locale = 'en',
  theme = 'dark',
  style = '1',
  toolbar_bg = '#f1f3f6',
  enable_publishing = false,
  allow_symbol_change = true,
  container_id = 'tradingview_widget',
  autosize = false
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize,
      symbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme,
      style,
      locale,
      enable_publishing,
      allow_symbol_change,
      calendar: false,
      support_host: 'https://www.tradingview.com',
      width,
      height,
      toolbar_bg,
      withdateranges: true,
      hide_side_toolbar: false,
      container_id
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, width, height, locale, theme, style, toolbar_bg, enable_publishing, allow_symbol_change, container_id, autosize]);

  return (
    <div className="tradingview-widget-container" style={{ width, height }}>
      <div
        ref={containerRef}
        className="tradingview-widget"
        id={container_id}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
});

TradingViewWidget.displayName = 'TradingViewWidget';

export default TradingViewWidget;