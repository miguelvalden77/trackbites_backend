const router = require("express").Router()
const isAuth = require("../middlewares/isAuth")
const Product = require("../models/Product.model")


router.post("/create", isAuth, async (req, res, next) => {

    const { name, price, description, category } = req.body

    if (!name || !price || !description || !category) {
        res.status(400).json({ errorMessage: "Debes rellenar todos los campos" })
        return
    }

    try {

        await Product.create({ name, price, description, category })

        res.json({ succesMessage: "Producto creado" })
    }
    catch (err) {
        console.log(err)
    }

})

router.get("/:id/oneProduct", async (req, res, next) => {
    const { id } = req.params

    try {
        const product = await Product.findById(id)
        res.json(product)
    }
    catch (err) {
        console.log(err)
    }

})

router.get("/:category", async (req, res, next) => {

    const { category } = req.params

    try {
        const products = await Product.find({ category })

        res.json(products)
    }
    catch (err) {
        console.log(err)
    }

})


router.post("/:id/update", isAuth, async (req, res, next) => {

    const { id } = req.params
    const { name, description, price, category } = req.body

    if (!name || !description || !price || !category) {
        res.json({ errorMessage: "Deben rellenarse todos los campos" })
        return
    }

    try {
        await Product.findByIdAndUpdate(id, { name, description, price, category })

        res.json({ succesMessage: "Producto actualizado" })
    }
    catch (err) {
        console.log(err)
    }

})

router.delete("/:id/delete", isAuth, async (req, res, next) => {

    const { id } = req.params

    try {
        await Product.findByIdAndDelete(id)
        res.json({ succesMessage: "Producto borrado" })
    }
    catch (err) {
        console.log(err)
    }

})


module.exports = router