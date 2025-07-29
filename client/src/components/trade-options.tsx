import { NewsTicker } from "./news-ticker";
import { InvestmentFeatures } from "./investment-features";
import ProcessTicker from "./process-ticker";

export const TradeOptions = () => {
  return (
    <>
      {/* Process Ticker Animation */}
      <ProcessTicker />
      
      {/* News Ticker Banner */}
      <NewsTicker />
      
      {/* Investment Features Section */}
      <InvestmentFeatures />
    </>
  );
};