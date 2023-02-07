import React, {useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import SigningModal from "./SigningModal";
//blockchain
import { CasperServiceByJsonRPC, CLPublicKey, RuntimeArgs,CLOption } from "casper-js-sdk";
import { createRecipientAddress } from "../JsClients/VESTINGESCROW/src/utils";
import { VESTING_ESCROW_CONTRACT_HASH } from "../blockchain/Hashes/ContractHashes";
import { Some } from "ts-results";
import { makeDeploy } from "../blockchain/MakeDeploy/MakeDeploy";
import { signdeploywithcaspersigner } from "../blockchain/SignDeploy/SignDeploy";
import { putdeploy } from "../blockchain/PutDeploy/PutDeploy";
import { useSnackbar } from "notistack";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height:150,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius:4
};

export default function ClaimConfirmModal({show,hide,setOpen,balance}) {
//   const [open, setOpen] = useState(false);
//   const handleOpen = () => setOpen(true);
//    const handleClose = () => setOpen(false);
const [openSigning, setOpenSigning] = useState(false);
const handleCloseSigning = () => {
  setOpenSigning(false);
};
const handleShowSigning = () => {
  setOpenSigning(true);
};
const { enqueueSnackbar } = useSnackbar();

async function claimMakeDeploy() {
    setOpen(false);
    handleShowSigning();
    const publicKeyHex = localStorage.getItem("Address");
    // const publicKeyHex = activePublicKey;
    console.log("Public key: ", publicKeyHex);
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const key = createRecipientAddress(publicKey);
      const paymentAmount = 5000000000;
      try {
        console.log("In try block");
        // const runtimeArgs = RuntimeArgs.fromMap({
        //   value: CLValueBuilder.u256(convertToStr(lockedAmount)),
        //   unlock_time: CLValueBuilder.u256(unlockTime.getTime()),
        // });
        const runtimeArgs = RuntimeArgs.fromMap({
          owner: new CLOption(Some(key)),
        });
        let contractHashAsByteArray = Uint8Array.from(
          Buffer.from(VESTING_ESCROW_CONTRACT_HASH, "hex")
        );
        console.log("contract hash byte array: ", contractHashAsByteArray);
        let entryPoint = "claim";
        // Set contract installation deploy (unsigned).
        let deploy = await makeDeploy(
          publicKey,
          contractHashAsByteArray,
          entryPoint,
          runtimeArgs,
          paymentAmount
        );
        console.log("make deploy: ", deploy);
        try {
          console.log("In other try block");
          let signedDeploy = await signdeploywithcaspersigner(
            deploy,
            publicKeyHex
          );
          let result = await putdeploy(signedDeploy, enqueueSnackbar);
          console.log("result", result);

          handleCloseSigning();
          let variant = "success";
          enqueueSnackbar("Funds Claimed Successfully", { variant })


        } catch(error) {
          console.log("claim make deploy error",error);
          handleCloseSigning();
          let variant = "Error";
          enqueueSnackbar("Unable to Claim Funds", { variant })
        }
      } catch {
        handleCloseSigning();
        let variant = "Error";
        enqueueSnackbar("Something Went Wrong", { variant });
      }
    } else {
      handleCloseSigning();
      let variant = "error";
      enqueueSnackbar("Connect to Wallet Please", { variant });
    }
  }

  return (
    <div>
      <Modal
        open={show}
        onClose={hide}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" style={{color:"black",fontWeight:"bold"}} component="h2">
            Confirm claiming {balance} tokens
          </Typography>
          <Button  onClick={() => { claimMakeDeploy() }} variant="contained" style={{backgroundColor:"#5300E8", fontSize:20}} fullWidth>confirm</Button>
        </Box>
      </Modal>
      <SigningModal show={openSigning} />
    </div>
  );
}
