import { useState } from "react";
import validate from "./KrisKringle.validate";
import { objectIsPopulated, emptyParticipent, findPartnerMatch, findEmptyEntry, filterOutRow, validEntry, entryStarted, getPayLoadForPOST, updatePartnerFieldFromName } from "./KrisKringle.helpers";

const useKrisKringle = () => {
	const [participants, setParticipants] = useState([{ id: 0, ...emptyParticipent }]);
	const [loading, setLoading] = useState(false);
	const [SMSSent, setSMSSent] = useState(false);
	const smallWidth = "calc(100% - 20px)";

	const handleChange = (i, e) => {
		let newParticipents = [...participants];
		const { partner, errors } = newParticipents[i];
		const {value, id} = e.target;

		newParticipents[i][id] = value;

		if (id === "name") {
			newParticipents[i].partner = updatePartnerFieldFromName(partner, e, participants);
			newParticipents[i].partnerMatch = !!partner;
		}

		if (objectIsPopulated(errors)) {
			newParticipents[i].errors = validate(participants[i], filterOutRow(i, participants));
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
		newParticipents[i].partnerMatch = findPartnerMatch(participants[i].partner, participants);

		setParticipants(newParticipents);
	}

	const addRowWithPartner = i => {
		let partnerRow = { name: participants[i].partner, phone: "", id: participants.length, partner: participants[i].name, partnerMatch: true };
		let newParticipents = [...participants, partnerRow];
		newParticipents[i].added = true;

		setParticipants(newParticipents)
	}

	const updateParticipantWithErrs = (i, errors) => {
		let newParticipents = [...participants];
		newParticipents[i].errors = errors;
		newParticipents[i].added = false;

		setParticipants(newParticipents);
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
		const errors = validate(participants[i], filterOutRow(i, participants));
		if (objectIsPopulated(errors)) {
			updateParticipantWithErrs(i, errors);
		} else if (!findEmptyEntry(participants)) {
			if (participants[i].partner && !findPartnerMatch(participants[i].partner, participants)) {
				addRowWithPartner(i)
			} else {
				addNewEmptyRow(i)
			}
		} else {
			updateParticipant(i, true);
		}
	}

	const checkForNoMatchingPartners = () => {
		let allMatchning = true;
		for (const participant of participants) {
			if (participant.partner) {
				if (!findPartnerMatch(participant.partner, participants)) {
					updateParticipantWithErrs(participant.id, { partner: "There is no matchning partner" })
					allMatchning = false;
				}
			}
		}
		return allMatchning;
	}

	const requestSMSApi = () => {
		setLoading(true);
		setTimeout(() => {
			const validParticipants = participants.filter(participant => validEntry(participant))
			console.log(getPayLoadForPOST(validParticipants));
			updateSMSSentSuccess();
			setLoading(false);
			setSMSSent(true);

		}, 2000)
	}
	const sendSMSPost = () => {
		if (SMSSent) {
			window.location.reload();
		} else {
			const lastIndex = participants.length - 1;
			const errors = validate(participants[lastIndex], filterOutRow(lastIndex, participants));

			if (objectIsPopulated(errors) && entryStarted(participants[lastIndex])) {
				updateParticipantWithErrs(lastIndex, errors);
			} else if (!checkForNoMatchingPartners()) {

			} else {
				requestSMSApi();
			}

		}
	};

	return {
		smallWidth,
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