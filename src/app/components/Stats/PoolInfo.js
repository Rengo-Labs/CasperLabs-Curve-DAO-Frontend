import { Button, TextField } from '@material-ui/core';
import { Checkbox, Divider, FormControlLabel, FormGroup, Slider } from '@mui/material';
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { getState } from '../Gauge/GaugeStore';
import { state } from '../Gauge/GaugeStore';
import { applyBoostAll } from '../Gauge/GaugeStore';
import { balanceOf, totalSupply } from '../JsClients/VOTINGESCROW/QueryHelper/functions';
import { ERC20_CRV_CONTRACT_HASH, LIQUIDITY_GAUGE_V3_CONTRACT_HASH, VOTING_ESCROW_CONTRACT_HASH } from '../blockchain/AccountHashes/Addresses';
import { useSnackbar } from 'notistack';
import BigNumber from 'bignumber.js';
import { CLPublicKey } from 'casper-js-sdk';
import { periodTimestamp, workingBalances, workingSupply } from '../JsClients/LIQUIDITYGAUGEV3/liquidityGaugeV3FunctionsForBackend/functions';


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
    const [canApplyBoost, setCanApplyBoost] = useState(false);
    const [claimableTokens, setClaimableTokens] = useState(10);
    const [gaugeRelativeWeight, setGaugeRelativeWeight] = useState(0);
    const [mintedFormat, setMintedFormat] = useState() //this will be replaced by function
    const [claimedRewards, setClaimedRewards] = useState(0);
    const [gauge, setGauge] = useState({});
    const [claimedRewardsFormat, setClaimedRewardsFormat] = useState(); //this will be replace by function
    const [boost, setBoost] = useState(0);
    const [currentBoost, setCurrentBoost] = useState(0);
    const [synthsUnavailable, setSynthsUnavailable] = useState(0);
    const [stakedBalance, setStakedBalance] = useState(0);
    const [poolBalanceFormat, setPoolBalanceFormat] = useState(); //this will be replace by function
    const [depositAmount, setDepositAmount] = useState(0);
    const [depositSlider, setDepositSlider] = useState(0);
    const [gaugeBalance, setGaugeBalance] = useState(10);
    const [gaugeBalanceFormat, setGaugeBalanceFormat] = useState(); //this will be replace by function
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [withdrawSlider, setWithdrawSlider] = useState(0);
    const [claimableTokensFormat, setClaimableTokensFormat] = useState(10); //this will be replace by function
    const [claimableReward, setClaimableReward] = useState(0);
    const [claimableRewardFormat, setClaimableRewardFormat] = useState(); //this will be replace by function
    const [currentBoostCheck, setCurrentBoostCheck] = useState(0);
    
    //HANDLERS
    const handleChangeCanApplyBoost = () => {
        setCanApplyBoost(gaugeBalance > 0 && (Date.now() / 1000) > 1597271916 && currentBoost < currentBoostCheck)
    }


    //FUNCTIONS
    const deposit = async () => {
        let deposit = BigNumber(depositAmount).time(1e9);
        let balance = balanceOf(ERC20_CRV_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"));
        if (deposit.gt(BigNumber(this.gauge.balance))) {
            deposit = balance;
        }

        // await common.approveAmount(this.swap_token, deposit, contract.default_account, this.gauge.gauge, this.inf_approval) //asl about this (not any function found against this)

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

        // await withdrawMethod.send({
        //     from: contract.default_account,
        //     gasPrice: this.gasPriceWei,
        //     gas: gas * 1.5 | 0,
        // })
        // .once('transactionHash', hash => {
        //     dismiss()
        //     notifyHandler(hash)
        // }) //this whole call is based on withdraw functions

        updateBalances()
    }

    const updateBalances = async () => {
        let gaugeStore = {}; //temporary

        // let calls = [
        //     //balanceOf
        //     [this.gauge.swap_token, '0x70a08231000000000000000000000000' + contract.default_account.slice(2)], //ask about this
        //     [this.gaugeContract._address, this.gaugeContract.methods.balanceOf(contract.default_account).encodeABI()],
        // ]


        // let aggcalls = await contract.multicall.methods.aggregate(calls).call()

        // let decoded = aggcalls[1].map(hex => web3.eth.abi.decodeParameter('uint256', hex))

        // gaugeStore.state.mypools[this.i].balance = decoded[0]
        gaugeStore.state.mypools[this.i].gaugeBalance = balanceOf(LIQUIDITY_GAUGE_V3_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"));
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

    return (
        <>
            <div className="row no-gutters">
                <div className="col-12 text-center text-md-left">
                    <div>
                        {canApplyBoost && claimableTokens == 0 ? (
                            <div>
                                <Button>
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
                            >
                                Claim {claimableTokensFormat}% CRV
                            </Button>
                        ) : null}
                        {claimableReward > 0 ? (
                            <Button
                                variant='contained'
                                size='large'
                                style={{backgroundColor: "#5300e8", color: "white"}}
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
        </>
    );
}
 
export default PoolInfo;