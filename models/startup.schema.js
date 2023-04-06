/* eslint-disable new-cap */
const mongoose = require('mongoose');
const allValidator = require('validator');

const startupUserSchema = new mongoose.Schema({
    // Personal Info--------------------------------
    fullName: {
        type: String,
        required: [true, 'FullName is required'],
        trim: true,
        maxLength: 40,
        minLength: 3,
    },

    email: {
        type: String,
        required: true,

        validate: {
            validator: allValidator.isEmail,
            message: (props) => `${props.value} is not valid i.e. not like example@example.com`,
        },
        trim: true,
    },
    secondaryEmail: {
        type: String,
       

        validate: {
            validator: allValidator.isEmail,
            message: (props) => `${props.value} is not valid i.e. not like example@example.com`,
        },
        trim: true,
    },

    personalPhone: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: allValidator.isMobilePhone,
            message: (props) => `${props.value} is not valid mobile number`,
        },
    },
    // professional Details------------------------------

    companyId: {
        type: Number,
        // required: true,
    },

    designation: {
        type: String,
        required: true,
        maxLength: 50,
        minLength: 3,
    },

    officePhone: {
        type: String,
        // required: true,
        trim: true,
        validate: {
            validator: allValidator.isMobilePhone,
            message: (props) => `${props.value} is not valid mobile number`,
        },
    },
    linkedIn: {
        type: String,
        // required: true,
        trim: true,
        validate: {
            validator: allValidator.isURL,
            message: 'linkedin link is not valid',
        },
    },
    // Account credentials----------------------------------------

    companyEmail: {
        type: String,
        required: true,
        // unique: true,
        validate: {
            validator: allValidator.isEmail,
            message: (props) => `${props.value} is not valid i.e. not like example@example.com`,
        },
        trim: true,
    },
    // profile settings-------------------------------------

    startupIcon: {
        type: String,
        trim: true,
    },
    startupName: {
        type: String,
        maxLength: 30,
    },
    startupSlogan: {
        type: String,
        maxLength: 300,
    },
    startupDescription: {
        type: String,
        maxLength: 650,
    },
    worksIn: {
        type: String,
        maxLength: 650,
    },
    domains: {
        type: [String],
    },
    homePageImages:[String],
    socialLinks: {
        Github: String,
        Linkedin: String,
        Instagram: String,
        Twitter: String,
    },
    //--------------------------------------------
    personalIds: {
        passport: {
            type: String,
        },

    drivingLicense: {
            type: String,
        },
    panCard: {
            type: String,
        },
    adharCard: {
            type: String,
        },
    },

    // ------------------------------------- verification info

  
    companyAddress :{   
        place:String,
        city:{
            type: String,
         
            trim:true,
            maxlength:50
        },
        state:{
            type:String,
            trim:true,
            maxlength:50
        },
        country:{
            type:String,
            trim:true,
            // required:[true,"country in address should be required"],
            maxlength:[50, 'No country name conatin more 50 words'],
        },
        region:{
            type:String,
            trim:true,
            // required:[true,"country in address should be required"],
            maxlength:[50, 'No country name conatin more 50 words'],
        },
        PIN:{
            type:Number,
          
            // validate :{
            //     validator: v =>{return allValidator.isPostalCode(new String(v))},
            //     message: 'PIN code is invalid',
            // }
        },
        gstinNumber:{type:Number},
        registered:{
            type : Boolean,
     
        },
        incubatedAt:{
            type:String,
            maxlength:60,
            
        },
        registrationDate:{
            type: Date,
            // required: [function () {return this.registered},"register date is required"],
        },
        registeredName:{type: String,},
        
    },
    verificationRequest:Boolean,
    verificationStatus:Boolean,
    startupCIN:{
        type: String,
        // required: [function () {return this.registered},"CIN no. is required"], 
        // validate:{
        //     validator: v =>{ return /^([LUu]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/.test(v)},
        //     message: props => `${props.value} is not a CIN number`
        // },// CIN Validation /^([LUu]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/
        
    },
 
    companyDocs : {
        addressProof:{ type:String },
        gSTIN:{type:String},
        cINDocument:{type:String},
        companyPAN:{type:String},
        others:{type:String}
    },
   
    foundersDetail: { 
        fullName: {
            type:String,
          
            trim:true,
            maxlength: 80,
            minlength:[3,'Full name contain more than 3 letters'],
        },
        linkedin:{
            type:String,
            trim:true,
         
            validate: { 
                validator: allValidator.isURL,
                message: 'Must be a Valid linkedin URL' 
              }
        },
        address:{
            type:String,
            trim:true,
           
        }
    },

    //
    // createdAt: {
    //     type: Date,
    //     immutable: true,
    //     default: () => Date.now(),
    // },

    // updatedAt: {
    //     type: Date,
    //     default: () => Date.now(),
    // },
});

const Startup = new mongoose.model('startUp', startupUserSchema);

module.exports = Startup;
