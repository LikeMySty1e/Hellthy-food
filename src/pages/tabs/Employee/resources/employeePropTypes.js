import PropTypes from "prop-types";

const employeePropTypes = {
    data: PropTypes.shape({
        index: PropTypes.number,
        id: PropTypes.number.isRequired,
        fullname: PropTypes.string,
        birthday: PropTypes.string,
        contract: PropTypes.string,
        phone: PropTypes.string,
        position: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
}

export default employeePropTypes;
