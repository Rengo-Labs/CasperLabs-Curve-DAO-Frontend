import { CLPublicKey, RuntimeArgs } from "casper-js-sdk";
import { makeDeploy } from "../../components/blockchain/MakeDeploy/MakeDeploy";
import { putdeploy } from "../../components/blockchain/PutDeploy/PutDeploy";
import { signdeploywithcaspersigner } from "../../components/blockchain/SignDeploy/SignDeploy";
import { VOTING_ESCROW_CONTRACT_HASH } from "../blockchain/Hashes/ContractHashes";
import { checkpoint } from "../checkpoint/Checkpoint";


export async function withdrawMakeDeploy(setOpenSigning, enqueueSnackbar) {
  // CREATING REQUIRED VARIABLES
  let torus;
  const allowance = 0;

  let selectedWallet = localStorage.getItem("selectedWallet")
  let activePublicKey = localStorage.getItem("Address")


  // handleShowSigning();
  setOpenSigning(true);
  // const publicKeyHex = activePublicKey;
  const publicKeyHex = localStorage.getItem("Address");
  console.log("Withdraw function public keys: ", publicKeyHex);
  if (
    publicKeyHex !== null &&
    publicKeyHex !== "null" &&
    publicKeyHex !== undefined
  ) {
    const publicKey = CLPublicKey.fromHex(publicKeyHex);
    const paymentAmount = 50000000000;
    try {
      const runtimeArgs = RuntimeArgs.fromMap({
      });
      let contractHashAsByteArray = Uint8Array.from(
        Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
      );
      let entryPoint = "withdraw";
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
        let signedDeploy = await signdeploywithcaspersigner(
          deploy,
          publicKeyHex
        );
        let result = await putdeploy(signedDeploy, enqueueSnackbar);
        // let result = await putdeploy(signedDeploy, providerRef.current.enqueueSnackbar);
        console.log("result", result);

        //   handleCloseSigning();
        checkpoint(true, setOpenSigning, enqueueSnackbar);
        setOpenSigning(false);
        let variant = "success";
        enqueueSnackbar("Funds Withdrawed Successfully", { variant })
        //   providerRef.current.enqueueSnackbar("Funds Withdrawed Successfully", { variant })
      } catch {
        //   handleCloseSigning();
        setOpenSigning(false);
        let variant = "Error";
        enqueueSnackbar("Unable to Withdraw Funds", { variant })
        //   providerRef.current.enqueueSnackbar("Unable to Withdraw Funds", { variant })
      }
    } catch {
      // handleCloseSigning();
      setOpenSigning(false);
      let variant = "Error";
      enqueueSnackbar("Something Went Wrong", { variant });
      // providerRef.current.enqueueSnackbar("Something Went Wrong", { variant });
    }
  } else {
    //   handleCloseSigning();
    setOpenSigning(false);
    let variant = "error";
    enqueueSnackbar("Connect to Wallet Please", { variant });
    //   providerRef.current.enqueueSnackbar("Connect to Wallet Please", { variant });
  }
}