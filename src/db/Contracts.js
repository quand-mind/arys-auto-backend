import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import sql from "mssql";

const sqlConfig = {
    user: process.env.USER_BD,
    password: process.env.PASSWORD_BD,
    server: process.env.SERVER_BD,
    database: process.env.NAME_BD,
    requestTimeout: 60000,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

let allContracts = []
let contractsRender = []

const Search = sequelize.define('suVcontratos', {});
const Receipts = sequelize.define('surecibo', {}, {tableName: 'surecibo'});
const SearchCompany = sequelize.define('macompania', {});
const Contract = sequelize.define('sucontratoflota', {}, { tableName: 'sucontratoflota' });
const Detail = sequelize.define('suVcontratos', {
  ccontratoflota: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: true,
  },
});

const TypeService = sequelize.define('maVtiposerpl', {}, { tableName: 'maVtiposerpl' });
const Propietary = sequelize.define('suVpropietario', {  
  ccontratoflota: {
  type: Sequelize.INTEGER,
  primaryKey: true,
  allowNull: true,
},}, { tableName: 'suVpropietario' });
const Vehicle = sequelize.define('suVpropietario', {  
  ccontratoflota: {
  type: Sequelize.INTEGER,
  primaryKey: true,
  allowNull: true,
},}, { tableName: 'suVpropietario' });


const searchContracts = async (body, idcompania) => {
  try {
    let contract;
    let contractList = []
    if (idcompania != 1) {
      if (!body.ccompania) {
        body.ccompania = idcompania;
      }
    }
    contract = await Search.findAll({
      where: body,
      attributes: ['ccontratoflota', 'xnombre', 'xapellido', 'xplaca', 'xmarca', 'xmodelo', 'xversion', 'ccompania', 'xestatusgeneral', 'xcompania'],
      order: [['ccontratoflota', 'ASC']], // Ordenar por ccontratoflota en orden ascendente
    });

    let contracts = contract.map((item) => item.get({ plain: true }));
    contracts.forEach((item) => {
      contractList.push({
          ccontratoflota: item.ccontratoflota,
          xnombre: item.xnombre + ' ' + item.xapellido,
          xvehiculo: item.xmarca,
          xplaca: item.xplaca,
          xmarca: item.xmarca,
          xmodelo: item.xmodelo,
          xversion: item.xversion,
          ccompania: item.ccompania,
          xcompania: item.xcompania,
          xestatusgeneral: item.xestatusgeneral,
      });
  })
    allContracts = contractList
    contractsRender = contractList
    return contractList.length;
  } catch (error) {
    return { error: error.message };
  }
};



const searchContractsByPage = async (page, records) => {
  const pageBegin = parseInt(page) * parseInt(records)
  const searchedAll = contractsRender.slice(pageBegin, pageBegin + parseInt(records) )
  return searchedAll
}
const searchContractsByText = async (text) => {
  if(text) {

    contractsRender = allContracts.filter(item => {
      let values = Object.values(item)
      values.shift()
      const valueFinded = values.find(value => {
        if(typeof value == 'string'){
          if (value.toLowerCase().includes(text.toLowerCase())){
            return value
          }
        } else if(typeof value == 'number') {
          const valueString = value.toString()
          if (valueString.toLowerCase().includes(text.toLowerCase())){
            return value
          }
        }
      })
      if (valueFinded) return item
    })
  } else {
    contractsRender = allContracts
  }
  return contractsRender
}

const getContractsByUser = async (cusuario) => {
  try {
    let contract = await Search.findAll({
        where: {cusuario: cusuario},
        attributes: ['ccontratoflota', 'xnombre', 'xapellido', 'xplaca', 'xmarca', 'xmodelo', 'xversion', 'ccompania', 'xestatusgeneral', 'xcompania'],
        order: [['ccontratoflota', 'ASC']], // Ordenar por ccontratoflota en orden ascendente
      });
    
    let contracts = contract.map((item) => item.get({ plain: true }));
    return contracts;
  } catch (error) {
    return { error: error.message };
  }
};
const getReceiptsByContract = async (ccontratoflota) => {
  try {
    let pool = await sql.connect(sqlConfig);
    let result = await pool.request().query(`
      SELECT SURECIBO.*, MAESTATUSGENERAL.XESTATUSGENERAL
      FROM SURECIBO INNER JOIN
      MAESTATUSGENERAL ON SURECIBO.CESTATUSGENERAL = MAESTATUSGENERAL.CESTATUSGENERAL WHERE ccontratoflota = ${ccontratoflota}
      `)
    let j = 0
    for (const record of result.recordset) {
        const keys = Object.keys(record)
        const values = Object.values(record)
        let resultLowerCase = {}
        let i = 0
        for (const key of keys) {
            const lowerKey = key.toLowerCase()
            resultLowerCase[lowerKey] = values[i]
            i++
        }
        result.recordset[j] = resultLowerCase
        j++ 
    };
    await pool.close();
    return result.recordset;
  } catch (error) {
    return { error: error.message };
  }
};



const searchPropietary = async (searchPropietary) => {
  try {
    const propietary = await Propietary.findOne({
      where: {
        xcedula: searchPropietary.xrif_cliente
      },
      attributes: ['xnombre', 'xapellido', 'xtelefonocasa', 'xemail', 'cestado', 'cciudad', 'xdireccion'],
    });

    return propietary ? propietary.get({ plain: true }) : null;
  } catch (error) {
    return { error: error.message };
  }
};

const searchVehicle = async (searchVehicle) => {
  try {
    const vehiculo = await Vehicle.findAll({
      where: {
          xplaca: searchVehicle.xplaca,
          cestatusgeneral: {
            [Sequelize.Op.ne]: 3,
          },
        },
      attributes: ['ccontratoflota'],
    });
    const vehicle = vehiculo.map((item) => item.get({ plain: true }));
    return vehicle;
  } catch (error) {
    return { error: error.message };
  }
};

const typeServicePlan = async (typeServicePlan) => {
  try {
    const service = await TypeService.findAll({
      where: {
        id_plan: typeServicePlan.cplan
      },
      attributes: ['cplan', 'ctiposervicio', 'xtiposervicio'],
    });
    const type = service.map((item) => item.get({ plain: true }));
    return type;
  } catch (error) {
    return { error: error.message };
  }
};

const createMembership = async (createMembership) => {
  console.log(createMembership.cplan)
  try {
      let xcliente = createMembership.xnombre + ' ' + createMembership.xapellido
      let pool = await sql.connect(sqlConfig);
      let result = await pool.request()
        .input('icedula', sql.NVarChar, createMembership.icedula)
        .input('xcedula', sql.NVarChar, createMembership.xcedula)
        .input('xnombre', sql.NVarChar, createMembership.xnombre)
        .input('xapellido', sql.NVarChar, createMembership.xapellido)
        .input('xcliente', sql.NVarChar, xcliente)
        .input('irif_cliente', sql.NVarChar, createMembership.icedula)
        .input('xrif_cliente', sql.NVarChar, createMembership.xcedula)
        .input('xtelefono1', sql.NVarChar, createMembership.xtelefono_emp)
        .input('email', sql.NVarChar, createMembership.email)
        .input('cestado', sql.Int, createMembership.cestado)
        .input('cciudad', sql.Int, createMembership.cciudad)
        .input('xdireccionfiscal', sql.NVarChar, createMembership.xdireccion)
        .input('xplaca', sql.NVarChar, createMembership.xplaca)
        .input('id_inma', sql.Int, createMembership.id_inma)
        .input('ccolor', sql.Int, createMembership.ccolor)
        .input('xserialcarroceria', sql.NVarChar, createMembership.xserialcarroceria)
        .input('xserialmotor', sql.NVarChar, createMembership.xserialmotor)
        .input('fdesde', sql.DateTime, createMembership.fdesde)
        .input('fhasta', sql.DateTime, createMembership.fhasta)
        .input('cplan', sql.Int, createMembership.cplan)
        .input('cmetodologiapago', sql.Int, createMembership.cmetodologiapago)
        // .input('cuso', sql.Int, createMembership.cuso)
        .input('cpais', sql.Int, createMembership.cpais)
        .input('cestatusgeneral', sql.Int, 13)
        .input('ccompania', sql.Int, createMembership.ccompania)
        .input('cusuario', sql.Int, createMembership.cusuario)
        .query(`
            INSERT INTO TMSUSCRIPCION_SERVICIOS (
                icedula, xcedula, xnombre, xapellido, xcliente, xtelefono1, irif_cliente, email, cestado,
                xrif_cliente, cciudad, xdireccionfiscal, xplaca, id_inma, ccolor, xserialcarroceria,
                xserialmotor, cplan, cmetodologiapago, cpais, fdesde, fhasta,
                ccompania, cestatusgeneral, cusuariocreacion
            )
            VALUES (
                @icedula, @xcedula, @xnombre, @xapellido, @xcliente, @xtelefono1, @irif_cliente, @email, @cestado,
                @xrif_cliente, @cciudad, @xdireccionfiscal, @xplaca, @id_inma, @ccolor, @xserialcarroceria,
                @xserialmotor,  @cplan, @cmetodologiapago, @cpais, @fdesde, @fhasta,
                @ccompania, @cestatusgeneral, @cusuario
            );
        `);
          await pool.close();
      return { result: result };
  }
  catch (error) {
    console.log(error.message)
      return { error: error.message };
  }
}

const searchContractIndividual = async () => {
  try {
    const maxContract = await Contract.findOne({
      attributes: ['ccontratoflota'],
      order: [['ccontratoflota', 'DESC']],
      limit: 1,
    });
    return maxContract ? maxContract.get({ plain: true }) : null;
  } catch (error) {
    return { error: error.message };
  }
};

const detailMembership = async (detailMembership) => {
  try {
    const contract = await Detail.findOne({
      where: {
        ccontratoflota: detailMembership.ccontratoflota,

      },
      attributes: [
        'cpropietario',
        'cvehiculopropietario',
        'xnombre',
        'xapellido',
        'xplaca',
        'xmarca',
        'xmodelo',
        'xversion',
        'ccontratoflota',
        'fano',
        'xcolor',
        'xserialcarroceria',
        'xserialmotor',
        'fdesde',
        'fhasta',
        'xmoneda',
        'cplan',
        'xplan',
        'xestatusgeneral',
        'xclasificacion',
        'icedula',
        'xcedula',
        'xtelefono',
        'xdireccion',
        'xcorreo',
      ],
    });
    return contract ? contract.get({ plain: true }) : {};
  } catch (error) {
    console.log(error.message)
    return { error: error.message };
  }
};

const detailMembershipService = async (detailMembershipService) => {

  try {
    const service = await TypeService.findAll({
      where: {
        id: detailMembershipService
      },
      attributes: [
                    [Sequelize.literal('DISTINCT ctiposervicio'), 'ctiposervicio'],
                    'cplan', 
                    'xtiposervicio'
                  ],
    });
    const type = service.map((item) => item.get({ plain: true }));
    return type;
  } catch (error) {
    console.log(error.message)
    return { error: error.message };
  }
};

export default {
  searchContractsByText,
  searchContractsByPage,
  searchContracts,
  searchPropietary,
  searchVehicle,
  typeServicePlan,
  createMembership,
  searchContractIndividual,
  detailMembership,
  detailMembershipService,
  getContractsByUser,
  getReceiptsByContract
}