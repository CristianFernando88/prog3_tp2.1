class Currency {
    constructor(code, name) {
        this.code = code;
        this.name = name;
    }
}

class CurrencyConverter {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;//URL base de la API de Frankfurter.
        this.currencies = []; //arreglo que almacenará instancias de la clase `Currency`. Al instanciar un objeto de esta clase, el arreglo `currencies` debe estar vacío.
    }

    async getCurrencies() {
        try{
            const response = await fetch(this.apiUrl+"/currencies");
            const data = await response.json();
            for(let propiedad in data){
                let currenciesObj = new Currency(propiedad,data[propiedad]);
                this.currencies.push(currenciesObj);
            }
        }catch(error){
            console.log(error);
        }
    }

    async convertCurrency(amount, fromCurrency, toCurrency) {
        //- `GET /latest?amount=<input_amount>&from=<from_currency>&to=<target_currency>`: Obtiene la conversión de una moneda a otra.
        if(fromCurrency.code===toCurrency.code){
            return amount;
        }else if(fromCurrency.code!==toCurrency.code){
            try {
                const response = await fetch(this.apiUrl+"/latest?amount="+amount+"&from="+fromCurrency.code+"&to="+toCurrency.code);
                const data = await response.json();
                console.log(data.rates);
                return parseFloat(data.rates[toCurrency.code]);
            } catch (error) {
                console.log(error);
                return null;
            }
        
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("conversion-form");
    const resultDiv = document.getElementById("result");
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");

    const converter = new CurrencyConverter("https://api.frankfurter.app");
    await converter.getCurrencies();
    populateCurrencies(fromCurrencySelect, converter.currencies);
    populateCurrencies(toCurrencySelect, converter.currencies);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const amount = document.getElementById("amount").value;
        const fromCurrency = converter.currencies.find(
            (currency) => currency.code === fromCurrencySelect.value
        );
        const toCurrency = converter.currencies.find(
            (currency) => currency.code === toCurrencySelect.value
        );
        const convertedAmount = await converter.convertCurrency(
            amount,
            fromCurrency,
            toCurrency
        );
    
        if (convertedAmount !== null && !isNaN(convertedAmount)) {
            resultDiv.textContent = `${amount} ${
                fromCurrency.code
            } son ${convertedAmount.toFixed(2)} ${toCurrency.code}`;
        } else {
            resultDiv.textContent = "Error al realizar la conversión.";
        }
    });

    function populateCurrencies(selectElement, currencies) {
        if (currencies) {
            currencies.forEach((currency) => {
                const option = document.createElement("option");
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name}`;
                selectElement.appendChild(option);
            });
        }
    }
});
