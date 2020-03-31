import mongoose, { Mongoose, Types, Document } from "mongoose"
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ISubmission, ISymptoms, IMedic, IConclusion, IService }from "../types/Types";
import { Medic } from "../models/Medic";
import { Submission } from "../models/Submission";
import { Service } from "../models/Service";

const { auth, requiresAuth } = require('express-openid-connect');


const options = {
	autoIndex: true, // build indexes
	poolSize: 10, // Maintain up to 10 socket connections
	// If not connected, return errors immediately rather than waiting for reconnect
	bufferMaxEntries: 0,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,

};

mongoose.connect(process.env.MONGODB_URI, options);


const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRIDAPIKEY);



module.exports = (app : any) => {
  /* GET home page. */
  app.get("/", async function(req : any, res : Response, next: NextFunction) {
    res.render("index", { authenticated: req.isAuthenticated() })
  })

  app.post("/validate/isduplicate", async function(req : Request, res : Response, next: NextFunction) {
    try {
      const duplicate : any = await Submission.findOne({
        Identification: req.body.Identification
      })
      if (duplicate) {
        return res.status(200).json(duplicate.Date);
      } else {
        return res.status(200).json(false);
      }
    } catch(err) {
      console.log(err);
      return res.status(500).json(err)
    }
  })

  app.get('/form', requiresAuth(), async function(req : Request, res : Response, next: NextFunction) {
    let medicModels = await Medic.find({});
    let medics = medicModels.map((medicModel : IMedic) => medicModel.name)
    let servicesModels = await Service.find({});
    let services = servicesModels.map((serviceModel : IService) => serviceModel.name)

    const symptoms = ISymptoms;
    res.render('form', { 
      redirected: req.query.redirected,
      failure: req.query.failure,
      exists: req.query.exists,
      ACES: process.env.ACES, 
      medics: medics, 
      services: services,
      symptoms: symptoms, 
      footer1: process.env.FOOTER1, 
      footer2: process.env.FOOTER2, 
      footer3: process.env.FOOTER3 
    });
  });

  app.post("/submit", requiresAuth(), async function(req : Request, res : Response, next: NextFunction) {
    try {
      let emailToSend = null;
      let medicName = null;
      let serviceEmail = null;

      // if the sent family doctor is not "other"
      if (req.body.FamilyDoctor !== "outro") {
        // just find on the DB
        let medicModel : any = await Medic.findOne({ name: req.body.FamilyDoctor })
        
        // if not found, something is terribly wrong!
        if (!medicModel) {
          throw new Error();
        }

        let serviceModel : any = await Service.findOne({ name: medicModel.service })

        // assuming he's found, this is the relevant data
        emailToSend = medicModel.email
        medicName = medicModel.name
        serviceEmail = serviceModel.email
        
      } else {
        // if he's "other", maybe he's still on the DB
        // but under another email/name
        // but first we need to be sure the sent service exists on the DB
        const serviceModel : any = await Service.findOne({ name: req.body.Service })

        // otherwise something went TERRIBLY wrong!
        if (!serviceModel) {
          throw new Error()
        }
        serviceEmail = serviceModel.email

        // then we'll try to find the doctor using the supplied name/email
        const medicModel : any = await Medic.findOne({$or: [ {name: req.body.MedicName}, {email: req.body.MedicEmail}] })
        
        // if not found, that's because he really doesn't exist so we need to create it
        if (!medicModel) {
          await Medic.create({
            name: req.body.MedicName,
            email: req.body.MedicEmail,
            service: serviceModel.name
          })
  
          emailToSend = req.body.MedicEmail
          medicName = req.body.MedicName

        } else {
          emailToSend = medicModel.email
          medicName = medicModel.name
        }
        
        
      }

      let symptomEvolution : Array<string> = [];
      for (let symptom in ISymptoms) {
        if (req.body[symptom] === "on") {
          symptomEvolution.push(symptom)
        }
      }

      const submissionData = {
        Name: req.body.Name,
        Identification: req.body.Identification,
        FamilyDoctor: medicName,
        Address: req.body.Address,
        Phone: req.body.Phone,
        Email: req.body.Email,
        Clinical: {
          DateSymptomsStarted: req.body.DateSymptomsStarted,
          InitialSymptom: req.body.InitialSymptom,
          SymptomEvolution: symptomEvolution,
          OtherSymptoms: req.body.OtherSymptoms
        },
        Epidemiology: {
          TripHistory: req.body.TripHistory,
          ContactWithCovid: req.body.ContactWithCovid,
          DateOfContactCovid: req.body.DateOfContactCovid
        },
        Conclusion: req.body.Conclusion,
        Medic: req.body.Medic,
        Date: Date.now()
      }

      await Submission.create(submissionData)

      const msg = {
        to: emailToSend,
        cc: process.env.ENVIRONMENT === "production" ? serviceEmail : process.env.TEST_EMAIL,
        from: process.env.FROM_EMAIL,
        subject: 'Covid-19. Nova submissão',
        template_id: process.env.EMAILTEMPLATE,
        dynamic_template_data: submissionData
      };

      sgMail.send(msg);
      return res.redirect("/form?redirected=true");
 
    } catch (err) {
      console.log(err);
      if (err.code === 11000) {
        return res.redirect("/form?exists=true")
      } else {
        return res.redirect("/form?failure=true")
      }
    }
  });

}
