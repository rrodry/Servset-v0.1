require('dotenv').config();
const { Router } = require('express')
const axios = require('axios')
const { Servicios, Users, Planillas } = require('../db');
const router = Router();
const { SECRET } = require('../config')
const { getAccessInfo, putCookie } = require('./middle.js');
const cookieParser = require('cookie-parser');
const { ok } = require('assert');
const { stringify } = require('querystring');
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
            where:{
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
        const planilla = req.body
        const saveJ = JSON.stringify(planilla)
        const save = Planillas.build({
            servicios: saveJ,
            dayTime: planilla.date,
            turno: planilla.turno,
            novedades: planilla.novedades
        })
        save.save()
        res.send(planilla)

    } catch (error) {
        console.log(error.message);
    }
})

router.get('/decode', (req, res) => {
    try {
        const {token} = req.query
    res.send(jwt.verify(token,SECRET))
    } catch (error) {
        console.log(error.message);
    }
})

router.get('/getServOld', async (req, res) => {

    try {
        const currentDay = new Date()
        const hora = currentDay.getHours()
        const minutos = currentDay.getMinutes()
        const planillasTurno = await Planillas.findAll()
        let planillasDia = []
        if( hora >= 6 & minutos > 0 & hora < 8 & minutos <= 59 ){
            planillasDia = []
            const arrSend = []
            for (let i = 0; i <= 3; i++) {
                arrSend.push(JSON.parse(planillasTurno[i].servicios))
            }
            res.send(arrSend)
        }else{
            planillasDia = []
            planillasTurno.map( e =>{
                const jsonServ = JSON.parse(e.servicios)
                let diaServ = 0
                //De 6-8
                // Demas turnos
                if( currentDay.getDate() === jsonServ.date & jsonServ.turno !== "noche"){
                    planillasDia.push(jsonServ)
                }
                //En turno noche descuendo un dia al actual
                if ( hora >= 0 & minutos > 0 & hora <= 6 & minutos <= 59 ){
                    if (currentDay.getDate()-1 === jsonServ.date && jsonServ.turno !== "noche" ) {
                        planillasDia.push(jsonServ)
                    }
                }
            })
            res.send(planillasDia)
        }
    } catch (error) {
        console.log(error.message);
    }
})
module.exports = router;
