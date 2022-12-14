import { CasperServiceByJsonRPC, CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { convertToStr } from "../ConvertToString/ConvertToString";
import { VOTING_ESCROW_CONTRACT_HASH } from "../blockchain/AccountHashes/Addresses";
import { makeDeploy } from "../blockchain/MakeDeploy/MakeDeploy";
import { signdeploywithcaspersigner } from "../blockchain/SignDeploy/SignDeploy";
import { putdeploy } from "../blockchain/PutDeploy/PutDeploy";
import { SUPPORTED_NETWORKS, CHAINS } from "../Headers/Header";
import { getDeploy } from "../blockchain/GetDeploy/GetDeploy";
import { NODE_ADDRESS } from "../blockchain/NodeAddress/NodeAddress";


export async function depositMakeDeploy(depositAmount, setOpenSigning, enqueueSnackbar) {
    // CREATING REQUIRED VARIABLES
    let torus;
    const allowance = 0;

    let selectedWallet = localStorage.getItem("selectedWallet")
    let activePublicKey = localStorage.getItem("Address")


    if (depositAmount == 0) {
      let variant = "Error";
    //   providerRef.current.enqueueSnackbar("Locked amount cannot be Zero", { variant })
      enqueueSnackbar("Deposited amount cannot be zero", { variant })
      return
    }
    // handleShowSigning();
    setOpenSigning(true);
    // const publicKeyHex = activePublicKey;
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
          deposit: CLValueBuilder.u256(convertToStr(depositAmount)),
        });
        let contractHashAsByteArray = Uint8Array.from(
          Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
        );
        let entryPoint = "deposit";
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
          setOpenSigning(false);
          let variant = "success";
          enqueueSnackbar("Deposit Successfully", { variant })
        //   providerRef.current.enqueueSnackbar("Funds Locked Successfully", { variant })


        } catch {
        //   handleCloseSigning();
          setOpenSigning(false);
          let variant = "Error";
          enqueueSnackbar("Unable to Deposit", { variant })
        //   providerRef.current.enqueueSnackbar("Unable to Lock Funds", { variant })
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