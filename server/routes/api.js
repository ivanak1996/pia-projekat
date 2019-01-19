const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');
const Package = require('../models/package');
const Company = require('../models/company');
const JobOffer = require('../models/jobOffer');

const mongoose = require('mongoose');
const db = "mongodb://localhost:27017/jobfair";

mongoose.connect(db, err => {
    if(err) {
    console.error('Error!' + err);
} else{
    console.log('API connected to mongodb!');
}
});

function verifyToken(req, res, next){
    if(!req.headers.authorization) {
        return res.status(401).send('Unauthorized request!')
    }
    let token = req.headers.authorization.split(' ')[1];
    if(token === 'null'){
        return res.status(401).send('Unauthorized request');
    }
    let payload = jwt.verify(token, 'secretKey');
    if(!payload) {
        return res.status(401).send('Unauthorized request');
    }
    req.userId = payload.subject;
    next();
}

router.get('/', (req, res) => {
    res.send('From API route');
});

router.post('/register', (req, res) => {
    let body = req.body;
    var user;

    /*User.findOne({username: body.username}, (error, user) => {
        if(!error){
            res.status(401).send('Username already taken');
            return;
        }
    });

    User.findOne({email: body.email}, (error, user) => {
        if(!error){
            res.status(401).send('Email already taken');
            return;
        }
    });*/
    
    if(body.userType === 'student'){
        user = new User({
            role: 1,
            username: body.username,
            password: body.password,
            email: body.email,
            name: {
                first: body.firstName,
                last: body.lastName
            },
            student: {
                yearOfStudies: body.year,
                university: body.university
            }
        });

    } else {
        user = new User({
            role: 2,
            username: body.username,
            password: body.password,
            email: body.email,
            name: {
                first: body.ceoFirstName,
                last: body.ceoLastName
            },
            company: {
                name: body.companyName,
                address: body.companyAddress,
                city: body.city,
                pib: body.pib,
                numberOfEmployees: body.numberOfEmployees,
                expertise: body.expertise
            }
        });

    }
    
    user.save((error, registeredUser) => {
        if(error){
            console.log(error);
        } else {
            let payload = { subject: registeredUser._id }
            let token = jwt.sign(payload, 'secretKey');
            res.status(200).send({token, user: registeredUser});
        }

    });
});

router.post('/login', (req, res) => {
    let userData = req.body;
    User.findOne({username: userData.username}, (error, user) => {
        if(error) {
            console.log('error');
        } else{
            if(!user){
                res.status(401).send('Invalid username')
            } else{
                if (user.password !== userData.password){
                    res.status(401).send('Invalid password');
                } else { 
                    let payload = { subject: userData._id }
                    let token = jwt.sign(payload, 'secretKey');  
                    res.status(200).send({token, user});
                }
            }
        }
    })
});

router.post('/jobOffer', (req, res) => {
    jobOffer = new JobOffer(req.body);
    jobOffer.save((error, offer) => {
        if(error){
            console.log(error);
        } else {
            res.status(200).send({offer});
        }
    });
});

router.post('/apply', (req, res) => {
    var username = req.body.username;
    var jobId = req.body.jobId;

    JobOffer.findOne({'_id':jobId}, (error, offer) => {
        if(error){
            console.log(error);
        } else {
            if(!offer.appliedStudents.includes(username)){
                offer.appliedStudents.push(username);
                offer.save();
            }
            res.status(200).send({offer});
        }
    });
});

router.get('/companies', (req, res) => {
    Company.find({'role': 2}, (err, companies) => {
        if(err) console.log(err);
        else{
            res.json(companies);
        }
    });
    /*let companies = [
        {
            "Name": "Ubisoft",
            "CEO": "Luka Klar",
            "ImageURL": "data:image/png;base64,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",
            "NumberOfEmployees": 150,
            "City": "Belgrade",
            "Website": "https://www.ubisoft.com/en-us/"
         },
         {
            "Name": "Microsoft",
            "CEO": "Bili Gejc",
            "ImageURL": "data:image/jpeg;base64,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",
            "NumberOfEmployees": 1200,
            "City": "LA",
            "Website": "https://www.microsoft.com/"
         },
         {
            "Name": "GET",
            "CEO": "Ivana Krstic",
            "ImageURL": "https://s3-us-west-2.amazonaws.com/ogledalofirme-images/3938d8aa-9a10-456f-a69e-7af5fea405c0-extent-thumbnail.jpg",
            "NumberOfEmployees": 180,
            "City": "NBG",
            "Website": "http://www.global-engineering-technologies.com/"
         },
         {
            "Name": "Facebook",
            "CEO": "Cukemberg",
            "ImageURL": "https://www.facebook.com/images/fb_icon_325x325.png",
            "NumberOfEmployees": 2000,
            "City": "New York",
            "Website": "https://www.facebook.com"
         }
    ];

    res.json(companies);*/
});

router.get('/jobOffers', (req, res) => {
    
    JobOffer.find({}, (err, offers) => {
        if(err) console.log(err);
        else{
            res.json(offers.sort((a, b) => new Date(a.openUntil).getTime() - new Date(b.openUntil).getTime()));
        }
    });
});

router.get('/jobOffersForCompany/:name', (req, res) => {
    
    JobOffer.find({"companyName":req.params.name}, (err, offers) => {
        if(err) console.log(err);
        else{
            res.json(offers);
        }
    });
});

router.get('/company/:name', (req, res) => {
    
    Company.findOne({"company.name":req.params.name}, (err, company) => {
        if(err) console.log(err);
        else{
            res.json(company);
        }
    });
});

router.get('/jobOffer/:id', (req, res) => {
    
    JobOffer.findOne({"_id":req.params.id}, (err, offer) => {
        if(err) console.log(err);
        else{
            res.json(offer);
        }
    });
});

router.get('/packages', verifyToken, (req, res) => {
    
    Package.find({}, (err, packages) => {
        if(err) console.log(err);
        else{
            res.json(packages);
        }
    });
});

module.exports = router;
