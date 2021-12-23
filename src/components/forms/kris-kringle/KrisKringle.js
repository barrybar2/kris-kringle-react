
import { TextField, Box, Button, Grid } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LoadingButton from '@mui/lab/LoadingButton';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ReplayIcon from '@mui/icons-material/Replay';
import EditIcon from '@mui/icons-material/Edit';

// custom hooks
import useKrisKringle from "./useKrisKringle";

const KrisKringle = () => {

	const { participants, addParticipant, updateParticipant, handleChange, sendSMSPost, loading, SMSSent, smallWidth } = useKrisKringle();
	return (

		<Grid container l={12} justifyContent="center">
			<Box
				component="form"
				sx={{
					'& .MuiTextField-root': { m: 1, width: [smallWidth, smallWidth, '25ch']	  },
				}}
				noValidate
				autoComplete="off"
			>
				{participants ? participants.map((participent, index) => {
					return (
						<div key={participent.id}>
							<TextField
								disabled={participent.added}
								error={participent.errors ? !!participent.errors.name : false}
								helperText={participent.errors ? participent.errors.name : ""}
								type="text"
								onChange={e => { handleChange(index, e) }}
								value={participent.name}
								label="Name"
								id="name" />
							<TextField
								disabled={participent.added}
								type="tel"
								error={participent.errors ? !!participent.errors.phone : false}
								helperText={participent.errors ? participent.errors.phone : ""}
								onChange={e => { handleChange(index, e) }}
								value={participent.phone}
								label="Mobile Number"
								id="phone" />
							<TextField
								disabled={participent.added || participent.partnerMatch}
								type="text"
								error={participent.errors ? !!participent.errors.partner : false}
								helperText={participent.errors ? participent.errors.partner : ""}
								onChange={e => { handleChange(index, e) }}
								value={participent.partner}
								label="Partner"
								id="partner" />
							{participent.added ? (
								<Button
									color="success"
									style={{ marginTop: '5' }}
									variant="contained"
									onClick={() => { updateParticipant(index, false) }}
									startIcon={participent.SMSSent ? <DoneAllIcon /> : <EditIcon />}>
									{participent.SMSSent ? "Sent" : "Update"}
								</Button>
							) : (
								<Button
									color="success"
									style={{ marginTop: '16px' }}
									variant="contained"
									onClick={() => { addParticipant(index) }}
									startIcon={participent.SMSSent ? <DoneAllIcon /> : <AddCircleIcon />}>
									{participent.SMSSent ? "Sent" : "Add"}
								</Button>
							)}

						</div>
					)
				}) : null}

				{participants.length > 2 && (
					<>
						<Grid container l={12} justifyContent="start">
							<LoadingButton
								loading={loading}
								loadingIndicator="Loading..."
								color="success"
								style={{ marginTop: '16px', marginLeft: '10px' }}
								variant="contained"
								onClick={sendSMSPost}
								startIcon={SMSSent ? <ReplayIcon /> : <AddCircleIcon />}>
								{SMSSent ? "Start again" : "Send Kris Kringles"}
							</LoadingButton>
						</Grid>
					</>
				)}
			</Box>
		</Grid>
	)
}

export default KrisKringle;