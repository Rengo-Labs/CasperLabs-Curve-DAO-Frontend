import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { CLOption, CLPublicKey, RuntimeArgs } from "casper-js-sdk";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { Some } from "ts-results";
import { VESTING_ESCROW_CONTRACT_HASH } from "../blockchain/Hashes/ContractHashes";
import { makeDeploy } from "../blockchain/MakeDeploy/MakeDeploy";
import { putdeploy } from "../blockchain/PutDeploy/PutDeploy";
import { signdeploywithcaspersigner } from "../blockchain/SignDeploy/SignDeploy";
import { createRecipientAddress } from "../JsClients/VESTINGESCROW/src/utils";
import SigningModal from "./SigningModal";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 150,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 4
};

export default function ClaimConfirmModal({ show, hide, setOpen, balance }) {
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
    const publicKeyHex = localStorage.getItem("Address");// get the address of user logged in
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
        const runtimeArgs = RuntimeArgs.fromMap({
          owner: new CLOption(Some(key)),
        });
        let contractHashAsByteArray = Uint8Array.from(
          Buffer.from(VESTING_ESCROW_CONTRACT_HASH, "hex")
        );
        console.log("contract hash byte array: ", contractHashAsByteArray);
        let entryPoint = "claim";
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


        } catch (error) {
          console.log("claim make deploy error", error);
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
          <Typography id="modal-modal-title" variant="h5" style={{ color: "black", fontWeight: "bold" }} component="h2">
            Confirm claiming {balance} tokens
          </Typography>
          <Button onClick={() => { claimMakeDeploy() }} variant="contained" style={{ backgroundColor: "#1976d2", fontSize: 20 }} fullWidth>confirm</Button>
        </Box>
      </Modal>
      <SigningModal show={openSigning} />
    </div>
  );
}
