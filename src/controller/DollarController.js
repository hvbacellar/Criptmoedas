const Dollar   = require('../model/Dollar');
//const vectors = require('../model/Vectors');

module.exports = {
   
    async store(req, res) {

        //const hoje = new Date("2020-02-18");       
        /*
        const hoje = new Date();
        const dia = 24 * 60 * 60 * 1000;  // Valor de 1 dia em timestamp.        

        const userExists2 = await Dollar.findOne({createdAt : {$gt: hoje - dia}});        

        console.log('meu ovo:' + userExists2);

        if(userExists2) {
            console.log('ja existe');
            return userExists2;
        }
        */
       
        //const {name, bio, avatar_url: avatar } = response.data;

        const dollar = await Dollar.create({
            valor: req
        })
        gCM['dollar'] = dollar.valor;
        return dollar;
    }
};