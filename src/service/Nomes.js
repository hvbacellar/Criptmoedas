module.exports  = (apelido) => {
    let ret = '';
    switch(apelido) {
        case 'BTC':
            ret = 'bitcoin';
            break;
        case 'LTC':
            ret = 'litecoin';
            break;         
        case 'BCH':
            ret = 'bitcoincash';
            break;               
        case 'ETH':
            ret = 'ethereum';
            break;
        case 'MBC':            
            ret = 'mercado bitcoin';
            break;
        case 'BRB':
            ret = 'brasil bitcoin';
            break;
        case 'BCT':
            ret = 'bitcoin trade';
            break;
        case 'FIN':
            ret = 'bitfinex';
            break;
        case 'NVD':
            ret = 'novadax';
            break;
        default:
            ret = '';
            break;            
    }
    return ret;
}