const express =require('express');
const mongoose =require('mongoose');
const dotenv =require('dotenv').config();
const cors =require('cors');
const authController = require('./controllers/authController');
const blogController = require('./controllers/blogController');
const multer = require('multer')

const app =express();
//connect db
// mongoose.set('strictQuery',false)
// mongoose.connect(process.env.MONGO_URL,()=>console.log("mongodb has been successfully started"))

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB!');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

const db = mongoose.connection;

db.once('open', () => {
  console.log('Connection to MongoDB is open!');
});

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
//routes
app.use('/images', express.static('public/images'))


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/auth',authController);
app.use('/blog',blogController);

//multer
const storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,"public/images")
  },
  filename:function(req,file,cb){
    cb(null,req.body.filename)
  },
})
const upload= multer({
  storage:storage
})

app.post('/upload',upload.single("image"),async(req,res)=>{
  return res.status(200).json({msg:"Successfully uploaded"})
})
//connect server
app.listen(process.env.PORT,()=>console.log("server has been successfully started"))

