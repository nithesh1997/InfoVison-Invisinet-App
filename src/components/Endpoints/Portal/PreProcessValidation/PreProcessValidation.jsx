import {
  Popup,
  PopupHeader,
  PopupContent,
  PopupFooter,
} from "./PreProcessValidation.styled";

const PreProcessValidation = ({
  disabled,
  title,
  onClose,
  loading,
  qualifiedRecords,
  unQualifiedRecords,
  footerActions,
  isUpgradeRemoteFirmware,
}) => {
  const popupHeaderProps = { title, onClose };
  const popupFooterProps = { disabled, ...footerActions };
  const popupContentProps = { qualifiedRecords, unQualifiedRecords, loading };

  return (
    <Popup>
      {onClose ? <PopupHeader {...popupHeaderProps} /> : null}
      <PopupContent
        {...popupContentProps}
        isUpgradeRemoteFirmware={isUpgradeRemoteFirmware}
      />
      <PopupFooter {...popupFooterProps} />
    </Popup>
  );
};

export default PreProcessValidation;
