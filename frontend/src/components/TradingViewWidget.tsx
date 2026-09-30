import React, { useEffect, useRef } from 'react';

interface Props {
  symbol: string;
}

export const TradingViewWidget: React.FC<Props> = ({ symbol }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      'autosize': true,
      'symbol': symbol.includes('/') ? symbol.replace('/', '') : symbol,
      'interval': '60',
      'timezone': 'Asia/Bangkok',
      'theme': 'dark',
      'style': '1',
      'locale': 'th_TH',
      'enable_publishing': false,
      'allow_symbol_change': true,
      'container_id': 'tradingview_chart'
    });
    container.current?.appendChild(script);
  }, [symbol]);

  return (
    <div className='tradingview-widget-container' ref={container} style={{ height: '100%', width: '100%' }}>
      <div id='tradingview_chart' style={{ height: 'calc(100% - 32px)', width: '100%' }}></div>
    </div>
  );
};
