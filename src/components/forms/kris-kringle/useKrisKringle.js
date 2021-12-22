import { useState } from "react";
import validate from "./KrisKringle.validate";

const useKrisKringle = () => {

	const emptyParticipent = { name: "", phone: "", partner: "", added: false, SMSSent: false, errors: {} };
	const [participants, setParticipants] = useState([
		{ id: 0, ...emptyParticipent }
	]);
	const [loading, setLoading] = useState(false);
	const [SMSSent, setSMSSent] = useState(false)

	const findPartner = partner => {
		return participants.find(participant => participant.partner === partner);
	}

	const objectIsPopulated = obj => {
		if (!obj) return false;
		return Object.entries(obj).length > 0;
	}

	const findPartnerMatch = partner => {
		return participants.find(participant => participant.name === partner);
	}

	const findPartnersName = partner => {
		const currentPartner = findPartner(partner);
		return currentPartner ? currentPartner.name : "";
	}

	const findEmptyEntry = () => {
		return participants.find(participant => !participant.name || !participant.phone)
	}

	const filterOutRow = id => {
		return participants.filter(participant => participant.id !== id)
	}

	const handleChange = (i, e) => {
		let newParticipents = [...participants];
		newParticipents[i][e.target.id] = e.target.value;

		if (e.target.id === "name") {
			if (newParticipents[i].partner) {
				newParticipents[i].partnerMatch = false;
				newParticipents[i].partner = "";
			} else {
				newParticipents[i].partner = findPartnersName(e.target.value);
			}

		}

		if (objectIsPopulated(newParticipents[i].errors)) {
			newParticipents[i].errors = validate(participants[i], filterOutRow(i));
		}
		setParticipants(newParticipents);
	}

	const addNewEmptyRow = i => {
		let newParticipents = [...participants, { id: participants.length, ...emptyParticipent }]
		newParticipents[i].added = true;
		newParticipents[i].wasSubmitted = true;

		setParticipants(newParticipents);
	}

	const updateParticipant = (i, added) => {
		let newParticipents = [...participants];
		newParticipents[i].added = added;
		newParticipents[i].partnerMatch = findPartnerMatch(participants[i].partner);
		setParticipants(newParticipents);
	}

	const addRowWithPartner = i => {
		let partnerRow = { name: participants[i].partner, phone: "", id: participants.length, partner: participants[i].name, partnerMatch: true };
		let newParticipents = [...participants, partnerRow];
		newParticipents[i].added = true;
		setParticipants(newParticipents)
	}

	const updateParticipantwithErrs = (i, errors) => {
		let newParticipents = [...participants];

		newParticipents[i].errors = errors;
		setParticipants(newParticipents);
	}


	const validEntry = participant => {
		return !!(participant.name && participant.phone)
	}

	const updateSMSSentSuccess = () => {
		setParticipants(participants.map(participant => {
			return {
				...participant,
				SMSSent: validEntry(participant)
			}
		}))
	}

	const addParticipant = i => {
		const errors = validate(participants[i], filterOutRow(i));
		if (objectIsPopulated(errors)) {
			updateParticipantwithErrs(i, errors);
		} else if (!findEmptyEntry()) {
			if (participants[i].partner && !findPartnerMatch(participants[i].partner)) {
				addRowWithPartner(i)
			} else {
				addNewEmptyRow(i)
			}
		} else {
			updateParticipant(i, true);
		}
	}

	const getPayLoadForPOST = validParticipants => {
		return validParticipants.map(participant => {
			return {
				name: participant.name,
				number: participant.phone,
				partner: {
					name: participant.partner
				}
			}
		})
	}

	const requestSMSApi = () => {
		setLoading(true);
		setTimeout(() => {
			const validParticipants = participants.filter(participant => validEntry(participant))
			console.log(getPayLoadForPOST(validParticipants));
			updateSMSSentSuccess();
			setLoading(false);
			setSMSSent(true);

		}, 4000)
	}
	const sendSMSPost = () => {
		if (SMSSent) {
			window.location.reload();
		} else {
			const lastIndex = participants.length - 1	;
			const errors = validate(participants[lastIndex], filterOutRow(lastIndex));
			if (objectIsPopulated(errors)) {
				updateParticipantwithErrs(lastIndex, errors);
			} else {
				requestSMSApi();
			}

		}
	};

	return {
		participants,
		addParticipant,
		updateParticipant,
		handleChange,
		sendSMSPost,
		loading,
		setLoading,
		SMSSent
	}

}

export default useKrisKringle;