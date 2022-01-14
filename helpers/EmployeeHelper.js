const { ddbclient } = require('./Ddbhelper')

const { ScanCommand, PutItemCommand, QueryCommand, GetItemCommand, DeleteItemCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb')
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb')
class EmployeeServices {

    constructor() {
        this.TABLENAME = process.env.TABLENAME || "Employees"
    }
    /*/ getAllEmployees() {
         let params = {
             TableName: this.TABLENAME,
             Select: 'ALL_ATTRIBUTES', //https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/scancommandinput.html#select
             // FilterExpression: 'Department = :dept',
             // ExpressionAttributeValues: {
             // ':dept' : {S: 'IT'}
             // },
             // ProjectionExpression: '#Ename, Age, Designation, Department, #Loc',
             // ExpressionAttributeNames: {
             // "#Ename":"Name",
             // "#Loc":"Location"
             // }
 
         }
         return ddbclient.send(new ScanCommand(params));
        
     }*/

    async getAllEmployees() {
        let params = {
            TableName: this.TABLENAME,
            //Select: 'ALL_ATTRIBUTES', //https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/scancommandinput.html#select
            // FilterExpression: 'Department = :dept',
            // ExpressionAttributeValues: {
            //     ':dept' : {S: 'IT'}
            // },
            // ProjectionExpression: '#Ename, Age, Designation, Department, #Loc',
            // ExpressionAttributeNames: {
            //     "#Ename":"Name",
            //     "#Loc":"Location"
            // }            
        }
        let result = await ddbclient.send(new ScanCommand(params))
            .catch(err => {
                console.log("Cust err:" + err);
                return Promise.reject(err);
            });
        let employees = [];
        result.Items.forEach((item) => employees.push(unmarshall(item)));
        return Promise.resolve(employees)
    }
    addEmployee(employee) {
        console.log(employee)

        let params = {
            TableName: this.TABLENAME,
            Item: marshall(employee)
            /*{
                LocationId: {S:employee.LocationId},
                EmployeeCode: {S : employee.EmployeeCode},
                Name: {S :employee.Name},
                Age:{N :employee.Age},
                Location:{S: employee.Location},
                Designation:{S:employee.Designation},
                Department:{S:employee.Department}
            }*/

        }

        console.log(params)
        return ddbclient.send(new PutItemCommand(params))
    }
    async getEmployee(locationId, empCode) {
        console.log(locationId)
        console.log(empCode)
        var params = {
            TableName: this.TABLENAME,
            Key: {
                "LocationId": { "S": locationId },
                "EmployeeCode": { "S": empCode }
            }
        };
        let result = await ddbclient.send(new GetItemCommand(params))
            .catch(err => Promise.reject(err));

        return Promise.resolve(result.Item ? unmarshall(result.Item) : undefined)
    }

    async getEmployeesByLocation(locationId) {
        var params = {
            TableName: this.TABLENAME,
            KeyConditionExpression: "LocationId = :locId",
            ExpressionAttributeValues: {
                ":locId": { 'S': locationId }
            }
        };
        let result = await ddbclient.send(new QueryCommand(params))
            .catch(err => Promise.reject(err));
        let employees = [];
        result.Items.forEach((item) => employees.push(unmarshall(item)));
        return Promise.resolve(employees)
    }

    deleteEmployee(locationId, empCode) {
        var params = {
            TableName: this.TABLENAME,
            Key: {
                "LocationID": { "S": locationId },
                "EmpCode": { "S": empCode }
            }
        };
        return ddbclient.send(new DeleteItemCommand(params));
    }


}
module.exports = { EmployeeServices }