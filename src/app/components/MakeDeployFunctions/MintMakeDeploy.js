import { CLPublicKey, RuntimeArgs } from "casper-js-sdk";
import { VOTING_ESCROW_CONTRACT_HASH } from "../blockchain/Hashes/ContractHashes";
import { makeDeploy } from "../blockchain/MakeDeploy/MakeDeploy";
import { putdeploy } from "../blockchain/PutDeploy/PutDeploy";
import { signdeploywithcaspersigner } from "../blockchain/SignDeploy/SignDeploy";


export async function mintMakeDeploy(gauge, setOpenSigning, enqueueSnackbar) {

    if (gauge == undefined) {
      let variant = "Error";
      enqueueSnackbar("Undefined gauge", { variant })
      return
    }
    setOpenSigning(true);
    const publicKeyHex = localStorage.getItem("Address");
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const paymentAmount = 5000000000;
      try {
        const runtimeArgs = RuntimeArgs.fromMap({
          gauge: gauge
        });
        let contractHashAsByteArray = Uint8Array.from(
          Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
        );
        let entryPoint = "mint";
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
          console.log("result", result);
          setOpenSigning(false);
          let variant = "success";
          enqueueSnackbar("Minted Successfully", { variant })
        } catch {
          setOpenSigning(false);
          let variant = "Error";
          enqueueSnackbar("Unable to Mint", { variant })
        }
      } catch {
        setOpenSigning(false);
        let variant = "Error";
        enqueueSnackbar("Something Went Wrong", { variant });
      }
    } else {
      setOpenSigning(false);
      let variant = "error";
      enqueueSnackbar("Connect to Wallet Please", { variant });
    }
  }