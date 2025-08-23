import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState(1);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    fetch(
      `https://v6.exchangerate-api.com/v6/9adf1f5b7f0e68c761c28784/latest/${fromCurrency}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [fromCurrency]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const fromCurrencyValue = Object.entries(data.conversion_rates).filter(
    (e) => e[0] === fromCurrency
  )[0][1];
  const toCurrencyValue = Object.entries(data.conversion_rates).filter(
    (e) => e[0] === toCurrency
  )[0][1];

  return (
    <div className="App" data-theme={isDark ? "dark" : "light"}>
      <button
        onClick={() => setIsDark(!isDark)}
        data-theme={!isDark ? "dark" : "light"}
      >
        {isDark ? "Light" : "Dark"}
      </button>
      <h1>Welcome to Currency Converter</h1>
      <h2>Start converting</h2>
      {/* ------TABLE------ */}
      <div>
        <table
          style={{
            textAlign: "center",
            fontSize: "24px",
            margin: "0 auto",
          }}
        >
          <tbody>
            <tr>
              <td>
                From{" "}
                <span>
                  <select
                    onChange={(e) => setFromCurrency(e.target.value)}
                    value={fromCurrency}
                    name="fromCurrency"
                    id="fromCurrency"
                    style={{
                      width: "55%",
                      fontSize: "22px",
                    }}
                  >
                    {Object.keys(data.conversion_rates)?.map((currency, i) => (
                      <option key={currency + i} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </span>
              </td>
              <td> = </td>
              <td style={{ textAlign: "left" }}>1.0000</td>
            </tr>
            <tr>
              <td style={{ textAlign: "right" }}>
                To{" "}
                <span>
                  <select
                    onChange={(e) => setToCurrency(e.target.value)}
                    value={toCurrency}
                    name="toCurrency"
                    id="toCurrency"
                    style={{ width: "55%", fontSize: "22px" }}
                  >
                    {Object.keys(data.conversion_rates)?.map((currency, i) => (
                      <option key={i + currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </span>
              </td>
              <td> = </td>
              <td style={{ textAlign: "left" }}>
                {toCurrencyValue.toFixed(4)}
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: "right" }}>Amount</td>
              <td> = </td>
              <td style={{ textAlign: "left" }}>
                <input
                  name="convertAmount"
                  id="convertAmount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ width: "70px", fontSize: "22px" }}
                ></input>
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ display: "block" }}>
          <h2>
            Total ={" "}
            {(fromCurrencyValue * amount * toCurrencyValue).toFixed(4) +
              toCurrency}
          </h2>
        </div>
      </div>
      {/* ------TABLE------ */}

      <ul className="currenciesList">
        {Object.entries(data.conversion_rates)?.map(([code, value]) => (
          <li key={code + value}>{code + ": " + value.toFixed(4)}</li>
        ))}
      </ul>
      {/* </div> */}
    </div>
  );
}
