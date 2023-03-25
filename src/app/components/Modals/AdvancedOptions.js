import { Typography } from '@mui/material';
import FilledInput from '@mui/material/FilledInput';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import React from "react";
import { Modal } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import Exit from "../../assets/img/exit.svg";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";


function AdvancedOptions(props) {
  const [value, setValue] = React.useState('');

  const handleChange = (prop) => (event) => {
    setValue(event.target.value);
  };
  return (
    <Modal size="lg" centered show={props.show} onHide={props.handleClose}>
      <Modal.Body style={{ textAlign: 'center' }} >
        <Typography variant="h5" style={{ color: '#000027' }} gutterBottom >
          <strong>
            Advanced Options
            <span
              onClick={props.handleClose}
              style={{
                float: "right",
                cursor: "pointer",
              }}
            >
              <img
                src={Exit}
                alt="exit"
                width="15"
              />
            </span>
          </strong>
        </Typography>

      </Modal.Body>
      <Modal.Body>
        <div className="container">
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Max Slippage:</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue=".5"
              name="radio-buttons-group"
            >

              <FormControlLabel value=".5" control={<Radio />} label=".5%" />
              <FormControlLabel value="1" control={<Radio />} label="1%" />
              <FormControlLabel value="end" control={<Radio />} label={<FormControl fullWidth sx={{ m: 1 }} variant="filled">
                <FilledInput
                  id="filled-adornment-weight"
                  value={value}
                  onChange={handleChange}
                  endAdornment={<InputAdornment position="end">%</InputAdornment>}
                  aria-describedby="filled-weight-helper-text"
                  inputProps={{
                    'aria-label': 'percentage',
                  }}
                />
                <FormHelperText id="filled-weight-helper-text">Percentage</FormHelperText>
              </FormControl>} />

            </RadioGroup>
          </FormControl>
          <hr></hr>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Gas Priority Fee:</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="standard"
              name="radio-buttons-group"
            >
              <FormControlLabel value="standard" control={<Radio />} label="Standard" />
              <FormControlLabel value="fast" control={<Radio />} label="Fast" />
              <FormControlLabel value="instant" control={<Radio />} label="Instant" />
              <FormControlLabel value="slow" control={<Radio />} label={<FormControl fullWidth sx={{ m: 1 }} variant="filled">
                <FilledInput
                  id="filled-adornment-weight"
                  value={value}
                  onChange={handleChange}
                  aria-describedby="filled-weight-helper-text"
                  inputProps={{
                    'aria-label': 'Slow',
                  }}
                />
                <FormHelperText id="filled-weight-helper-text">Slow</FormHelperText>
              </FormControl>} />
            </RadioGroup>
          </FormControl>
        </div>
       
      </Modal.Body>
      <Modal.Footer>
        <div className="row no-gutters justify-content-center btnWrapper">
          <button onClick={props.handleClose}>Close</button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default AdvancedOptions;
