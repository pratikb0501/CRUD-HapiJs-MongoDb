const Hapi = require('@hapi/hapi');
const Mongoose = require('mongoose');
const Joi = require('joi')



const init = async () => {
    const server = await Hapi.server({
        port: 3000,
        host: 'localhost'
    })

    Mongoose.connect('mongodb://localhost/TechNative', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("Connected to MongoDb"))
        .catch((error) => console.log("Error while connecting to MongoDb", error))

    const empSchema = Mongoose.Schema({
        firstName: String,
        lastName: String,
        email: String,
        mobile: String,
        gender: String,
        designation: String,
        dateOfJoining: Date,
        reportingManager: String,
        salary: Number,
        employeeCode: Number,
        location: String,
        state: String,
        country: String,
        department: String,
        isDeleted: {
            type: Date,
            default: null
        }
    })

    const Employee = Mongoose.model('Employee', empSchema);

    server.route([
        {
            method: "POST",
            path: '/api/employee',
            handler: async (request, h) => {
                const data = new Employee(request.payload);
                data.save((error) => {
                    if (error) return console.log("Error occured while inserting data :", error)
                    console.log("Document has been added to collection successfully!!")
                })
                return h.response(data);
            },
            options: {
                validate: {
                    payload: Joi.object({
                        firstName: Joi.string().min(2).required(),
                        lastName: Joi.string().min(2).required(),
                        email: Joi.string().email(),
                        mobile: Joi.string().length(10),
                        gender: Joi.string().valid('Male', 'Female'),
                        designation: Joi.string().min(3),
                        dateOfJoining: Joi.date(),
                        reportingManager: Joi.string().min(2),
                        salary: Joi.number().integer(),
                        employeeCode: Joi.number().integer(),
                        location: Joi.string().min(3),
                        state: Joi.string().min(3),
                        country: Joi.string().min(3),
                        department: Joi.string().min(2)
                    }),
                    failAction: 'log'
                }
            }
        },
        {
            method: "PUT",
            path: '/api/employee/{id}',
            handler: async (request, h) => {
                query = { _id: request.params.id }
                console.log(query)
                let result = await Employee.findByIdAndUpdate(query, request.payload, { new: true }, (error, result) => {
                    if (error) console.log("Error occured while updating data :", error)
                    console.log("Document has been updated to collection successfully!!")
                })
                return h.response(result);
            }
        },
        {
            method: "GET",
            path: '/api/employees/{query?}',
            handler: async (request, h) => {
                let filterQuery = {};
                if (request.query.firstname) filterQuery.firstName = request.query.firstname;
                if (request.query.lastname) filterQuery.lastName = request.query.lastname;
                if (request.query.email) filterQuery.email = request.query.email;
                if (request.query.gender) filterQuery.gender = request.query.gender;
                if (request.query.firstname) filterQuery.firstName = request.query.firstname;
                if (request.query.designation) filterQuery.designation = request.query.designation;
                if (request.query.reportingmanager) filterQuery.reportingManager = request.query.reportingmanager;
                if (request.query.location) filterQuery.location = request.query.location;
                if (request.query.department) filterQuery.department = request.query.department;

                let result = await Employee.find(filterQuery, (error, result) => {
                    if (error) console.log("Error in finding the docs : ", error)
                    console.log("Document found in the collection")
                })
                return h.response(result)
            }
        },
        {
            method: "GET",
            path: '/api/employees/count/{query?}',
            handler: async (request, h) => {

                let filterQuery = {};
                if (request.query.firstname) filterQuery.firstName = request.query.firstname;
                if (request.query.lastname) filterQuery.lastName = request.query.lastname;
                if (request.query.email) filterQuery.email = request.query.email;
                if (request.query.gender) filterQuery.gender = request.query.gender;
                if (request.query.firstname) filterQuery.firstName = request.query.firstname;
                if (request.query.designation) filterQuery.designation = request.query.designation;
                if (request.query.reportingmanager) filterQuery.reportingManager = request.query.reportingmanager;
                if (request.query.location) filterQuery.location = request.query.location;
                if (request.query.department) filterQuery.department = request.query.department;

                let result = await Employee.count(filterQuery, (error, result) => {
                    if (error) console.log("Error in counting the docs : ", error)
                    console.log("Document counted in the collection")
                })
                return h.response(result)
            }
        },
        {
            method: "DELETE",
            path: "/api/employee/{id}",
            handler: async (request, h) => {
                let query = { _id: request.params.id };
                let result = await Employee.findByIdAndUpdate(query, { $set: { isDeleted: Date.now() } }, { new: true }, (error, result) => {
                    if (error) console.log("Error in deleted the docs : ", error)
                    console.log("Document soft deleted in the collection")
                })
                return h.response(result)
            }
        }

    ])

    await server.start().then(() => console.log('Server started at ', server.info.uri))
        .catch(error => console.log("Error occured while starting server", error))
}
init();