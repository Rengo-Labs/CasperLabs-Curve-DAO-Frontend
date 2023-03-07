import { CLOption, CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { Some } from "ts-results";
import { makeDeploy } from "../../components/blockchain/MakeDeploy/MakeDeploy";
import { putdeploy } from "../../components/blockchain/PutDeploy/PutDeploy";
import { signdeploywithcaspersigner } from "../../components/blockchain/SignDeploy/SignDeploy";
import { VOTING_ESCROW_CONTRACT_HASH } from "../blockchain/Hashes/ContractHashes";
import { checkpoint } from "../checkpoint/Checkpoint";
import { convertToStr } from "../ConvertToString/ConvertToString";


export async function withdrawGaugeMakeDeploy(amount, setOpenSigning, enqueueSnackbar, gauge, gaugeBalance, fetchData) {
  // CREATING REQUIRED VARIABLES
  let torus;
  const allowance = 0;

  let selectedWallet = localStorage.getItem("selectedWallet")
  let activePublicKey = localStorage.getItem("Address")
  console.log("amount", amount);
  console.log("gaugeBalance", gaugeBalance);
  if (amount > parseFloat(gaugeBalance)) {
    let variant = "Error";
    enqueueSnackbar("Withdraw amount must be lower than orignal balance ", { variant })
    return
  }
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
    const paymentAmount = 100000000000;
    try {
      const runtimeArgs = RuntimeArgs.fromMap({
        value: CLValueBuilder.u256(convertToStr(amount)),
        claim_rewards: new CLOption(Some(CLValueBuilder.bool(false)))
      });
      let contractHashAsByteArray = Uint8Array.from(
        Buffer.from(gauge, "hex")
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
        fetchData()
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