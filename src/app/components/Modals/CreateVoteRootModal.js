import React, {useState} from 'react'

// MATERIAL UI
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

//STYLES
   const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minHeight:350,
    width: 600,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
  };

function CreateVoteRootModal(props) {

    const vote ={ 
        contractName:"contract Name",
        metaData:"Meta Data",
        description:"Vote Description"
    }

    const appName= "0x5b3e....54ddb68";
    const getSupportText = 50;
    const getQuorumText = 40;
    const [open, setOpen] = useState(false);
    const [executeVote, setExecuteVote]= useState(false);
    const [willSucceed, setWillSucceed]= useState(false);

    //   Event Handlers
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
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
                {executeVote? `Execute a vote on ${appName}`:`Create a vote on ${appName}`}
            </Typography>
            <div>
                <Typography>
                    {props.description}
                </Typography>
                <Typography>
                    {vote.contractName}
                </Typography>
                <Typography>
                    {vote.metaData}
                </Typography>
                <Typography>
                    {vote.description}
                </Typography>
                <Typography className='mt-2'>
                    {executeVote? `This vote requires ${ getSupportText }% acceptance and ${ getQuorumText }% quorum to be passed`:null}
                </Typography>
                <Typography>
                    {willSucceed? "The transaction may fail, you may not have the required permissions to make the transaction":null}
                </Typography>
            </div>
            <div className="mt-4">
                <Typography
                    variant="h6"
                    gutterBottom
                    component={"div"}
                    >
                    <span
                        className="font-weight-bold"
                        style={{ borderBottom: "1px dashed white", color: "#5300e8" }}
                        >
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            style={{ backgroundColor: "#5300e8", color: "white" }}
                            onClick={handleClose && props.click}
                            >
                             {executeVote? `Vote`:`Create Vote`}
                        </Button>
                    </span>
                </Typography>
            </div>
        </Box>
    </Modal>
    </>
  )
}

export default CreateVoteRootModal
