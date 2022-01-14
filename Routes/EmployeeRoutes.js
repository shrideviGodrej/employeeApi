const { Router } = require('express')
const { EmployeeServices } = require('../helpers/EmployeeHelper')

var employeerouter = Router()
var empSvc = new EmployeeServices()

//let emps = {LocationId:"Mumbai",EmpCode:"2777",Name:"Test ABB",Age:"23",Department:"L1",Designation:"Manager"}
/*employeerouter.get("/", async (req, res) => {
    
    let emps = await empSvc.getAllEmployees()
        .catch(err => res.status(500).json({ 'message': 'Unable to read the employees' }));
    if (emps) {
        res.status(200).json(emps);
    }
});*/

employeerouter.get("/demo", async(req,res)=>{
   
        res.status(200).json({ 'data':'Sample data'});
    
});
employeerouter.get("/", async(req,res)=>{
    let emps = await empSvc.getAllEmployees()
        .catch(err=>{
            console.log(err);
            res.status(500).json({ 'message':'Unable to read the employees' });
        })
    if(emps){
        res.status(200).json(emps);
    }
});

employeerouter.get('/location/:locId', async(req,res)=>{
    let locationId = req.params["locId"];
    let result = await empSvc.getEmployeesByLocation(locationId)
        .catch(err=>{
            console.log(err);
            res.status(500).json({'message':'Error in fetching employees data'})
        })
    if(result){
        res.status(200).json(result);
    }
});

//Get a single employee
//GET /employees/LocationId/:locId/EmpCode/:ecode
employeerouter.get("/location/:locId/emp/:ecode",async(req,res)=>{
    let locationId = req.params["locId"];
    let empCode = req.params["ecode"];
    let result = await empSvc.getEmployee(locationId,empCode)
        .catch(err=>{
            console.log(err);
            res.status(500).json({ 'message': 'Unable to get employee details'})
        })
    if(result){
        res.status(200).json(result);
    }else{
        res.status(404).json({'message':'Employee not found'})
    }
});

employeerouter.post("/", async (req, res) => {
    let emp = req.body
    console.log(emp)
    let result = await empSvc.addEmployee(emp)
        .catch(err => 
            {console.log(err);
            res.status(500).json({ 'message': 'Unable to add the employees' + err })});
    if (result) {
        res.status(201).json(result);
    }
});

employeerouter.delete("/location/:locId/empcode/:ecode",async(req,res)=>{
    let locationId = req.params["locId"];
    let empCode = req.params["ecode"];
    let result = await empSvc.deleteEmployee(locationId,empCode)
        .catch(err=>{
            console.log(err);
            res.status(500).json({'message':'Error in deleting'})
        })
    if(result){
        res.status(200).json({'message':'Deleted'})
    }

});

//Update the employee
//PUT /employees/location/:locId/empcode/:ecode
employeerouter.put("/location/:locId/empcode/:ecode",async(req,res)=>{
    let locationId = req.params["locId"];
    let empCode = req.params["ecode"];
    let employee = req.body;
    //Implement here

});
module.exports =  employeerouter