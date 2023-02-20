import { CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { LIQUIDITY_GAUGE_V3_CONTRACT_HASH } from "../blockchain/Hashes/ContractHashes";
import { makeUserCheckpointDeployWasm } from "../blockchain/MakeDeploy/MakeDeployWasm";
import { putdeploy } from "../blockchain/PutDeploy/PutDeploy";
import { signdeploywithcaspersigner } from "../blockchain/SignDeploy/SignDeploy";

export async function UserCheckpointMakeDeploy(activePublicKey, setOpenSigning, enqueueSnackbar) {
    // handleShowSigning();
    setOpenSigning(true);
    const publicKeyHex = activePublicKey;
    if (
        publicKeyHex !== null &&
        publicKeyHex !== "null" &&
        publicKeyHex !== undefined
    ) {
        const publicKey = CLPublicKey.fromHex(publicKeyHex);
        // const caller = ROUTER_CONTRACT_HASH;
        // let token;
        // let cspr_Amount;
        // let token_Amount;
        // if (tokenA.symbol === "WCSPR") {
        //     token = tokenB.packageHash;
        //     cspr_Amount = tokenAAmountPercent.toFixed(9);
        //     token_Amount = tokenBAmountPercent.toFixed(9);
        // } else {
        //     token = tokenA.packageHash;
        //     cspr_Amount = tokenBAmountPercent.toFixed(9);
        //     token_Amount = tokenAAmountPercent.toFixed(9);
        // }
        // const deadline = 1739598100811;
        const paymentAmount = 8000000000;

        // console.log("token", token);
        // const _token = new CLByteArray(
        //     Uint8Array.from(Buffer.from(token.slice(5), "hex"))
        // );

        const runtimeArgs = RuntimeArgs.fromMap({
            // amount: CLValueBuilder.u512(convertToStr(Number(cspr_Amount - (cspr_Amount * slippage) / 100).toFixed(9))),
            entrypoint: CLValueBuilder.string("user_checkpoint"),
            addr: activePublicKey,
            package_hash: LIQUIDITY_GAUGE_V3_CONTRACT_HASH
           
        });
        console.log("runtimeArgs", runtimeArgs);
        // let contractHashAsByteArray = Uint8Array.from(Buffer.from(caller, "hex"));
        // let entryPoint = "remove_liquidity_cspr_js_client";

        // Set contract installation deploy (unsigned).
        // let deploy = await makeDeploy(
        //   publicKey,
        //   contractHashAsByteArray,
        //   entryPoint,
        //   runtimeArgs,
        //   paymentAmount
        // );
        let deploy = await makeUserCheckpointDeployWasm(
            publicKey,
            runtimeArgs,
            paymentAmount
        );
        console.log("make deploy: ", deploy);
        try {
            // if (selectedWallet === "Casper") {
            let signedDeploy = await signdeploywithcaspersigner(
                deploy,
                publicKeyHex
            );
            let result = await putdeploy(signedDeploy, enqueueSnackbar);
            console.log("result", result);
            // } else {
            //     // let Torus = new Torus();
            //     torus = new Torus();
            //     console.log("torus", torus);
            //     await torus.init({
            //         buildEnv: "testing",
            //         showTorusButton: true,
            //         network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
            //     });
            //     console.log("Torus123", torus);
            //     console.log("torus", torus.provider);
            //     const casperService = new CasperServiceByJsonRPC(torus?.provider);
            //     const deployRes = await casperService.deploy(deploy);
            //     console.log("deployRes", deployRes.deploy_hash);
            //     console.log(
            //         `... Contract installation deployHash: ${deployRes.deploy_hash}`
            //     );
            //     let result = await getDeploy(
            //         NODE_ADDRESS,
            //         deployRes.deploy_hash,
            //         enqueueSnackbar
            //     );
            //     console.log(
            //         `... Contract installed successfully.`,
            //         JSON.parse(JSON.stringify(result))
            //     );
            //     console.log("result", result);
            // }
            let variant = "success";
            // handleCloseSigning();
            setOpenSigning(false)
            enqueueSnackbar("Liquidity Removed Successfully", { variant });
            // setIsLoading(false);
            // window.location.reload(false);
        } catch {
            // handleCloseSigning();
            setOpenSigning(false);
            let variant = "Error";
            enqueueSnackbar("Unable to Remove Liquidity", { variant });
            // setIsLoading(false);
        }
    } else {
        let variant = "error";
        // handleCloseSigning();
        setOpenSigning(false);
        enqueueSnackbar("Connect to Wallet Please", { variant });
    }
}