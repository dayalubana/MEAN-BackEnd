var express = require('express')
var app = express();
var CategoryModel = require('../models/category')
var ProductModel = require('../models/product')
var multer = require('multer');
var path = require('path')
var MIME_TYPES = {
    'image/png':'png',
    'image/jpeg':'jpg',
    'image/jpg':'jpg'
}
var storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        var isValid = MIME_TYPES[file.mimetype];
        req.daya = path.join(__dirname,'../images');
        if(isValid){
            cb(null,path.join(__dirname,'../images'));
        } else {
            cb(new Error('invalid mime type'),path.join(__dirname,'../images'));
        }
    },
    filename: (req,file,cb)=>{
        var name = file.originalname.toLocaleLowerCase().split('.')[0];
        var actualname = name+'-'+Date.now()+'.'+MIME_TYPES[file.mimetype];
        req.name = actualname
        cb(null,actualname);
    }
})

app.post('/addproduct', multer({storage:storage}).single('image'), (req,res)=>{
  const url = req.protocol + '://'+ req.get("host");  
  const product = ProductModel.create({
    title: req.body.title,
    content: req.body.content,
    price: req.body.price,
    category: req.body.category,
    imagePath: url + "/images/"+req.name
  });
  var data = {  
    ...product,
    id: product._id
  }  
  res.status(201).json(data);
})

app.post('/updateproduct', multer({storage:storage}).single('updatedimage'), (req,res)=>{
  const url = req.protocol + '://'+ req.get("host");  
  console.log(req.body);
  ProductModel.updateOne({_id:req.body.id},{
    title: req.body.title,
    content: req.body.content,
    price: req.body.price,
    category: req.body.category,
    imagePath: url + "/images/"+req.name
  },(err,info)=>{
    if(err){
      res.status(400).json(err);
    } else{
      res.status(200).json(info);
    }
  });
})

app.post('/removeProduct',(req,res)=>{
  const {_id} = req.body;
  ProductModel.deleteOne({_id:_id},(err,info)=>{
    if(err){
      res.status(400).json(err);
    } else{
      res.status(200).json(info);
    }
  });
})
app.post('/getproduct',(req,res)=>{
  const {id} = req.body;
  ProductModel.findOne({_id:id},(err,info)=>{
    if(err){
      res.status(400).json(err);
    } else{
      res.status(200).json(info);
    }
  });
})

app.get('/getproducts', async (req,res)=>{
  const products = await ProductModel.find();
  console.log(products);
  res.status(201).json(products);
})

app.post('/addcategory',async (req,res)=>{
    try{
        const name = req.body.name;
        console.log(name);
        if (!name) {
          res.json({message:"All input is required",status:400});
        }
    
        const nameExist = await CategoryModel.findOne({ name });
    
        if (nameExist) {
          return res.json({message:"Category Already Exist",status:400});
        }
        const category = await CategoryModel.create({
          name
        });
        res.status(201).json(category);
    } catch(err){
        console.log('222222222222');
        res.status(400).json(err);
        }
    }
)

app.get('/getcategories',(req,res)=>{
  CategoryModel.find((err,info)=>{
    if(err){
      res.status(400).json(err);
    } else{
      res.status(200).json(info);
    }
  });
})

app.post('/removeCategory',(req,res)=>{
  const {_id} = req.body;
  CategoryModel.deleteOne({_id:_id},(err,info)=>{
    if(err){
      res.status(400).json(err);
    } else{
      res.status(200).json(info);
    }
  });
})

app.post('/updateCategory',(req,res)=>{
  const {id,name} = req.body;
  CategoryModel.updateOne({_id:id},{name:name} ,(err,info)=>{
    if(err){
      res.status(400).json(err);
    } else{
      res.status(200).json(info);
    }
  });
})

module.exports = app;