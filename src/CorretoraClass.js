class CorretoraClass {
    constructor(){
        //intervalo de tempo de pesquisa
        this.CRAWLER_INTERVAL=10000;
        //porcentagem esperada para operar
        this.PROFITABILITY=1.05;
        //nome da corretora
        this.NAME = '';
        /*this.CURRENCY = [
            {name:'BTC', buyPrice: 0, sellPrice: 0 },
            {name:'LTC', buyPrice: 0, sellPrice: 0 },
            {name:'BCH', buyPrice: 0, sellPrice: 0 },
            {name:'ETH', buyPrice: 0, sellPrice: 0 }
        ];*/
    }

    /*
    getMoeda() {
        return this.currency;
    }*/

}

module.exports = CorretoraClass