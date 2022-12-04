import { Button, TextField } from '@material-ui/core';
import { Checkbox, Divider, FormControlLabel, FormGroup, Slider } from '@mui/material';
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';


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
    // STATES
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