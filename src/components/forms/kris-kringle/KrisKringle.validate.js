const checkIfNameAlreadyExists = (name, otherRows) => {
	return otherRows ? otherRows.find(row => row.name === name) : false;
}

const checkIfPhoneAlreadyExists = (phone, otherRows) => {
	return otherRows ? otherRows.find(row => row.phone === phone) : false;
}

const checkIfPartnerAlreadyExists = (partner, otherRows) => {
	return otherRows ? otherRows.find(row => row.partner === partner) : false;
}


const KrisKringleValidationRules = (values, otherRows) => {
	let errors = {};

	if(!values.name) {
		errors.name = "The Name field is required";
	}

	if(!values.phone) {
		errors.phone = "The Phone field is required";
	}

	if(values.name) {
		if(checkIfNameAlreadyExists(values.name, otherRows)) {
			errors.name = "This name already exists";
		}
	}

	if(values.partner) {
		if(checkIfPartnerAlreadyExists(values.partner, otherRows)) {
			errors.partner = "This partner already exists";
		}
	}

	if(values.phone) {
		if(checkIfPhoneAlreadyExists(values.phone, otherRows)) {
			errors.phone = "This phone already exists";
		}
	}

	// check to see if there are duplicate partners

	// check to see if there are 

	return errors;
}
export default KrisKringleValidationRules;