import PropTypes from "prop-types"; // Importamos prop-types
import { CCard, CCardBody, CCardTitle, CCardText } from "@coreui/react";

const CardInfo = ({ title, value, description }) => {
  return (
    <CCard className="mb-3 shadow-md">
      <CCardBody>
        <CCardTitle className="text-xl font-bold">{title}</CCardTitle>
        <CCardText className="text-2xl font-semibold">{value}</CCardText>
        <CCardText>{description}</CCardText>
      </CCardBody>
    </CCard>
  );
};

// 🔹 Validación de PropTypes
CardInfo.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string.isRequired,
};

export default CardInfo;
