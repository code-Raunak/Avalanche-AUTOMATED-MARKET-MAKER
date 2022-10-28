import { useState } from "react";
import "../styles.css";
import BoxTemplate from "./BoxTemplate";
import { PRECISION } from "../constants";

export default function FaucetComponent(props) {
    const [amountOfFAUCET1, setAmountOfFAUCET1] = useState(0);
    const [amountOfFAUCET2, setAmountOfFAUCET2] = useState(0);

    const onChangeAmountOfFAUCET2 = (e) => {
        setAmountOfFAUCET2(e.target.value);
    };

    const onChangeAmountOfFAUCET1 = (e) => {
        setAmountOfFAUCET1(e.target.value);
    };
	
    // Funds the account with given amount of Tokens 
    async function onClickFund() {
        if (props.contract === null) {
            alert("Connect to Metamask");
            return;
        }
        if (["", "."].includes(amountOfFAUCET1) || ["", "."].includes(amountOfFAUCET2)) {
            alert("Amount should be a valid number");
            return;
        }
        try {
            let response = await props.contract.faucet(
                amountOfFAUCET1 * PRECISION,
                amountOfFAUCET2 * PRECISION
            );
            let res = await response.wait();
            console.log("res", res);
            setAmountOfFAUCET1(0);
            setAmountOfFAUCET2(0);
            await props.getHoldings();
            alert("Success");
        } catch (err) {
            err?.data?.message && alert(err?.data?.message);
            console.log(err);
        }
    }

    return (
        <div className="tabBody">
            <BoxTemplate
                leftHeader={"Amount of Faucet1"}
                right={"FAUCET1"}
                value={amountOfFAUCET1}
                onChange={(e) => onChangeAmountOfFAUCET1(e)}
            />
            <BoxTemplate
                leftHeader={"Amount of Faucet2"}
                right={"FAUCET2"}
                value={amountOfFAUCET2}
                onChange={(e) => onChangeAmountOfFAUCET2(e)}
            />
            <div className="bottomDiv">
                <div className="btn" onClick={() => onClickFund()}>
                    Fund
                </div>
            </div>
        </div>
    );
}
