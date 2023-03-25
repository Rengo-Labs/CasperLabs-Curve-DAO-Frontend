import React from "react";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/css/common.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

function VoteInfoProgressBar(props) {
  return (
    <>
      <div className={`row no-gutters ${props.width} `}>
        <div className="col-12">
          <div className="row no-gutters justify-content-between">
            <div
              className="col-6"
              style={
                props.polarQestion === "Yes"
                  ? { color: "#019267" }
                  : { color: "#de1738" }
              }
            >
              {props.polarQestion}
            </div>
            <div
              className="col-6 text-right"
              style={
                props.polarQestion === "Yes"
                  ? { color: "#019267" }
                  : { color: "#de1738" }
              }
            >{`${props.percent}%`}</div>
          </div>
        </div>
        <div
          className="progress"
          style={{ height: "30px", width: "100%", borderRadius: 0 }}
        >
          <div
            className={
              "progress-bar progress-bar-striped progress-bar-animated"
            }
            role="progressbar"
            style={{
              width: `${props.percent}%`,
              backgroundColor: `${props.color}`,
            }}
            aria-valuenow={props.percent}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    </>
  );
}

export default VoteInfoProgressBar;
