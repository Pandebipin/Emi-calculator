import { useEffect, useState } from "react";
import "./App.css";
import { tenureData } from "./Utilis/content";
import { numberWithCommas } from "./Utilis/Config";
function App() {
  const [cost, setCost] = useState(10);
  const [downPayment, setDownpayment] = useState(0);
  const [fee, setFee] = useState(0);
  const [interest, setInterest] = useState(10);
  const [tenure, setTenure] = useState(12);
  const [emi, setEmi] = useState(0);

  const updateEmi = (e) => {
    if (!cost) return;

    const dp = Number(e.target.value);
    setDownpayment(dp.toFixed(0));
    const emi = calculateEmi(dp);
    setEmi(emi);
  };
  useEffect(() => {
    if (!(cost > 0)) {
      setDownpayment(0);
      setEmi(0);
    }
  }, [tenure]);

  const calculateTotalDownPayment = () => {
    const downPaymentAmount = Number(downPayment);
    // Calculate the additional fee based on the cost and fee percentage
    const additionalFee = (cost - downPaymentAmount) * (fee / 100);

    const totalDownPayment = downPaymentAmount + additionalFee;

    return numberWithCommas(totalDownPayment.toFixed(0));
  };

  const calculatetotalEmi = () => {
    return numberWithCommas((emi * tenure).toFixed(0));
  };
  const calculateDP = (emi) => {
    if (!cost) return;

    const downPaymentPercent = 100 - (emi / calculateEmi(0)) * 100;

    return Number((downPaymentPercent / 100) * cost).toFixed(0);
  };

  const calculateEmi = (downPayment) => {
    if (!cost) return;

    let loanEmi = cost - downPayment;
    let rateOfInterest = interest / 100;
    let numOfYears = tenure / 12;

    const Emi =
      (loanEmi * rateOfInterest * (1 + rateOfInterest) ** numOfYears) /
      ((1 + rateOfInterest) ** numOfYears - 1);
    return Number(Emi / 12).toFixed(0);
  };
  const updateDownpayment = (e) => {
    const emi = Number(e.target.value);
    setEmi(emi.toFixed(0));

    const dp = calculateDP(emi);
    setDownpayment(dp);
  };

  const settingInterest = (e) => {
    if (e.target.value > 100) {
      setInterest(100);
    } else setInterest(e.target.value);
  };
  const settingProcessing = (e) => {
    if (e.target.value > 100) {
      setFee(100);
    } else setFee(e.target.value);
  };
  return (
    <div className="flex flex-col gap-2">
      <span>Emi calculator</span>
      <span>Total cost of assets</span>
      <input
        className="border-2 border-gray-800"
        type="number"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        name=""
        id=""
      />
      <div className="flex flex-col">
        <label>Interest rate in(%)</label>
        <input
          type="number"
          value={interest}
          onChange={(e) => settingInterest(e)}
          className="border-2 border-gray-800"
        />
      </div>
      <div className="flex flex-col">
        <label>Processing fee in(%)</label>
        <input
          type="number"
          value={fee}
          max={"100%"}
          onChange={(e) => settingProcessing(e)}
          className="border-2 border-gray-800"
        />
      </div>
      <div className="flex flex-col">
        <label>downPayment rate in(%)</label>
        <input
          type="range"
          min={0}
          max={cost}
          value={downPayment}
          onChange={updateEmi}
          className="border-2 border-gray-800"
        />
        <div className="flex justify-around">
          <label>0%</label>
          <label>{numberWithCommas(downPayment)}</label>
          <label>100%</label>
        </div>
        totalDownPayment -{calculateTotalDownPayment()}
      </div>
      <div className="flex flex-col">
        <label>Loan per month in(%)</label>
        <input
          type="range"
          min={calculateEmi(cost)}
          max={calculateEmi(0)}
          value={emi}
          onChange={updateDownpayment}
          className="border-2 border-gray-800"
        />
        <div className="flex justify-around">
          <label>{calculateEmi(0)}</label>
          <label>{numberWithCommas(emi)}</label>
          <label>{calculateEmi(0)}</label>
        </div>
        Total loan per month -{calculatetotalEmi()}
        <div className="flex flex-col gap-2 justify-between  ">
          <label>Tenure</label>
          <div className="flex justify-center gap-8">
            {tenureData.map((t) => {
              return (
                <button
                  onClick={() => setTenure(t)}
                  className="bg-blue-600 p-2 border-1 border-blue-600 rounded-lg"
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
