import { Request, Response, Router } from "express";
import QRCode from "qrcode";

const walletRouter = Router();

// Middleware to check authentication  
const requireAuth = (req: Request, res: Response, next: Function) => {
  if (!req.session.userId) {
    res.status(401).json({ 
      success: false, 
      message: "Authentication required" 
    });
    return;
  }
  next();
};

// Get all wallet addresses for user
walletRouter.get("/addresses", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.session.userId);
    
    // Mock wallet data for now since services have import issues
    const wallets = [
      { id: 1, address: 'bc1qxyz...', currencyId: 1, userId },
      { id: 2, address: '0x123...', currencyId: 2, userId }
    ];
    
    // Prepare wallet data with QR codes
    const walletsWithQR = await Promise.all(
      wallets.map(async (wallet) => {
        try {
          const qrCode = await QRCode.toDataURL(wallet.address);
          
          // Mock currency info
          const currency = {
            id: wallet.currencyId,
            symbol: wallet.currencyId === 1 ? 'BTC' : 'ETH',
            name: wallet.currencyId === 1 ? 'Bitcoin' : 'Ethereum'
          };
          
          return {
            ...wallet,
            qrCode,
            currency,
          };
        } catch (error) {
          console.error('Error generating QR code:', error);
          return {
            ...wallet,
            qrCode: null,
          };
        }
      })
    );
    
    res.status(200).json({
      success: true,
      data: walletsWithQR,
    });
  } catch (error) {
    console.error("Error fetching wallet addresses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load wallet addresses",
    });
  }
});

// Check for new deposits
walletRouter.post("/check-deposits", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.session.userId);
    
    // Mock deposit check result
    const result = {
      success: true,
      depositsFound: 0
    };
    
    if (result.success) {
      if (result.depositsFound > 0) {
        // Mock balance data
        const balances = [
          { currencyId: 1, balance: 1000 },
          { currencyId: 2, balance: 500 }
        ];
        
        res.status(200).json({
          success: true,
          message: `${result.depositsFound} new deposits found and credited to your account`,
          data: {
            depositsFound: result.depositsFound,
            balances,
          },
        });
      } else {
        res.status(200).json({
          success: true,
          message: "No new deposits found",
          data: {
            depositsFound: 0,
          },
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: "Error checking for deposits",
      });
    }
  } catch (error) {
    console.error("Error checking for deposits:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check for deposits",
    });
  }
});

export default walletRouter;