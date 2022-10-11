import React from "react";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// CUSTOM CSS
import "../../assets/css/style.css";
import "../../assets/css/common.css";
// FONT AWESOME
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
// COMPONENTS

function VoteInfoProgressBar(props) {

  return (
    <>
       <div className={`row no-gutters ${props.width} `}>
            <div className="col-12">
              <div className="row no-gutters justify-content-between">
                <div className="col-6">{props.polarQestion}</div>
                <div className="col-6 text-right">{`${props.percent}%`}</div>
              </div>
            </div>
            <div
              className="progress"
              style={{ height: "30px", width: "100%", borderRadius: 0 }}
            >
              <div
                className={`progress-bar ${props.color} `}
                role="progressbar"
                style={{ width: `${props.percent}%` }}
                aria-valuenow={props.percent}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
    </>
  )
}

export default VoteInfoProgressBar