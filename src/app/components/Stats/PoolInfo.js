import { Button, Checkbox, Divider, FormControlLabel, FormGroup, Slider, TextField, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import BigNumber from 'bignumber.js';
import { CLPublicKey } from 'casper-js-sdk';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { ERC20_CRV_CONTRACT_HASH, LIQUIDITY_GAUGE_V3_CONTRACT_HASH, VOTING_ESCROW_CONTRACT_HASH } from '../blockchain/Hashes/ContractHashes';
import { periodTimestamp, workingBalances, workingSupply } from '../JsClients/LIQUIDITYGAUGEV3/liquidityGaugeV3FunctionsForBackend/functions';
import { balanceOf, totalSupply } from '../JsClients/VOTINGESCROW/QueryHelper/functions';
import { claimRewardsMakeDeploy } from '../MakeDeployFunctions/ClaimRewardsMakeDeploy';
import { depositMakeDeploy } from '../MakeDeployFunctions/DepositMakeDeploy';
import { mintMakeDeploy } from '../MakeDeployFunctions/MintMakeDeploy';
import { UserCheckpointMakeDeploy } from '../MakeDeployFunctions/UserCheckpointMakeDeploy';
import { withdrawMakeDeploy } from '../MakeDeployFunctions/WithdrawMakeDeploy';
import SigningModal from '../Modals/SigningModal';
import * as gaugeStore from "../stores/GaugeStore";
import * as veStore from "../stores/VeStore";


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
    color: '#1976d2',
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
        backgroundColor: '#1976d2',
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
    const [activePublicKey, setActivePublicKey] = useState(localStorage.getItem("Address"));// get the address of user logged in
    const [claimableTokens, setClaimableTokens] = useState(10);
    const [claimedRewards, setClaimedRewards] = useState(0);
    const [boost, setBoost] = useState(0);
    const [currentBoost, setCurrentBoost] = useState(0);
    const [stakedBalance, setStakedBalance] = useState(0);
    const [depositAmount, setDepositAmount] = useState(0);
    const [depositSlider, setDepositSlider] = useState(0);
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

    useEffect(() => {
        console.log("Entry point");
        setDepositAmount(poolBalanceFormat);
        setWithdrawAmount(gaugeBalanceFormat);
        setLoaded(true);
        setClaimableTokens(gauge.claimable_tokens);

        gaugeStore.state.totalClaimableCRV += +claimableTokens


        setMinted(gauge.minted);

        gaugeStore.state.totalMintedCRV += +gauge.minted; //writing this as gauge minted because we don't get instant value by setFunction unless function is completed
        let allowance;

        const getAllowance = async () => {
            allowance = await allowance(ERC20_CRV_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash)).toString("Hex");
        }
        getAllowance();
        if (+gauge.gaugeBalance > 0) {
            setCurrentBoost(Math.max(1, gaugeStore.state.boosts[gauge.name]));
            checkLimit()
        }
    }, []);

    const gauge = useMemo(() => {
        return gaugeStore.state.mypools[props.i];
    }, [gaugeStore.state.mypools[props.i]]);
    const gaugeBalance = useMemo(() => {
        return +(gauge.gaugeBalance);
    }, [gauge.gaugeBalance])
    const poolBalanceFormat = useMemo(() => {
        return toFixed(gauge.balance / 1e9);
    }, [gauge.balance]);
    const gaugeBalanceFormat = useMemo(() => {
        return (gauge.gaugeBalance / 1e18).toFixed(2)
    }, [gauge.gaugeBalance]);
    const apy = useMemo(() => {
        return gaugeStore.state.APYs[gauge.name];
    }, [gaugeStore.state.APYs[gauge.name]]);
    const gaugeRelativeWeight = useMemo(() => {
        return (gauge.gauge_relative_weight * 100);
    }, [gauge.gauge_relative_weight]);
    const claimableTokenFormat = useMemo(() => {
        return (claimableTokens / 1e9).toFixed(2);
    }, [claimableTokens]);
    const mintedFormat = useMemo(() => {
        return (minted / 1e9).toFixed(2);
    }, [minted]);
    const triggerUpdateLimit = useMemo(() => {
        updateLimit();
    }, [depositAmount, veStore.state.deposit, veStore.state.increaseLock, Date.now()]);
    const claimableRewardsFormat = useMemo(() => {
        return toFixed(claimableReward / 1e9);
    }, [claimableReward]);
    const claimedRewardsFormat = useMemo(() => {
        return toFixed(claimedRewards / 1e9);
    }, [claimedRewards]);
    const canApplyBoost = useMemo(() => {
        return gauge.gaugeBalance > 0 && (Date.now() / 1000) > 1597271916 && currentBoost < currentBoostCheck
    }, [gauge.gaugeBalance, currentBoost, currentBoostCheck]);
    const CRVAPY = useMemo(() => {
        let apy = apy;
        if (currentBoost > 0) {
            apy *= currentBoost
        }
        return apy
    }, [apy, currentBoost]);
    const synthsUnavailable = useMemo(() => {
        return gaugeStore.state.synthsUnavailable;
    }, [gaugeStore.state.synthsUnavailable]);


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
    const deposit = async () => { //confirm entry point
        let deposit = BigNumber(depositAmount).time(1e9);
        let balance = balanceOf(ERC20_CRV_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"));
        if (deposit.gt(BigNumber(this.gauge.balance))) {
            deposit = balance;
        }
        let variant = "Success";
        enqueueSnackbar(`Please confirm deposition into ${gauge.name} gauge`, { variant });
        depositMakeDeploy(deposit.toFixed(0, 1), setOpenSigning, enqueueSnackbar);

        updateBalances()

    }

    const withdraw = async () => {
        let withdraw = BigNumber(withdrawAmount).times(1e18)
        let balance = BigNumber(await balanceOf(LIQUIDITY_GAUGE_V3_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")))
        if (withdraw.gt(balance))
            withdraw = balance
        let variant = "Success";
        enqueueSnackbar(`Please confirm withdrawing from ${gauge.name} gauge`, { variant });
        await withdrawMakeDeploy(setOpenSigning, enqueueSnackbar);
        updateBalances()
    }

    const updateBalances = async () => {
        gaugeStore.state.mypools[props.i].gaugeBalance = balanceOf(LIQUIDITY_GAUGE_V3_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"));
    }

    const toFixed = (num) => {
        if (num == '' || num == undefined || +num == 0) return '0.00'
        if (!BigNumber.isBigNumber(num)) num = +num
        if (['ren', 'sbtc'].includes(gauge.name)) return num.toFixed(8)
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
        setDepositAmount(this.toFixed((this.gauge.balance / 1e9) * val / 100));
    }

    const onWithdrawSlider = (event) => {
        let val = event.target.value
        setWithdrawSlider(val);
        setWithdrawAmount(this.toFixed((this.gauge.gaugeBalance / 1e9) * val / 100));
    }

    const update_liquidity_limit = async (new_l = null, new_voting_balance = null) => {
        let l = +gauge.gaugeBalance
        if (new_l !== null)
            l = new_l * 1e9
        let voting_balance = +(await balanceOf(VOTING_ESCROW_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString('hex')));
        let voting_total = +(await totalSupply(VOTING_ESCROW_CONTRACT_HASH)) - +voting_balance;
        let period_timestamp = +(await periodTimestamp(LIQUIDITY_GAUGE_V3_CONTRACT_HASH, 0));
        let working_balances = +(await workingBalances(LIQUIDITY_GAUGE_V3_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")));
        let working_supply = +(await workingSupply(LIQUIDITY_GAUGE_V3_CONTRACT_HASH));
        let L = +(await totalSupply(LIQUIDITY_GAUGE_V3_CONTRACT_HASH)) + l


        if (new_voting_balance !== null) {
            voting_balance = new_voting_balance * 1e18
        }

        voting_total += voting_balance


        let TOKENLESS_PRODUCTION = 40

        let BOOST_WARMUP = this.BOOST_WARMUP

        let lim = l * TOKENLESS_PRODUCTION / 100
        if (voting_total > 0 && ((Date.now() / 1000) > period_timestamp + BOOST_WARMUP))
            lim += L * voting_balance / voting_total * (100 - TOKENLESS_PRODUCTION) / 100

        lim = Math.min(l, lim)

        let old_bal = working_balances
        let noboost_lim = TOKENLESS_PRODUCTION * l / 100
        let noboost_supply = working_supply + noboost_lim - old_bal
        let _working_supply = working_supply + lim - old_bal

        return [_working_supply, (lim / _working_supply) / (noboost_lim / noboost_supply)]

    }

    const claim = async () => {
        let variant = "Success"
        enqueueSnackbar(`Please confirm claiming CRV from ${gauge.name} gauge`, { variant });
        mintMakeDeploy(gauge.gauge, setOpenSigning, enqueueSnackbar);
    }

    const claimRewards = async () => { //confirm entry points
        let variant = "Success";
        enqueueSnackbar(`Please confirm claiming ${gauge.name == 'susdv2' ? 'SNX' : 'BPT'}`, { variant });
        await claimRewardsMakeDeploy(setOpenSigning, enqueueSnackbar);
    }

    const applyBoost = async () => {
        let variant = "Success";
        enqueueSnackbar(`Please confirm applying boost`, { variant });
        UserCheckpointMakeDeploy(activePublicKey, setOpenSigning, enqueueSnackbar);
    }

    const updateLimit = async () => { //ask about this function
        if (!loaded) return;
    }

    const checkLimit = async () => {
        let currentLimit = await update_liquidity_limit()
        setCurrentBoostCheck(currentLimit[1]);
        if (currentBoost < currentBoostCheck && claimableTokens == 0)
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
                                <span style={{ color: 'green' }}>
                                    You can apply boost by claiming CRV
                                </span>
                            </div>
                        ) : null}
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
                            {gaugeRelativeWeight / 1e9}%
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
                            {mintedFormat}
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
                                ) : gauge.name == 'sbtc' ? (
                                    <span>BPT: {claimedRewardsFormat}</span>
                                ) : null}
                            </div>
                        ) : null}
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
                        ) : null}
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
                        ) : null}
                    </div>
                    {['susdv2', 'sbtc'].includes(gauge.name) && synthsUnavailable ? (
                        <div>
                            Synthetix are upgrading their contract now and claiming SNX is not available
                            {synthsUnavailable}
                            {/* THIS HAS TO BE AN ERROR */}
                        </div>
                    ) : null}
                    <div>
                        <Divider />
                    </div>
                    {/* POOL */}
                    <Row style={{ margin: '10px' }}>
                        <Col>
                            {['susdv2', 'sbtc'].includes(gauge.name) && stakedBalance > 0 ? (
                                <div style={{ margin: '5px' }}>
                                    <p>
                                        <a href="https://curve.fi/gauge.name+/withdraw">Unstake rewards</a>
                                    </p>
                                </div>
                            ) : null}
                            <div style={{ margin: '5px' }}>
                                <span className="font-weight-bold">Balance: &nbsp;</span><span>{poolBalanceFormat}</span> {gauge.name} LP token
                            </div>
                            <div style={{ margin: '5px' }}>
                                Amount
                                <TextField
                                    label="Deposit Amount"
                                    variant="outlined"
                                    value={depositAmount}
                                    style={{ margin: '5px' }}
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
                            <div style={{ margin: '5px' }}>
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
                            <div style={{ margin: '5px' }}>
                                <Button
                                    variant='contained'
                                    size='large'
                                    style={{ backgroundColor: "#1976d2", color: "white" }}
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
                                    {['susdv2', 'sbtc'].includes(gauge.name) && stakedBalance > 0 ? (
                                        <div>
                                            <p>
                                                <a href="https://curve.fi/gauge.name+/withdraw">Unstake rewards</a>
                                            </p>
                                        </div>
                                    ) : null}
                                    <div style={{ margin: '5px' }}>
                                        <span className="font-weight-bold">Balance: &nbsp;</span><span>{gaugeBalanceFormat}</span> in gauge
                                    </div>
                                    <div style={{ margin: '5px' }}>
                                        Amount
                                        <TextField
                                            label="Withdraw Amount"
                                            variant="outlined"
                                            value={withdrawAmount}
                                            style={{ margin: '5px' }}
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
                                    <div style={{ margin: '5px' }}>
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
                                    <div style={{ margin: '5px' }}>
                                        <Button
                                            variant='contained'
                                            size='large'
                                            style={{ backgroundColor: "#1976d2", color: "white" }}
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
                    <div style={{ margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {claimableTokens > 0 ? (
                            <Button
                                variant='contained'
                                size='large'
                                style={{ backgroundColor: "#1976d2", color: "white" }}
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
                                style={{ backgroundColor: "#1976d2", color: "white" }}
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