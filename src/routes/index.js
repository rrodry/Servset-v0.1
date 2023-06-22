require('dotenv').config();
const { Router } = require('express')
const { Servicios, Users, Planillas } = require('../db');
const router = Router();
const { SECRET } = require('../config')
const { getAccessInfo, putCookie } = require('./middle.js');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')

router.use(cookieParser())
router.get("/login", async (req, res) => {
    const { user, pass } = req.query
    try {
        const usersBd = await Users.findAll({
            where: {
                usuario: user,
                password: pass
            }
        })
        const userinfo = usersBd[0]
        userinfo['password'] = null
        res.status(200).send(getAccessInfo(userinfo.dataValues))

    } catch (error) {
        res.status(401).json({ msg: "Usuario no registrado", error: error.message })
    }
})
router.get("/services", async (req, res) => {
    try {
        const resServ = await Servicios.findAll()
        const json = []
        resServ.map(e => {
            json.push({
                servicios: e.servicios,
                movil: e.movil
            })
        })
        res.json(json).status(200)
    } catch (error) {
        res.status(500)
    }
})
router.post('/increment', async (req, res) => {
    const { movil, iod } = req.query
    const servOld = await Servicios.findOne({
        where: {
            movil: movil
        }
    })

    if (iod == "true") {
        servOld.servicios += 1
        await servOld.save('servicios')
        res.send({
            msg: `Agregado 1 Servicio a ${movil}`,
            data: servOld
        })
    } else {
        servOld.servicios -= 1
        await servOld.save('servicios')
        res.send({
            msg: `Quitado 1 Servicio a ${movil}`,
            data: servOld
        })
    }
})
router.post('/addMovil', async (req, res) => {

    try {
        const { movilAdd } = req.query
        if (movilAdd !== "") {
            const [user, create] = await Servicios.findOrCreate({
                where: {
                    movil: movilAdd
                },
                defaults: {
                    servicios: 0
                }
            })
            create ? res.send({
                msg: "Base Creada",
                movil: user
            }) :
                res.send("Base ya disponible en grilla")
        } res.send({ msg: "Campo vacio" }).status(400)
    } catch (error) {
        res.status(500)
    }
})
router.delete('/deleteBase', async (req, res) => {
    try {
        const { movil } = req.query

        await Servicios.destroy({
            where: {
                movil: movil
            },
            force: true
        })
        res.send("Base Elmininada")
    } catch (error) {
        res.status(500)
    }
})
router.post('/endShift', async (req, res) => {
    try {
        let currentDay = new Date()
        let hour = currentDay.getHours()
        let planilla = req.body
        if(hour > 6 && hour <= 7 ){
            planilla.turno = "mañana2"
        }
        const saveJ = JSON.stringify(planilla)
        let  [planillaCreate, created ] = Planillas.findOrCreate({
            where: {
                turno: planilla.turno,
                dayTime: planilla.date
            },
            defaults: {
                servicios: saveJ,
                dayTime: planilla.date,
                novedades: planilla.novedades,
                turno: planilla.turno,
                
            }
        })
        created ? res.send(planilla) : res.send("ya creado");

    } catch (error) {
        res.send(error.message)
    }
})
router.get('/decode', (req, res) => {
    try {
        const { token } = req.query
        res.send(jwt.verify(token, SECRET))
    } catch (error) {
        console.log(error.message);
    }
})
router.get('/getServOld', async (req, res) => {

    try {
        let currentDay = new Date()
        const hora = currentDay.getHours()
        let diaActual = currentDay.getDate()
        if( hora >= 0 && hora <= 8){
            diaActual--
        }
        const serv = await Planillas.findAll({
            where: {
                dayTime: diaActual
            }
        })
        const arrToSend = []
        serv.map( e => {
            arrToSend.push(JSON.parse(e.servicios))
        })
        res.send(arrToSend)
    } catch (error) {
        console.log(error.message);
    }
})
router.post("/signUp", async (req, res) => {
    try {
        const { usuario, password, nombre, apellido, turno } = req.query
        await Users.findOrCreate({
            where: {
                usuario: usuario
            },
            defaults: {
                usuario: usuario,
                password: password,
                nombre: nombre,
                apellido: apellido,
                turno: turno
            }
        })
        res.send("Creado")
    } catch (error) {
        console.log(error.message);
    }
})
router.get("/testPlan", async (req, res) => {
    const planilla = await Planillas.findAll()
    const json = JSON.parse(JSON.stringify(planilla))
    res.send(planilla)
})
router.post("/resetList", async (req, res) => {
    try {
        const basePred = ["Nores", "Escardo", "Troncos", "UTN", "Odontologico", "Hdi Torcuato", "Norlog", "Ricardo Rojas", "Hdi Benavidez", "Dique Lujan", "Rincon", "1R Torcuato", "1R Troncos"]
        basePred.map(async (e) => {
            await Servicios.destroy({
                where:{
                    movil:e
                }
            })
            await Servicios.create({
                movil: e,
                servicios: 0
            })
        })
    } catch (error) {
        console.log(error.message);
    }
})
router.get("/adminPanelAll", async (req,res) => {
    const planillas =  await Planillas.findAll()
    const arr = []
    planillas.map( (e) => {
        const serv = JSON.parse(e.servicios)
        arr.push({
            servicios: serv.state,
            dia: e.dayTime,
            turno: e.turno
        })
    })
    res.send(arr)
})

module.exports = router;
