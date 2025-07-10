import AdaptiveLayout from '@/components/adaptive-layout';
import WithdrawalDetails from '@/pages/mobile/withdrawal-details';
import DesktopWithdrawalDetails from '@/components/desktop-pages/desktop-withdrawal-details';

export default function WithdrawalDetailsAdaptive() {
  return (
    <AdaptiveLayout
      mobileComponent={<WithdrawalDetails />}
      desktopComponent={<DesktopWithdrawalDetails />}
      title="Nedaxer - Withdrawal Details"
    />
  );
}