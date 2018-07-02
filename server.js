const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId; 

var db

MongoClient.connect('mongodb://localhost:27017/hospital', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('patients').find().toArray((err, result) => {
    if (err) return console.log(err)
    
    
    res.render('index.ejs', {patients: result})
  })
})
//get details of the patient's next-of-kin
app.get('/details/:_id', (req, res) => {
  let id = req.params._id;
  db.collection('patients').find(ObjectId(id)).toArray((err, result) => {
    if (err) return console.log(err)
    res.render('details.ejs', {patient: result[0]});
  })
})

//get details of the ward
app.get('/ward/:ward_id', (req, res) => {
  let id = req.params.ward_id;
  db.collection('wards').findOne({_id: id}, function(err, result){
    if (err) return console.log(err)
    res.render('wards.ejs', {result});
  })
})


// creating a new patient + changing the form for saving next-of-kin as an embedded document in patient doc
app.post('/patients', (req, res) => {
  let body = req.body,
      patient = {},
      nextOfKin = {};
      
      patient.name = body.name;
      patient.type = body.type;
      patient.ward_id = body.ward_id;
      patient.date_registr = body.date_registr;
      
      nextOfKin.name = body.NoKname;
      nextOfKin.relation = body.relation;
      nextOfKin.tel = body.tel;
    
      patient.next_of_kin = nextOfKin;
    

  db.collection('patients').save(patient, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})
// update patient's info
app.put('/update-patients', (req, res) => {
  db.collection('patients')
  .findOneAndUpdate({name: ''}, {
    $set: {
      name: '',
      type: '',
      ward_id: ''
    }
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

//app.delete('/delete-patient', (req, res) => {
  //db.collection('patients').findOneAndDelete({_id: req.body._id}, (err, result) => {
    //if (err) return res.send(500, err)
    //console.log('deleted')
    //res.send('patient has been deleted')
  //})
//})
