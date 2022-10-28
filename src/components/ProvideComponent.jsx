import { MdAdd } from "react-icons/md";
import { useState } from "react";
import "../styles.css";
import BoxTemplate from "./BoxTemplate";
import { PRECISION } from "../constants";

export default function ProvideComponent(props) {
    const [amountOfFAUCET1, setAmountOfFAUCET1] = useState(0);
    const [amountOfFAUCET2, setAmountOfFAUCET2] = useState(0);
    const [error, setError] = useState("");

    // Gets estimates of a token to be provided in the pool given the amount of other token
    const getProvideEstimate = async (token, value) => {
        if (["", "."].includes(value)) return;
        if (props.contract !== null) {
            try {
                let estimate;
                if (token === "FAUCET1") {
                    estimate = await props.contract.getEquivalentToken2Estimate(
                        value * PRECISION
                    );
                    setAmountOfFAUCET2(estimate / PRECISION);
                } else {
                    estimate = await props.contract.getEquivalentToken1Estimate(
                        value * PRECISION
                    );
                    setAmountOfFAUCET1(estimate / PRECISION);
                }
            } catch (err) {
                if (err?.data?.message?.includes("Zero Liquidity")) {
                    setError("Message: Empty pool. Set the initial conversion rate.");
                } else {
                    alert(err?.data?.message);
                }
            }
        }
    };

    const onChangeAmountOfFAUCET1 = (e) => {
        setAmountOfFAUCET1(e.target.value);
        getProvideEstimate("FAUCET1", e.target.value);
    };

    const onChangeAmountOfFAUCET2 = (e) => {
        setAmountOfFAUCET2(e.target.value);
        getProvideEstimate("FAUCET2", e.target.value);
    };

    // Adds liquidity to the pool
    const provide = async () => {
        if (["", "."].includes(amountOfFAUCET1) || ["", "."].includes(amountOfFAUCET2)) {
            alert("Amount should be a valid number");
            return;
        }
        if (props.contract === null) {
            alert("Connect to Metamask");
            return;
        } else {
            try {
                let response = await props.contract.provide(
                    amountOfFAUCET1 * PRECISION,
                    amountOfFAUCET2 * PRECISION
                );
                await response.wait();
                setAmountOfFAUCET1(0);
                setAmountOfFAUCET2(0);
                await props.getHoldings();
                alert("Success");
                setError("");
            } catch (err) {
                err && alert(err?.data?.message);
            }
        }
    };

    return (
        <div className="tabBody">
            <BoxTemplate
                leftHeader={"Amount of Faucet1"}
                value={amountOfFAUCET1}
                onChange={(e) => onChangeAmountOfFAUCET1(e)}
            />
            <div className="swapIcon">
                <MdAdd />
            </div>
            <BoxTemplate
                leftHeader={"Amount of Faucet2"}
                value={amountOfFAUCET2}
                onChange={(e) => onChangeAmountOfFAUCET2(e)}
            />
            <div className="error">{error}</div>
            <div className="bottomDiv">
                <div className="btn" onClick={() => provide()}>
                    Provide
                </div>
            </div>
        </div>
    );
}
