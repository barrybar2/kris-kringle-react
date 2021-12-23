const emptyParticipent = {
	name: "",
	phone: "",
	partner: "",
	added: false,
	SMSSent: false,
	errors: {}
};

const objectIsPopulated = obj => {
	if (!obj) return false;
	return Object.entries(obj).length > 0;
}

const findPartner = (partner, participants) => {
	return participants.find(participant => participant.partner === partner);
}

const findPartnerMatch = (partner, participants) => {
	return participants.find(participant => participant.name === partner);
}

const findEmptyEntry = participants => {
	return participants.find(participant => !participant.name || !participant.phone)
}

const findPartnersName = (partner, participants) => {
	const currentPartner = findPartner(partner, participants);
	return currentPartner ? currentPartner.name : "";
}

const updatePartnerFieldFromName = (partner, e, participants) => {
	return partner ? "" : findPartnersName(e.target.value, participants);
}

const filterOutRow = (id, participants) => {
	return participants.filter(participant => participant.id !== id)
}

const validEntry = participant => {
	return !!(participant.name && participant.phone)
}

const entryStarted = participant => {
	return !!(participant.name || participant.number)
}

const getPayLoadForPOST = participants => {
	return participants.map(participant => {
		return {
			name: participant.name,
			number: participant.phone,
			partner: {
				name: participant.partner
			}
		}
	})
}

export {
	emptyParticipent,
	objectIsPopulated,
	findPartnerMatch,
	findEmptyEntry,
	findPartnersName,
	filterOutRow,
	validEntry,
	entryStarted,
	getPayLoadForPOST,
	updatePartnerFieldFromName
}

