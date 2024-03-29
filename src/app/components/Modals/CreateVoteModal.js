import React,{useState} from 'react'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CreateVoteRootModal from './CreateVoteRootModal';
   const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
  };

function CreateVoteModal(props) {

    const [openRootVoteModal, setOpenRootVoteModal] = useState(false);
    const [description,setDescription] = useState();

    const handleOpenRootVoteModal = () => setOpenRootVoteModal(true);
    const handleCloseRootVoteModal = () => setOpenRootVoteModal(false);
    const handleDescription = (e)=>setDescription(e.target.value);

  return (
    <>
    <Modal
        open={props.open}
        onClose={props.close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" className='mb-4'>
                {props.title}
            </Typography>
            <TextField fullWidth
                id="outlined-multiline-static"
                required
                label="Description"
                multiline
                rows={4}
                onChange= {handleDescription}
                />
            <div className="mt-4">
                <Typography
                    variant="h6"
                    gutterBottom
                    component={"div"}
                    >
                    <span
                        className="font-weight-bold"
                        style={{ borderBottom: "1px dashed white", color: "#1976d2" }}
                        >
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            style={{ backgroundColor: "#1976d2", color: "white" }}
                            onClick={handleOpenRootVoteModal}
                            >
                            Create Vote
                        </Button>
                    </span>
                </Typography>
            </div>
            <CreateVoteRootModal open={openRootVoteModal} close={handleCloseRootVoteModal} click={props.click} description = {description} />
        </Box>
    </Modal>
    </>
  )
}

export default CreateVoteModal
