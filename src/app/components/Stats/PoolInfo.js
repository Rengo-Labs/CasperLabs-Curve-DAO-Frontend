import { Button, TextField } from '@material-ui/core';
import { Checkbox, Divider, FormControlLabel, FormGroup, Slider } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { balanceOf, totalSupply } from '../JsClients/VOTINGESCROW/QueryHelper/functions';
import { ERC20_CRV_CONTRACT_HASH, LIQUIDITY_GAUGE_V3_CONTRACT_HASH, MINTER_CONTRACT_HASH, VOTING_ESCROW_CONTRACT_HASH } from '../blockchain/AccountHashes/Addresses';
import { useSnackbar } from 'notistack';
import BigNumber from 'bignumber.js';
import { CLPublicKey } from 'casper-js-sdk';
import { periodTimestamp, workingBalances, workingSupply } from '../JsClients/LIQUIDITYGAUGEV3/liquidityGaugeV3FunctionsForBackend/functions';
import { mint } from '../JsClients/MINTER/minterFunctionsForBackend/functions';
import { UserCheckpointMakeDeploy } from '../MakeDeployFunctions/UserCheckpointMakeDeploy';
import * as gaugeStore from "../stores/GaugeStore";
import * as veStore from "../stores/VeStore";
import SigningModal from '../Modals/SigningModal';
import { withdrawMakeDeploy } from '../MakeDeployFunctions/WithdrawMakeDeploy';
import { mintMakeDeploy } from '../MakeDeployFunctions/MintMakeDeploy';
import { depositMakeDeploy } from '../MakeDeployFunctions/DepositMakeDeploy';
import { claimRewardsMakeDeploy } from '../MakeDeployFunctions/ClaimRewardsMakeDeploy';


function ValueLabelComponent(props) {
    const { children, value } = props;
  
    return (
      <Tooltip enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  }
  
  ValueLabelComponent.propTypes = {
    children: PropTypes.element.isRequired,
    value: PropTypes.number.isRequired,
  };


const PrettoSlider = styled(Slider)({
    // color: '#52af77',
    color: 'rgb(83, 0, 232)',
    height: 8,
    '& .MuiSlider-track': {
      border: 'none',
    },
    '& .MuiSlider-thumb': {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit',
      },
      '&:before': {
        display: 'none',
      },
    },
    '& .MuiSlider-valueLabel': {
      lineHeight: 1.2,
      fontSize: 12,
      background: 'unset',
      padding: 0,
      width: 32,
      height: 32,
      borderRadius: '50% 50% 50% 0',
    //   backgroundColor: '#52af77',
      backgroundColor: 'rgb(83, 0, 232)',
      transformOrigin: 'bottom left',
      transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
      '&:before': { display: 'none' },
      '&.MuiSlider-valueLabelOpen': {
        transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
      },
      '& > *': {
        transform: 'rotate(45deg)',
      },
    },
  });


const PoolInfo = (props) => {
    const { enqueueSnackbar } = useSnackbar();

    // STATES
    const [activePublicKey, setActivePublicKey] = useState(localStorage.getItem("Address"));
    // const [canApplyBoost, setCanApplyBoost] = useState(false);
    const [claimableTokens, setClaimableTokens] = useState(10);
    // const [gaugeRelativeWeight, setGaugeRelativeWeight] = useState(0);
    // const [mintedFormat, setMintedFormat] = useState() //this will be replaced by function
    const [claimedRewards, setClaimedRewards] = useState(0);
    // const [gauge, setGauge] = useState({});
    // const [claimedRewardsFormat, setClaimedRewardsFormat] = useState(); //this will be replace by function
    const [boost, setBoost] = useState(0);
    const [currentBoost, setCurrentBoost] = useState(0);
    // const [synthsUnavailable, setSynthsUnavailable] = useState(0);
    const [stakedBalance, setStakedBalance] = useState(0);
    // const [poolBalanceFormat, setPoolBalanceFormat] = useState(); //this will be replace by function
    const [depositAmount, setDepositAmount] = useState(0);
    const [depositSlider, setDepositSlider] = useState(0);
    // const [gaugeBalance, setGaugeBalance] = useState(10);
    // const [gaugeBalanceFormat, setGaugeBalanceFormat] = useState(); //this will be replace by function
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [withdrawSlider, setWithdrawSlider] = useState(0);
    const [claimableTokensFormat, setClaimableTokensFormat] = useState(10); //this will be replace by function
    const [claimableReward, setClaimableReward] = useState(0);
    const [claimableRewardFormat, setClaimableRewardFormat] = useState(); //this will be replace by function
    const [currentBoostCheck, setCurrentBoostCheck] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [minted, setMinted] = useState(0);
    const [openSigning, setOpenSigning] = useState(false);
    const [infApproval, setInfApproval] = useState(false);
    
    //HANDLERS
    // const handleChangeCanApplyBoost = () => {
    //     setCanApplyBoost(gaugeBalance > 0 && (Date.now() / 1000) > 1597271916 && currentBoost < currentBoostCheck)
    // }

    //USE EFFECT
    useEffect(() => {
        console.log("Entry point");
        // this.depositAmount = this.poolBalanceFormat
        setDepositAmount(poolBalanceFormat);
        // this.withdrawAmount = this.gaugeBalanceFormat
        setWithdrawAmount(gaugeBalanceFormat);

        // this.gaugeContract = new contract.web3.eth.Contract(daoabis.liquiditygauge_abi, this.gauge.gauge)

        // this.swap_token = new contract.web3.eth.Contract(ERC20_abi, this.gauge.swap_token)

        // this.loaded = true
        setLoaded(true);

        // this.claimableTokens = +this.gauge.claimable_tokens
        setClaimableTokens(gauge.claimable_tokens);
        
        gaugeStore.state.totalClaimableCRV += +claimableTokens

        const getData = async () => {
            if(['susdv2', 'sbtc'].includes(gauge.name)) {
                // let curveRewards = new web3.eth.Contract(allabis[this.gauge.name].sCurveRewards_abi, allabis[this.gauge.name].sCurveRewards_address)
                // this.stakedBalance = await curveRewards.methods.balanceOf(contract.default_account).call()
                balanceOf(gauge.address, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("Hex"));

    
                // this.claimableReward = await this.gaugeContract.methods.claimable_reward(contract.default_account).call()
                setClaimableReward(await claimableReward(LIQUIDITY_GAUGE_V3_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("Hex")));
                // this.claimedRewards = await this.gaugeContract.methods.claimed_rewards_for(contract.default_account).call()
                setClaimedRewards(await claimedRewards(LIQUIDITY_GAUGE_V3_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("Hex")));
    
                // this.claimableReward -= this.claimedRewards
                setClaimableReward(claimableReward-claimedRewards);
            }
        }
        getData();
        
        //this.minted = await gaugeStore.state.minter.methods.minted(contract.default_account, this.gauge.gauge).call()
        // this.minted = this.gauge.minted
        setMinted(gauge.minted);

        gaugeStore.state.totalMintedCRV += +gauge.minted; //writing this as gauge minted because we don't get instant value by setFunction unless function is completed

        // let allowance = BN(await this.swap_token.methods.allowance(contract.default_account, this.gauge.gauge).call())
        let allowance;

        const getAllowance = async () => {
            allowance = await allowance(ERC20_CRV_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash)).toString("Hex");
        }
        getAllowance();


        // if(allowance.lte(contract.max_allowance.div(BN(2))))
        //     // this.inf_approval = false
        //     setInfApproval(false); //ask about this

        if(+gauge.gaugeBalance > 0) {
            // this.currentBoost = Math.max(1, gaugeStore.state.boosts[this.gauge.name])
            setCurrentBoost(Math.max(1, gaugeStore.state.boosts[gauge.name]));
            checkLimit()
        }
    }, []);

    //COMPUTED WORK
    // gauge() {
    //     return gaugeStore.state.mypools[this.i]
    // },
    const gauge = useMemo(() => {
        return gaugeStore.state.mypools[props.i];
    }, [gaugeStore.state.mypools[props.i]]);
    // gaugeBalance() {
    //     return +this.gauge.gaugeBalance
    // },
    const gaugeBalance = useMemo(() => {
        return +(gauge.gaugeBalance);
    }, [gauge.gaugeBalance])
    // poolBalanceFormat() {
    //     return this.toFixed(this.gauge.balance / 1e18)
    // },
    const poolBalanceFormat = useMemo(() => {
        return toFixed(gauge.balance / 1e9);
    }, [gauge.balance]);
    // gaugeBalanceFormat() {
    //     return (this.gauge.gaugeBalance / 1e18).toFixed(2)
    // },
    const gaugeBalanceFormat = useMemo(() => {
        return (gauge.gaugeBalance / 1e18).toFixed(2)
    }, [gauge.gaugeBalance]);
    // apy() {
    //     return gaugeStore.state.APYs[this.gauge.name]
    // },
    const apy = useMemo(() => {
        return gaugeStore.state.APYs[gauge.name];
    }, [gaugeStore.state.APYs[gauge.name]]);
    // gaugeRelativeWeight() {
    //     return this.gauge.gauge_relative_weight * 100
    // },
    const gaugeRelativeWeight = useMemo(() => {
        return (gauge.gauge_relative_weight * 100);
    }, [gauge.gauge_relative_weight]);
    // claimableTokensFormat() {
    //     return (this.claimableTokens / 1e18).toFixed(2)
    // },
    const claimableTokenFormat = useMemo(() => {
        return (claimableTokens / 1e9).toFixed(2);
    }, [claimableTokens]);
    // mintedFormat() {
    //     return (this.minted / 1e18).toFixed(2)
    // },
    const mintedFormat = useMemo(() => {
        return (minted / 1e9).toFixed(2);
    }, [minted]);
    // triggerUpdateLimit() {
    //     return this.depositAmount, veStore.state.deposit, veStore.state.increaseLock, Date.now()
    // },
    const triggerUpdateLimit = useMemo(() => {
        updateLimit();
    }, [depositAmount, veStore.state.deposit, veStore.state.increaseLock, Date.now()]);
    // claimableRewardFormat() {
    //     return this.toFixed(this.claimableReward / 1e18)
    // },
    const claimableRewardsFormat = useMemo(() => {
        return toFixed(claimableReward / 1e9);
    }, [claimableReward]);
    // claimedRewardsFormat() {
    //     return this.toFixed(this.claimedRewards / 1e18)
    // },
    const claimedRewardsFormat = useMemo(() => {
        return toFixed(claimedRewards / 1e9);
    }, [claimedRewards]);
    // gasPrice() {
    //     return gasPriceStore.state.gasPrice
    // },
    // gasPriceWei() {
    //     return gasPriceStore.state.gasPriceWei
    // },
    // publicPath() {
    //     return process.env.BASE_URL
    // },
    // canApplyBoost() {
    //     console.log(this.gauge.name, this.gauge.currentWorkingBalance, this.gauge.previousWorkingBalance, this.gauge.currentWorkingBalance > +this.gauge.previousWorkingBalance, "WORKING BALANCES")
    //     return this.gauge.gaugeBalance > 0 && (Date.now() / 1000) > 1597271916 && this.currentBoost < this.currentBoostCheck
    // },
    const canApplyBoost =  useMemo(() => {
        return gauge.gaugeBalance > 0 && (Date.now() / 1000) > 1597271916 && currentBoost < currentBoostCheck    
    }, [gauge.gaugeBalance, currentBoost, currentBoostCheck]);
    // CRVAPY() {
    //     let apy = this.apy
    //     if(this.currentBoost > 0)
    //         apy *= this.currentBoost
    //     return apy
    // },
    const CRVAPY = useMemo(() => {
        let apy = apy;
        if(currentBoost > 0){
            apy *= currentBoost
        }
        return apy
    }, [apy, currentBoost]);
    // synthsUnavailable() {
    //     return gaugeStore.state.synthsUnavailable
    // }
    const synthsUnavailable = useMemo(() => {
        return gaugeStore.state.synthsUnavailable;
    }, [gaugeStore.state.synthsUnavailable]);


    //WATCHERS
    const watchDepositAmount = async (val) => {
        let depositVal = (val * 100 / (gauge.balance / 1e9)) || 0
        setDepositSlider((Math.min(depositVal, 100)).toFixed(0));
    }

    const watchwithdrawAmount = async (val) => {
        let withdrawVal = (val * 100 / (gauge.gaugeBalance / 1e9)) || 0

        setWithdrawSlider((Math.min(withdrawVal, 100)).toFixed(0));
    }

    const watchTriggerUpdate = async () => {
        updateLimit();
    }

    //FUNCTIONS
    const deposit = async () => { //confirm entry point
        let deposit = BigNumber(depositAmount).time(1e9);
        let balance = balanceOf(ERC20_CRV_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"));
        if (deposit.gt(BigNumber(this.gauge.balance))) {
            deposit = balance;
        }

        // await common.approveAmount(this.swap_token, deposit, contract.default_account, this.gauge.gauge, this.inf_approval) //ask about this (not any function found against this)

        // var { dismiss } = notifyNotification(`Please confirm depositing into ${this.gauge.name} gauge`)
        
        let variant = "Success";
        enqueueSnackbar(`Please confirm deposition into ${gauge.name} gauge`, { variant } );

        // await this.gaugeContract.methods.deposit(deposit.toFixed(0,1)).send({
        //     from: contract.default_account,
        //     gasPrice: this.gasPriceWei,
        //     gas: gas,
        // })
        // .once('transactionHash', hash => {
        //     dismiss()
        //     notifyHandler(hash)
        // }) // gauge contract is liquidity contract (confirm about deposit function)

        //BLOCKCHAIN CALL
        depositMakeDeploy(deposit.toFixed(0,1), setOpenSigning, enqueueSnackbar);

        updateBalances()

    }

    const withdraw = async () => {
        let withdraw = BigNumber(withdrawAmount).times(1e18)
        // let balance = BN(await this.gaugeContract.methods.balanceOf(contract.default_account).call())
        let balance = BigNumber(await balanceOf(LIQUIDITY_GAUGE_V3_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")))
        if(withdraw.gt(balance))
            withdraw = balance
        // let withdrawMethod = this.gaugeContract.methods.withdraw(withdraw.toFixed(0,1)) //ask about withdraw function
        // if(['susdv2', 'sbtc'].includes(this.gauge.name) && this.synthsUnavailable) {
        //     let gaugeContract = new web3.eth.Contract(daoabis.liquiditygaugerewards_abi, this.gauge.gauge)
        //     withdrawMethod = gaugeContract.methods.withdraw(withdraw.toFixed(0,1), !this.synthsUnavailable)
        // }
        // let gas = 1000000
        // try {
        //     gas = await withdrawMethod.estimateGas()
        // }
        // catch(err) {
        //     console.error(err)
        // }

        // var { dismiss } = notifyNotification(`Please confirm withdrawing from ${this.gauge.name} gauge`)
        let variant = "Success";
        enqueueSnackbar(`Please confirm withdrawing from ${gauge.name} gauge`, { variant });

        // await withdrawMethod.send({
        //     from: contract.default_account,
        //     gasPrice: this.gasPriceWei,
        //     gas: gas * 1.5 | 0,
        // })
        // .once('transactionHash', hash => {
        //     dismiss()
        //     notifyHandler(hash)
        // }) //this whole call is based on withdraw functions

        //BLOCKCHAIN CALL
        await withdrawMakeDeploy(setOpenSigning, enqueueSnackbar);

        updateBalances()
    }

    const updateBalances = async () => {

        // let calls = [
        //     //balanceOf
        //     [this.gauge.swap_token, '0x70a08231000000000000000000000000' + contract.default_account.slice(2)], //ask about this
        //     [this.gaugeContract._address, this.gaugeContract.methods.balanceOf(contract.default_account).encodeABI()],
        // ]


        // let aggcalls = await contract.multicall.methods.aggregate(calls).call()

        // let decoded = aggcalls[1].map(hex => web3.eth.abi.decodeParameter('uint256', hex))

        // gaugeStore.state.mypools[this.i].balance = decoded[0]
        gaugeStore.state.mypools[props.i].gaugeBalance = balanceOf(LIQUIDITY_GAUGE_V3_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"));
    }

    const toFixed = (num) => {
        if(num == '' || num == undefined || +num == 0) return '0.00'
        if(!BigNumber.isBigNumber(num)) num = +num
        if(['ren', 'sbtc'].includes(gauge.name)) return num.toFixed(8)
        return num.toFixed(2)
    }

    const setMaxPool = () => {
        depositAmount = gauge.balance / 1e9
    }

    const setMaxGauge = () => {
        withdrawAmount = gauge.gaugeBalance / 1e9
    }

    const onDepositSlider = (event) => {
        let val = event.target.value
        setDepositSlider(val)
        setDepositAmount(this.toFixed((this.gauge.balance / 1e9) * val/100));
    }

    const onWithdrawSlider = (event) => {
        let val = event.target.value
        setWithdrawSlider(val);
        setWithdrawAmount(this.toFixed((this.gauge.gaugeBalance / 1e9) * val/100));
    }

    const update_liquidity_limit = async (new_l = null, new_voting_balance = null) => {
        let l = +gauge.gaugeBalance
        if(new_l !== null)
            l = new_l * 1e9
        // let example_gauge = new contract.web3.eth.Contract(daoabis.liquiditygauge_abi, this.gauge.gauge)

        // let calls = [
        //     [gaugeStore.state.votingEscrow._address, gaugeStore.state.votingEscrow.methods.balanceOf(contract.default_account).encodeABI()],
        //     [gaugeStore.state.votingEscrow._address, gaugeStore.state.votingEscrow.methods.totalSupply().encodeABI()],
        //     [this.gauge.gauge, example_gauge.methods.period_timestamp(0).encodeABI()],
        //     [this.gauge.gauge, example_gauge.methods.working_balances(contract.default_account).encodeABI()],
        //     [this.gauge.gauge, example_gauge.methods.working_supply().encodeABI()],
        //     [this.gauge.gauge, example_gauge.methods.totalSupply().encodeABI()],
        // ]
        // let aggcalls = await contract.multicall.methods.aggregate(calls).call()
        // let decoded = aggcalls[1].map(hex => web3.eth.abi.decodeParameter('uint256', hex))
        // let voting_balance = +decoded[0]
        // let voting_total = +decoded[1] - +voting_balance
        // let period_timestamp = +decoded[2]
        // let working_balances = +decoded[3]
        // let working_supply = +decoded[4]
        // let L = +decoded[5] + l

        // let aggcalls = await contract.multicall.methods.aggregate(calls).call()
        // let decoded = aggcalls[1].map(hex => web3.eth.abi.decodeParameter('uint256', hex))
        let voting_balance = +(await balanceOf(VOTING_ESCROW_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString('hex')));
        let voting_total = +(await totalSupply(VOTING_ESCROW_CONTRACT_HASH)) - +voting_balance;
        let period_timestamp = +(await periodTimestamp(LIQUIDITY_GAUGE_V3_CONTRACT_HASH, 0));
        let working_balances = +(await workingBalances(LIQUIDITY_GAUGE_V3_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")));
        let working_supply = +(await workingSupply(LIQUIDITY_GAUGE_V3_CONTRACT_HASH));  
        let L = +(await totalSupply(LIQUIDITY_GAUGE_V3_CONTRACT_HASH)) + l


        if(new_voting_balance !== null) {
            voting_balance = new_voting_balance * 1e18
        }

        voting_total += voting_balance


        let TOKENLESS_PRODUCTION = 40

        let BOOST_WARMUP = this.BOOST_WARMUP
    
        let lim = l * TOKENLESS_PRODUCTION / 100
        if(voting_total > 0 && ((Date.now() / 1000) > period_timestamp + BOOST_WARMUP))
            lim += L * voting_balance / voting_total * (100 - TOKENLESS_PRODUCTION) / 100

        lim = Math.min(l, lim)
        
        let old_bal = working_balances
        let noboost_lim = TOKENLESS_PRODUCTION * l / 100
        let noboost_supply = working_supply + noboost_lim - old_bal
        let _working_supply = working_supply + lim - old_bal

        return [_working_supply, (lim / _working_supply) / (noboost_lim / noboost_supply)]

    }

    const claim = async () => {
        // let gas = await gaugeStore.state.minter.methods.mint(this.gauge.gauge).estimateGas()
        // if(['susdv2', 'sbtc'].includes(this.gauge.name))
        //     gas = 1000000

        // var { dismiss } = notifyNotification(`Please confirm claiming CRV from ${this.gauge.name} gauge`)
        let variant = "Success"
        enqueueSnackbar(`Please confirm claiming CRV from ${gauge.name} gauge`, { variant});

        // await gaugeStore.state.minter.methods.mint(this.gauge.gauge).send({
        //     from: contract.default_account,
        //     gasPrice: this.gasPriceWei,
        //     gas: gas * 1.5 | 0,
        // })
        // .once('transactionHash', hash => {
        //     dismiss()
        //     notifyHandler(hash)
        // })

        //BLOCKCHAIN CALL
        mintMakeDeploy(gauge.gauge, setOpenSigning, enqueueSnackbar);
    }

    const claimRewards = async () => { //confirm entry points
        // let gas = await this.gaugeContract.methods.claim_rewards(contract.default_account).estimateGas()
        // if(['susdv2', 'sbtc'].includes(this.gauge.name))
        // 	gas = 1000000

        // var { dismiss } = notifyNotification(`Please confirm claiming ${this.gauge.name == 'susdv2' ? 'SNX' : 'BPT'}`)
        let variant = "Success";
        enqueueSnackbar(`Please confirm claiming ${gauge.name == 'susdv2' ? 'SNX' : 'BPT'}`, { variant });

        // await this.gaugeContract.methods.claim_rewards(contract.default_account).send({
        //     from: contract.default_account,
        //     gasPrice: this.gasPriceWei,
        //     gas: 500000,
        // })
        // .once('transactionHash', hash => {
        //     dismiss()
        //     notifyHandler(hash)
        // })

        //BLOCKCHAIN CALL
        await claimRewardsMakeDeploy(setOpenSigning, enqueueSnackbar);
    }

    const applyBoost = async () => {
        // let gas = 600000
        // try {
        //     gas = await this.gaugeContract.methods.user_checkpoint(contract.default_account).estimateGas()
        // }
        // catch(err) {
        //     console.error(err)
        // }

        // var { dismiss } = notifyNotification(`Please confirm applying boost`)
        let variant = "Success";
        enqueueSnackbar(`Please confirm applying boost`, { variant });

        // await this.gaugeContract.methods.user_checkpoint(contract.default_account).send({
        //     from: contract.default_account,
        //     gasPrice: this.gasPriceWei,
        //     gas: gas,
        // })
        // .once('transactionHash', hash => {
        //     dismiss()
        //     notifyHandler(hash)
        // })
        UserCheckpointMakeDeploy(activePublicKey, setOpenSigning, enqueueSnackbar);
    }

    const updateLimit = async () => { //ask about this function
        if(!loaded) return;
        // this.promise.cancel()
        // this.promise = helpers.makeCancelable(this.update_liquidity_limit(this.depositAmount, veStore.newVotingPower()))
        // let newLimit = await this.promise

        // this.boost = newLimit[1]
        //search about this.promise 
    }

    const checkLimit = async () => {
        let currentLimit = await update_liquidity_limit()

        // this.currentBoostCheck = currentLimit[1]
        setCurrentBoostCheck(currentLimit[1]);
        if(currentBoost < currentBoostCheck && claimableTokens == 0)
            gaugeStore.state.gaugesNeedApply.push(gauge.gauge)
    }

    return (
        <>
            <div className="row no-gutters">
                <div className="col-12 text-center text-md-left">
                    <div>
                        {canApplyBoost && claimableTokens == 0 ? (
                            <div>
                                <Button
                                    onClick={() => {
                                        applyBoost();
                                    }}
                                >
                                    Apply Boost
                                </Button>
                            </div>
                        ) : canApplyBoost && claimableTokens > 0 ? (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: '5px'
                            }}>
                                <span style={{color: 'green'}}>
                                    You can apply boost by claiming CRV
                                </span>
                            </div>
                        ) : null }
                        {/* GAUGE RELATIVE WEIGHT */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '5px'
                        }}>
                            <span className="font-weight-bold">
                                Gauge relative weight: &nbsp;
                            </span>
                            {gaugeRelativeWeight}%
                        </div>
                        {/* MINTED CRV */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '5px'
                        }}>
                            <span className="font-weight-bold">
                                Minted CRV from this gauge: &nbsp;
                            </span>
                            { mintedFormat } 
                            {/* mintedFormat here will be replaced by function returning value */}
                        </div>
                        {['susdv2', 'sbtc'].includes(gauge.name) && claimedRewards > 0 ? (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: '5px'
                            }}>
                                Claimed
                                {gauge.name == 'susdv2' ? (
                                    <span>SNX: {claimedRewardsFormat}</span>
                                ): gauge.name == 'sbtc' ? (
                                    <span>BPT: {claimedRewardsFormat}</span>
                                    // ClaimedRewardsFormat has to change by function 
                                ): null}
                            </div>
                        ): null}
                        {boost !== null && !isNaN(boost) ? (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: '5px'
                            }}>
                                <span className="font-weight-bold">
                                    Boost: &nbsp;
                                </span>
                                {boost}
                            </div>
                        ): null}
                        {currentBoost !== null && !isNaN(currentBoost) ? (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: '5px'
                            }}>
                                <span className="font-weight-bold">
                                    Current Boost: &nbsp;
                                </span>
                                {currentBoost}
                            </div>
                        ): null}
                    </div>
                    {['susdv2', 'sbtc'].includes(gauge.name) && synthsUnavailable ? (
                        <div>
                            Synthetix are upgrading their contract now and claiming SNX is not available
                            {synthsUnavailable}
                            {/* THIS HAS TO BE AN ERROR */}
                        </div>
                    ): null}
                    <div>
                        <Divider />
                    </div>
                    {/* POOL */}
                    <Row style={{margin: '10px'}}>
                        <Col>
                            {['susdv2','sbtc'].includes(gauge.name) && stakedBalance > 0 ? (
                                <div style={{margin: '5px'}}>
                                    <p>
                                        <a href="https://curve.fi/gauge.name+/withdraw">Unstake rewards</a>
                                    </p>
                                </div>
                            ): null}
                            <div style={{margin: '5px'}}>
                                <span className="font-weight-bold">Balance: &nbsp;</span><span>{ poolBalanceFormat }</span> { gauge.name } LP token
                            </div>
                            <div style={{margin: '5px'}}>
                                Amount
                                <TextField 
                                    label="Deposit Amount"
                                    variant="outlined"
                                    value={depositAmount}
                                    style={{margin: '5px'}}
                                    onChange={(event) => {
                                        setDepositAmount(event.target.value);
                                        watchDepositAmount(event.target.value); //watcher
                                    }}
                                />
                            </div>
                            {/* SLIDER PUTS OVER HERE */}
                            {/* <div style={{margin: '5px'}}>
                                {depositSlider}
                                <Slider 
                                    defaultValue={70}                        
                                    aria-label="Deposit Value"
                                    valueLabelDisplay='auto'
                                    value={depositSlider}
                                    color='secondary'
                                    onChange={(event) => {
                                        setDepositSlider(event.target.value);                            
                                    }}
                                />
                            </div> */}
                            <div style={{margin: '5px'}}>
                                {depositSlider}
                                <PrettoSlider 
                                    defaultValue={70}                        
                                    aria-label="Deposit Value"
                                    valueLabelDisplay='auto'
                                    value={depositSlider}
                                    color='secondary'
                                    onChange={(event) => {
                                        setDepositSlider(event.target.value);                            
                                    }}
                                />
                            </div>
                            <div className="row no-gutters">
                                <div className="col-12">
                                    <FormGroup>
                                        <FormControlLabel
                                        control={<Checkbox />}
                                        label="Infinit Approval"
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                            <div style={{margin: '5px'}}>
                                <Button
                                    variant='contained'
                                    size='large'
                                    style={{backgroundColor: "#5300e8", color: "white"}}
                                    onClick={() => {
                                        deposit();
                                    }}
                                >
                                    Deposit
                                    {['susdv2', 'sbtc'].includes(gauge.name) ? (
                                        <span> and stake</span>
                                    ) : null}
                                </Button>
                            </div>
                        </Col>
                        <Col>
                            {gaugeBalance > 0 ? (
                                <div>
                                    {['susdv2','sbtc'].includes(gauge.name) && stakedBalance > 0 ? (
                                        <div>
                                            <p>
                                                <a href="https://curve.fi/gauge.name+/withdraw">Unstake rewards</a>
                                            </p>
                                        </div>
                                    ): null}
                                    <div style={{margin: '5px'}}>
                                        <span className="font-weight-bold">Balance: &nbsp;</span><span>{ gaugeBalanceFormat }</span> in gauge
                                    </div>
                                    <div style={{margin: '5px'}}>
                                        Amount
                                        <TextField 
                                            label="Withdraw Amount"
                                            variant="outlined"
                                            value={withdrawAmount}
                                            style={{margin: '5px'}}
                                            onChange={(event) => {
                                                setWithdrawAmount(event.target.value);
                                                watchwithdrawAmount(event.target.value);
                                            }}
                                        />
                                    </div>
                                    {/* SLIDER PUTS OVER HERE */}
                                    {/* <div style={{margin: '5px'}}>
                                        {withdrawSlider}
                                        <Slider 
                                            defaultValue={70}                        
                                            aria-label="Withdraw Value"
                                            valueLabelDisplay='auto'
                                            value={withdrawSlider}
                                            color='secondary'
                                            onChange={(event) => {
                                                setWithdrawSlider(event.target.value);                            
                                            }}
                                        />
                                    </div> */}
                                    <div style={{margin: '5px'}}>
                                        {withdrawSlider}
                                        <PrettoSlider 
                                            defaultValue={70}                        
                                            aria-label="Deposit Value"
                                            valueLabelDisplay='auto'
                                            value={withdrawSlider}
                                            color='secondary'
                                            onChange={(event) => {
                                                setWithdrawSlider(event.target.value);                            
                                            }}
                                        />
                                    </div>
                                    <div style={{margin: '5px'}}>
                                        <Button
                                            variant='contained'
                                            size='large'
                                            style={{backgroundColor: "#5300e8", color: "white"}}
                                            onClick={() => {
                                                withdraw();
                                            }}
                                        >
                                            Withdraw
                                        </Button>
                                    </div>
                                </div>
                            ) : null}
                        </Col>
                    </Row>
                    <div>
                        <Divider />
                    </div>
                    <div style={{margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        {claimableTokens > 0 ? (
                            <Button
                                variant='contained'
                                size='large'
                                style={{backgroundColor: "#5300e8", color: "white"}}
                                onClick={() => {
                                    claim();
                                }}
                            >
                                Claim {claimableTokensFormat}% CRV
                            </Button>
                        ) : null}
                        {claimableReward > 0 ? (
                            <Button
                                variant='contained'
                                size='large'
                                style={{backgroundColor: "#5300e8", color: "white"}}
                                onClick={() => {
                                    claimRewards();
                                }}
                            >
                                Claim {claimableRewardFormat}
                                {gauge.name == 'susdv2' ? (
                                    <span>SNX</span>
                                ) : gauge.name == 'sbtc' ? (
                                    <span>BPT</span>
                                ) : null}
                            </Button>
                        ) : null}
                    </div>
                </div>
            </div>
            
            {/* SIGNING MODAL */}
            <SigningModal show={openSigning} />
        </>
    );
}
 
export default PoolInfo;