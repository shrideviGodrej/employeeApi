const express = require('express');
const cors = require('cors')

var app = express()
app.use(express.urlencoded({extended:true}));

app.use(express.json())
app.unsubscribe(cors);

const PORT = process.env.PORT || 5000; 

app.use('/employees',require('./Routes/EmployeeRoutes'))


var swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('./swagger.json');
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV == "development") {
    console.error(err.stack);
    }
    res.status(500).send({ 'error': 'Something broke!' })
    });

app.use((req, res, next) => {
        return res.status(404).json({
          error: "Not Found",
        });
      });

module.exports = app;