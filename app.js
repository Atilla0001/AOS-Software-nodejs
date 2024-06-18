const  { MongoClient, ObjectId } = require('mongodb');
const express = require('express')
const { connectTodb, getDb } = require('./db')
const app = express()
app.use(express.json())



let db;

connectTodb((err) => {
    if (!err) {
        app.listen(3000, () => {
            console.log("Uygulama 3000. portta çalisiyor")
        })
        db = getDb()
    }
})




app.get('/api', (req, res) => {
    let kitaplar = [];
    db.collection('kitaplar')
        .find()
        .sort({ yazarAd: -1 })
        .forEach(kitap => kitaplar.push(kitap))
        .then(
            () => {
                res.status(200).json(kitaplar)
            }
        )
        .catch(
            () => {
                res.status(500).json({ hata: 'Verilere erisilemedi' })
            }
        )
})


app.post('/api', (req, res) => {
    const kitap = req.body;

    db.collection('kitaplar')
    .insertOne(kitap)
    .then(sonuc=>{
        res.status(201).json(sonuc)
    })
    .catch(err=>{
        res.status(500);json({hata:"veri eklenemedi"})
    })
})


app.delete('/api/:id', (req,res)=>{
    if(ObjectId.isValid(req.params.id)){
        db.collection('kitaplar')
        .deleteOne({_id:ObjectId(req.params.id)})
        .then(sonuc=>{
            res.status(200).json(sonuc)
        })
        .catch(err=>{
            res.status(500).json({hata:"veri silinemedi"})
        })
    }else{
        res.status(500).json({hata:'ID gecerli degil'})
    }
})



app.get('/api/:id', (req,res)=>{
    if(ObjectId.isValid(req.params.id)){
        db.collection('kitaplar')
        .findOne({_id:ObjectId(req.params.id)})
        .then(sonuc=>{
            res.status(200).json(sonuc)
        })
        .catch(err=>{
            res.status(500).json({hata:"veriye erisilemedi"})
        })
    }else{
        res.status(500).json({hata:'ID gecerli degil'})
    }
})


app.patch('/api/:id', (req,res)=>{
const guncellenecekVeri=req.body;


    if(ObjectId.isValid(req.params.id)){
        db.collection('kitaplar')
        .updateOne({_id:ObjectId(req.params.id)},{$set:guncellenecekVeri})
        .then(sonuc=>{
            res.status(200).json(sonuc)
        })
        .catch(err=>{
            res.status(500).json({hata:"Data is not updated"})
        })
    }else{
        res.status(500).json({hata:'ID gecerli degil'})
    }
})


