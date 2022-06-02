//REACT
import React, { useState } from "react";
// CUSTOME STYLING
import "../../../assets/css/style.css";
import "../../../assets/css/curveButton.css";
import "../../../assets/css/common.css";
// BOOTSTRAP
import "../../../assets/css/bootstrap.min.css";
//COMPONENTS
import HeaderHome from "../../../components/Headers/Header";
import HomeBanner from "./Home/HomeBanner";
import FormikRadioGroup from "../../../components/FormsUI/FormikRadioGroup";
import TextInput from "../../../components/FormsUI/TextInput";
//REACT ROUTER
import { Link } from "react-router-dom";
//MATERIAL UI
import { StyledEngineProvider } from "@mui/styled-engine";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
// FORMIK
import { Formik, Field, Form } from "formik";
// YUP
import * as Yup from "yup";

//COMPONENT FUNCTION
const FactoryCreateGauge = () => {
  // States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();

  // Content
  const initialValues = {
    Platform: "",
    PoolType: "",
    GaugePoolAddress: "",
  };

  const validationSchema = Yup.object().shape({
    Platform: Yup.string().required("You must select a value."),
    PoolType: Yup.string().required("You must select a value."),
    GaugePoolAddress: Yup.number().required("Required"),
  });

  const platformOptions = [
    "Casper",
    "Fantom",
    "Polygon",
    "xDai",
    "Arbitrum",
    "Avalanche",
    "Optimism",
  ];

  const PoolTypeOptions = [
    {
      value: "Stable Pool (Pegged Assets)",
      description:
        "A pool made of assets which are expected to always have rate cloase to 1:1 (e.g. a pool made of usd stablecoins",
    },
    {
      value: "Crypto Pool (Non-Pegged Assets)",
      description:
        "A pool made of any token, with no price stability expectation.",
    },
  ];

  // Handlers
  const onCreateGaugeSubmit = (values) => {
    console.log("create Gauge: ", values);
  };

  return (
    <>
      <div className="home-section home-full-height">
        <HeaderHome
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          setTorus={setTorus}
          selectedNav={"Factory"}
        />
        <div
          className="content"
          style={{ paddingTop: "100px" }}
          position="absolute"
        >
          <HomeBanner />
        </div>
        <StyledEngineProvider injectFirst>
          <div className="container-fluid">
            <div className="curve-container">
              <div className="curve-content-banks">
                <fieldset>
                  <legend>Deploy a new gauge for a factory pool</legend>
                  <div className="row no-gutters justify-content-center">
                    <div className="curve-content-wrapper col-12 col-lg-6 ">
                      <Paper elevation={4}>
                        <div className="py-5 px-4">
                          <Alert
                            severity="warning"
                            sx={{ marginBottom: "2rem" }}
                          >
                            Your pool must exist in the factory, it must not
                            currently have a gauge. Your gauge will not receive
                            CRV until you submit it for a{" "}
                            <span style={{ fontWeight: "bold" }}>
                              <Link
                                style={{ color: "#000" }}
                                to="/factory/create-gauge-vote"
                              >
                                new vote
                              </Link>
                            </span>
                            .
                          </Alert>
                          <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onCreateGaugeSubmit}
                          >
                            <Form>
                              <section className="createPoolContent createPoolform">
                                <h3>1. Platform</h3>
                                <div className="row no-gutters justify-content-between px-0 px-md-3">
                                  <div className="col-12">
                                    <Field
                                      name="Platform"
                                      options={platformOptions}
                                      component={FormikRadioGroup}
                                    />
                                  </div>
                                </div>
                              </section>
                              <Divider />
                              <section className="createPoolContent createPoolform mt-3">
                                <h3>2. Pool Type</h3>
                                <div className="row no-gutters justify-content-between px-0 px-md-3">
                                  <div className="col-12">
                                    <Field name="PoolType">
                                      {({ field, form, meta }) => {
                                        return (
                                          <FormikRadioGroup
                                            form={form}
                                            field={field}
                                          >
                                            {PoolTypeOptions.map(
                                              (item, index) => {
                                                return (
                                                  <>
                                                    <FormControlLabel
                                                      value={item.value}
                                                      key={index}
                                                      control={<Radio />}
                                                      label={item.value}
                                                    />
                                                    <p className="assetsTypeDescription">
                                                      {item.description}
                                                    </p>
                                                  </>
                                                );
                                              }
                                            )}
                                          </FormikRadioGroup>
                                        );
                                      }}
                                    </Field>
                                  </div>
                                </div>
                              </section>
                              <Divider />
                              {/* Pool Address */}
                              <section className="createPoolContent createPoolform mt-3">
                                <h3>3. Pool Address</h3>
                                <div className="row no-gutters justify-content-between px-0 px-md-3">
                                  <div className="col-12">
                                    <TextInput
                                      id="gaugePoolAddress"
                                      label="Pool Address"
                                      variant="filled"
                                      name="GaugePoolAddress"
                                      sx={{ width: "100%" }}
                                    />
                                  </div>
                                </div>
                              </section>
                              <Divider />
                              <div className="btnWrapper row no-gutters justify-content-center mt-3">
                                <button type="submit">Deploy Gauge</button>
                              </div>
                              <hr />
                            </Form>
                          </Formik>

                          {/* Gas Priority Fee */}
                          <section className="createPoolContent createPoolform">
                            <div className="row no-gutters justify-content-between px-0 px-md-3">
                              <FormControl>
                                <p
                                  style={{
                                    marginBottom: "0",
                                    fontSize: "0.75rem",
                                    fontWeight: "bold",
                                    color: "#9c9c9c",
                                    paddingLeft: "2.75rem",
                                    marginTop: "1.5rem",
                                  }}
                                >
                                  Gas Priority Fee:
                                </p>
                                <RadioGroup
                                  row
                                  aria-labelledby="gas-fee-radio-buttons-group-label"
                                  defaultValue="gas-fee"
                                  name="gas-fee-radio-group"
                                >
                                  <FormControlLabel
                                    value="standard fee"
                                    control={<Radio />}
                                    label="Standard"
                                  />
                                  <FormControlLabel
                                    value="fast"
                                    control={<Radio />}
                                    label="Fast"
                                  />
                                  <FormControlLabel
                                    value="instant"
                                    control={<Radio />}
                                    label="Instant"
                                  />
                                  <label for="customGas">
                                    <div className="row no-gutters justify-content-center align-items-center">
                                      <div className="col-2 text-center">
                                        <FormControlLabel
                                          value="custom"
                                          control={<Radio />}
                                          label=""
                                        />
                                      </div>
                                      <div className="col-6">
                                        <TextField
                                          id="filled-basic"
                                          label=""
                                          variant="filled"
                                          name="gas-fee-radio-group"
                                        />
                                      </div>
                                      <div className="col-4 pl-2">
                                        <span
                                          style={{
                                            fontSize: "1rem",
                                            color: "#5300E8",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          Slow
                                        </span>
                                      </div>
                                    </div>
                                  </label>
                                </RadioGroup>
                              </FormControl>
                            </div>
                          </section>
                        </div>
                      </Paper>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </StyledEngineProvider>
      </div>
    </>
  );
};

export default FactoryCreateGauge;
